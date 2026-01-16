import type { LLMOptions, LLMProvider } from "../types";

export abstract class BaseLLMProvider implements LLMProvider {
  abstract name: string;
  abstract execute(prompt: string, options: LLMOptions): Promise<void>;
}
