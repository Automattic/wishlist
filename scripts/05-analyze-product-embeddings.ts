// @ts-check
import { EmbeddingModel, FlagEmbedding } from 'fastembed';
import Database from 'better-sqlite3';
import * as sqliteVec from 'sqlite-vec';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// Get current file path and resolve root directory for imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// Setup database connection
const db = new Database(`${projectRoot}/db/products.db`);
sqliteVec.load(db);

// Type for product with ID
type DbProduct = {
  id: number;
  productName: string;
  description: string;
  shopName: string;
  productUrl: string;
  imageUrl: string;
  priceMin: number | null;
  priceMax: number | null;
  currency: string | null;
};

// Type for product embedding
type EmbeddingRow = {
  productId: number;
  productEmbedding: any;
};

// Initialize the embedding model
const embeddingModel = await FlagEmbedding.init({
  model: EmbeddingModel.BGEBaseENV15
});

// Query to get a product by ID
const GET_PRODUCT_BY_ID = db.prepare(`
  SELECT * FROM products WHERE id = ?
`);

// Query to get a product's embedding
const GET_PRODUCT_EMBEDDING = db.prepare(`
  SELECT * FROM product_vectors WHERE productId = ?
`);

// Query to search for similar products
const FIND_SIMILAR_PRODUCTS = db.prepare(`
  SELECT product_vectors.distance, products.*
  FROM product_vectors
  INNER JOIN products ON product_vectors.productId = products.id
  WHERE product_vectors.productEmbedding MATCH ? AND k = 10 AND products.id != ?
  ORDER BY product_vectors.distance
`);

// Generate probe phrases to test which concepts the embedding represents
const generateProbeTerms = () => {
  // Common product categories and concepts
  const categories = [
    'clothing', 'furniture', 'electronics', 'food', 'jewelry', 'books', 
    'toys', 'health', 'beauty', 'sports', 'home', 'kitchen', 'office',
    'art', 'craft', 'music', 'tech', 'travel', 'outdoor', 'eco-friendly',
    'pets', 'animal', 'reptile', 'cage', 'container', 'aquarium', 'terrarium',
    'computer', 'keyboard', 'mouse', 'gaming', 'accessories', 'peripheral'
  ];
  
  // Common attributes
  const attributes = [
    'expensive', 'cheap', 'luxury', 'affordable', 'handmade', 'vintage', 
    'modern', 'classic', 'durable', 'sustainable', 'quality', 'trendy',
    'elegant', 'casual', 'professional', 'unique', 'simple', 'colorful',
    'minimalist', 'artisan', 'natural', 'organic', 'synthetic', 'innovative',
    'replacement', 'part', 'accessory', 'add-on', 'component', 'wireless',
    'mechanical', 'RGB', 'customizable', 'fast', 'responsive'
  ];
  
  // Material types
  const materials = [
    'wooden', 'plastic', 'metal', 'glass', 'ceramic', 'leather', 'cotton',
    'wool', 'silk', 'paper', 'stone', 'rubber', 'fabric', 'steel', 'gold',
    'silver', 'aluminum', 'carbon', 'bamboo', 'marble', 'concrete', 'silicone'
  ];
  
  // Use cases
  const useCases = [
    'gift', 'home decoration', 'personal use', 'office use', 'travel',
    'kitchen', 'bathroom', 'bedroom', 'living room', 'outdoor', 'garden',
    'fitness', 'entertainment', 'education', 'work', 'hobby', 'collection',
    'pet care', 'animal habitat', 'reptile enclosure', 'cage accessory',
    'gaming', 'typing', 'streaming', 'content creation', 'programming'
  ];

  // Common sentiments
  const sentiments = [
    'I love', 'I need', 'best', 'popular', 'recommended',
    'top-rated', 'must-have', 'essential', 'perfect for', 'ideal'
  ];
  
  // Return all probe terms
  return [
    ...categories, 
    ...attributes, 
    ...materials,
    ...useCases,
    ...sentiments.flatMap(s => categories.map(c => `${s} ${c}`))
  ];
};

