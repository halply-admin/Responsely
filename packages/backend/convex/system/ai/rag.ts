import { openai } from "@ai-sdk/openai";
import { RAG } from "@convex-dev/rag";
import { components } from "../../_generated/api";

// TODO: Change embedding model to use gemini https://ai-sdk.dev/docs/ai-sdk-core/embeddings
const rag = new RAG(components.rag, {
  textEmbeddingModel: openai.embedding("text-embedding-3-small"),
  embeddingDimension: 1536,
});

export default rag;

