import type { ParsedArgs } from "../types";
import { EXIT_CODES } from "../types";
import { ClaudeProvider } from "./claude";
import { OpenAIProvider } from "./openai";
import { GeminiProvider } from "./gemini";

const providers = {
  claude: new ClaudeProvider(),
  openai: new OpenAIProvider(),
  gemini: new GeminiProvider(),
};

export async function runLLM(args: ParsedArgs): Promise<void> {
  const provider = providers[args.provider];

  if (!provider) {
    console.error(`Unknown provider: ${args.provider}`);
    process.exit(EXIT_CODES.UNKNOWN_PROVIDER);
  }

  await provider.execute(args.prompt, {
    model: args.model,
    stream: args.stream,
  });
}
