import { EmbeddingModel, FlagEmbedding } from 'fastembed';

const embeddingModel = await FlagEmbedding.init({
  model: EmbeddingModel.BGESmallENV15
});

console.log(123, embeddingModel);
