import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai"
import { ChatGoogle } from "@langchain/google";

type modelId = "gpt-5-mini" | "gemini-2.5-flash-lite" | "claude-opus-4-6"
type provider = "openai" | "google" | "anthropic"
type modelTier = "free" | "subscription"
type modelConfig = {
  provider: provider,
  tier: modelTier,
  options?: Record<string, unknown>
}

const MODEL_REGISTRY: Record<modelId, modelConfig> = {
  "gpt-5-mini": {
    provider: "openai",
    tier: "free",
    options: {
      Reasoning: {
        effort: "minimal"
      }
    }
  },
  "gemini-2.5-flash-lite": {
    provider: "google",
    tier: "free"
  },
  "claude-opus-4-6": {
    provider: "anthropic",
    tier: "subscription"
  }
}

function getDefaultModel() {
  return new ChatOpenAI({
    model: "gpt-5-mini",
    apiKey: process.env.OPENAI_API_KEY
  })
}

function createModel(modelId: modelId, config: modelConfig) {
  if (config.provider == "openai") {
    return new ChatOpenAI({
      model: modelId,
      apiKey: process.env.OPENAI_API_KEY,
      ...config.options
    })
  } else if (config.provider == "anthropic") {
    return new ChatAnthropic({
      model: modelId,
      apiKey: process.env.ANTHROPIC_API_KEY,
      ...config.options
    })
  }
  else if (config.provider == "google") {
    return new ChatGoogle({
      model: modelId,
      apiKey: process.env.GOOGLE_API_KEY,
      ...config.options
    });
  }
  return getDefaultModel()
}

export function getDynamicModel(modelId: modelId) {
  const config = MODEL_REGISTRY[modelId]
  if (!config) return getDefaultModel()

  if (config.tier = "free") {
    return createModel(modelId,config)
  } else {
    //Do some subscription task \
    return getDefaultModel()
  }
  return getDefaultModel()
}