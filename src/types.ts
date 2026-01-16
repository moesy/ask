// Exit codes
export const EXIT_CODES = {
  SUCCESS: 0,
  GENERAL_ERROR: 1,
  UNKNOWN_PROVIDER: 2,
} as const;

// CLI parsed arguments
export interface ParsedArgs {
  prompt: string;
  mode: "llm" | "search";

  // LLM-specific options
  provider: "claude" | "openai" | "gemini";
  model?: string;
  stream: boolean;

  // Search-specific options
  searchBackend?: "ddg";
  maxResults: number;

  // Meta
  help: boolean;
}

// LLM Provider interface
export interface LLMOptions {
  model?: string;
  stream: boolean;
}

export interface LLMProvider {
  name: string;
  execute(prompt: string, options: LLMOptions): Promise<void>;
}

// Search interfaces
export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface SearchBackend {
  name: string;
  search(query: string, maxResults: number): Promise<SearchResult[]>;
}

// Claude streaming JSON types
export interface ClaudeStreamEvent {
  type: string;
  event?: {
    type: string;
    delta?: {
      type: string;
      text?: string;
    };
  };
}
