import { BaseLLMProvider } from "./base";
import type { LLMOptions } from "../types";
import { EXIT_CODES } from "../types";

export class OpenAIProvider extends BaseLLMProvider {
  name = "openai";

  async execute(_prompt: string, _options: LLMOptions): Promise<void> {
    console.error("OpenAI provider not yet implemented");
    process.exit(EXIT_CODES.GENERAL_ERROR);
  }
}
