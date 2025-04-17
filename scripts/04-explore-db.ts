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

// Initialize the embedding model
const embeddingModel = await FlagEmbedding.init({
  model: EmbeddingModel.BGEBaseENV15
});

// Create the query to search products using vector embeddings
const PRODUCT_VECTORS_QUERY = db.prepare(`
  SELECT product_vectors.distance, products.*
  FROM product_vectors
  INNER JOIN products ON product_vectors.productId = products.id
  WHERE product_vectors.productEmbedding MATCH ? AND k = 10
  ORDER BY product_vectors.distance
`);

// Type for product result with distance
type ProductVectorResult = {
  distance: number;
} & DbProduct;

// Create readline interface for REPL
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== Product Vector Search REPL ===');
console.log('Type a search query to find matching products');
console.log('Type "exit" or press Ctrl+C to quit');
console.log('Type "analyze ID" to analyze a specific product ID (uses the 05-analyze-product-embeddings.ts script)');
console.log('Type "compare TERM1 | TERM2" to compare the distance between two search terms');
console.log('');

// REPL function
const askQuestion = () => {
  rl.question('Search query > ', async (query) => {
    if (query.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    // Check if user wants to analyze a specific product ID
    if (query.toLowerCase().startsWith('analyze ')) {
      const productId = query.split(' ')[1];
      console.log(`To analyze product ID ${productId}, please run:`);
      console.log(`npx tsx scripts/05-analyze-product-embeddings.ts`);
      console.log('And enter the product ID when prompted.');
      console.log('');
      askQuestion();
      return;
    }

    // Check if user wants to compare distance between two terms
    if (query.toLowerCase().startsWith('compare ') && query.includes('|')) {
      const parts = query.substring(8).split('|').map(part => part.trim());
      if (parts.length >= 2) {
        await compareTerms(parts[0], parts[1]);
        askQuestion();
        return;
      }
    }

    if (!query.trim()) {
      console.log('Please enter a valid search query');
      askQuestion();
      return;
    }

    try {
      // Generate embedding for the query
      const start = Date.now();
      const embeddings = embeddingModel.embed([query]);
      
      let results: ProductVectorResult[] = [];
      
      // Get search results using the embedding
      for await (const batch of embeddings) {
        for (const embedding of batch) {
          results = results.concat(PRODUCT_VECTORS_QUERY.all(embedding) as ProductVectorResult[]);
        }
      }
      
      const duration = Date.now() - start;
      
      // Display results
      console.log(`\nFound ${results.length} results in ${duration}ms:`);
      console.log(`Note: Distance is L2 Euclidean distance - smaller is better (typical range: 0.7-1.0)\n`);
      
      if (results.length === 0) {
        console.log('No matching products found');
      } else {
        results.forEach((product, index) => {
          console.log(`${index + 1}. [ID: ${product.id}] ${product.productName} (${product.shopName})`);
          console.log(`   Price: ${product.priceMin ? `${product.currency || '$'}${product.priceMin}` : 'N/A'}`);
          console.log(`   Distance: ${product.distance.toFixed(4)}`);
          console.log(`   URL: ${product.productUrl}`);
          if (product.description) {
            console.log(`   Description: ${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}`);
          }
          console.log('');
        });
      }
    } catch (error) {
      console.error('Error searching products:', error);
    }
    
    console.log(''); // Add newline for readability
    askQuestion(); // Ask for next query
  });
};

// Helper function to compare the distance between two terms
async function compareTerms(term1: string, term2: string) {
  console.log(`\nComparing distances between "${term1}" and "${term2}"...`);
  
  try {
    // Generate embeddings for both terms
    const embeddings1 = embeddingModel.embed([term1]);
    const embeddings2 = embeddingModel.embed([term2]);
    
    let vector1: number[] = [];
    let vector2: number[] = [];
    
    for await (const batch of embeddings1) {
      vector1 = batch[0];
      break;
    }
    
    for await (const batch of embeddings2) {
      vector2 = batch[0];
      break;
    }
    
    // Calculate L2 distance (Euclidean)
    let sum = 0;
    for (let i = 0; i < vector1.length; i++) {
      const diff = vector1[i] - vector2[i];
      sum += diff * diff;
    }
    const distance = Math.sqrt(sum);
    
    console.log(`L2 Distance: ${distance.toFixed(4)}`);
    console.log('For reference:');
    console.log('- Identical terms would have distance 0');
    console.log('- Very similar terms typically have distance 0.4-0.7');
    console.log('- Different terms typically have distance 0.7-1.0');
    console.log('- Very different terms typically have distance > 1.0');
  } catch (error) {
    console.error('Error comparing terms:', error);
  }
  
  console.log('');
}

// Start the REPL
askQuestion();

// Handle CTRL+C
rl.on('SIGINT', () => {
  console.log('\nExiting REPL');
  rl.close();
}); 