// Create readline interface for REPL
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== Product Embedding Analyzer ===');
console.log('Enter a product ID to analyze its embedding vector');
console.log('Type "exit" or press Ctrl+C to quit');
console.log('');

// REPL function
const askQuestion = () => {
  rl.question('Product ID > ', async (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    const productId = parseInt(input.trim(), 10);
    if (isNaN(productId)) {
      console.log('Please enter a valid product ID');
      askQuestion();
      return;
    }

    try {
      // Get product information
      const product = GET_PRODUCT_BY_ID.get(productId) as DbProduct | undefined;
      
      if (!product) {
        console.log(`No product found with ID ${productId}`);
        askQuestion();
        return;
      }
      
      console.log('\n=== Product Information ===');
      console.log(`ID: ${product.id}`);
      console.log(`Name: ${product.productName}`);
      console.log(`Shop: ${product.shopName}`);
      console.log(`Description: ${product.description}`);
      console.log(`URL: ${product.productUrl}`);
      console.log('');
      
      // Generate a new embedding for the product's name and description
      // We'll use this for comparison since we can't easily extract the raw vector from SQLite-Vec
      const newEmbedding = embeddingModel.embed([`${product.productName} ${product.description}`]);
      let productVector: number[] = [];
      
      for await (const batch of newEmbedding) {
        productVector = batch[0];
        break; // We only need the first batch
      }
      
      // Find similar products using the database's built-in vector search
      console.log('=== Similar Products ===');
      const embeddingRow = GET_PRODUCT_EMBEDDING.get(productId) as EmbeddingRow | undefined;
      
      if (!embeddingRow) {
        console.log(`No embedding found for product ID ${productId}`);
        askQuestion();
        return;
      }
      
      const similarProducts = FIND_SIMILAR_PRODUCTS.all(embeddingRow.productEmbedding, productId) as (DbProduct & { distance: number })[];
      
      if (similarProducts.length === 0) {
        console.log('No similar products found');
      } else {
        similarProducts.forEach((similar, index) => {
          console.log(`${index + 1}. ${similar.productName} (ID: ${similar.id}, Shop: ${similar.shopName})`);
          console.log(`   Distance: ${similar.distance.toFixed(4)}`);
          console.log('');
        });
      }
      
      // Analyze which concepts the embedding is likely representing
      console.log('=== Embedding Concept Analysis ===');
      console.log('Testing probe terms to see which concepts the embedding might represent...');
      
      if (productVector.length === 0) {
        console.log('Could not create embedding for analysis');
        askQuestion();
        return;
      }
      
      const probeTerms = generateProbeTerms();
      const probeEmbeddings = embeddingModel.embed(probeTerms);
      
      let termScores = [];
      
      for await (const batch of probeEmbeddings) {
        for (let i = 0; i < batch.length; i++) {
          // Calculate L2 (Euclidean) distance between the embeddings
          // This matches SQLite-Vec's distance calculation
          const distance = calculateL2Distance(productVector, batch[i]);
          termScores.push({ 
            term: probeTerms[i], 
            distance
          });
        }
      }
      
      // Sort by lowest distance (highest similarity)
      termScores.sort((a, b) => a.distance - b.distance);
      
      console.log('\nTop 20 concepts most related to this product:');
      termScores.slice(0, 20).forEach((score, index) => {
        console.log(`${index + 1}. "${score.term}" (distance: ${score.distance.toFixed(4)})`);
      });
      
    } catch (error) {
      console.error('Error analyzing product:', error);
    }
    
    console.log('\n');
    askQuestion(); // Ask for next query
  });
};

// Helper function to calculate L2 (Euclidean) distance between two vectors
function calculateL2Distance(vec1: number[], vec2: number[]): number {
  let sum = 0;
  for (let i = 0; i < vec1.length; i++) {
    const diff = vec1[i] - vec2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

// Start the REPL
askQuestion();

// Handle CTRL+C
rl.on('SIGINT', () => {
  console.log('\nExiting REPL');
  rl.close();
}); 