import { type ParsedArgs, EXIT_CODES } from "../types";

const VALID_PROVIDERS = ["claude", "openai", "gemini"] as const;
const VALID_SEARCH_BACKENDS = ["ddg"] as const;

export function parseArgs(argv: string[]): ParsedArgs {
  const result: ParsedArgs = {
    prompt: "",
    mode: "llm",
    provider: "claude",
    stream: true,
    maxResults: 10,
    help: false,
  };

  let hasExplicitProvider = false;
  let hasSearchBackend = false;
  const promptParts: string[] = [];

  let i = 0;
  while (i < argv.length) {
    const arg = argv[i];

    switch (arg) {
      case "-h":
      case "--help":
        result.help = true;
        break;

      case "-ns":
      case "--no-stream":
        result.stream = false;
        break;

      case "--claude":
        result.provider = "claude";
        hasExplicitProvider = true;
        break;

      case "--provider": {
        const provider = argv[++i];
        if (!provider) {
          console.error("--provider requires a value");
          process.exit(EXIT_CODES.GENERAL_ERROR);
        }
        if (!VALID_PROVIDERS.includes(provider as typeof VALID_PROVIDERS[number])) {
          console.error(`Unknown provider: ${provider}`);
          process.exit(EXIT_CODES.UNKNOWN_PROVIDER);
        }
        result.provider = provider as "claude" | "openai" | "gemini";
        hasExplicitProvider = true;
        break;
      }

      case "--ddg":
        result.searchBackend = "ddg";
        result.mode = "search";
        hasSearchBackend = true;
        break;

      case "--search-backend": {
        const backend = argv[++i];
        if (!backend) {
          console.error("--search-backend requires a value");
          process.exit(EXIT_CODES.GENERAL_ERROR);
        }
        if (!VALID_SEARCH_BACKENDS.includes(backend as typeof VALID_SEARCH_BACKENDS[number])) {
          console.error(`Unknown search backend: ${backend}`);
          process.exit(EXIT_CODES.UNKNOWN_PROVIDER);
        }
        result.searchBackend = backend as "ddg";
        result.mode = "search";
        hasSearchBackend = true;
        break;
      }

      case "--max-results": {
        const numStr = argv[++i];
        if (!numStr) {
          console.error("--max-results requires a value");
          process.exit(EXIT_CODES.GENERAL_ERROR);
        }
        const num = parseInt(numStr, 10);
        if (isNaN(num) || num < 1) {
          console.error("--max-results must be a positive number");
          process.exit(EXIT_CODES.GENERAL_ERROR);
        }
        result.maxResults = Math.min(num, 30);
        break;
      }

      case "--model": {
        const model = argv[++i];
        if (!model) {
          console.error("--model requires a value");
          process.exit(EXIT_CODES.GENERAL_ERROR);
        }
        result.model = model;
        break;
      }

      default:
        // Non-flag argument is part of the prompt
        if (!arg.startsWith("-")) {
          promptParts.push(arg);
        } else {
          console.error(`Unknown option: ${arg}`);
          process.exit(EXIT_CODES.GENERAL_ERROR);
        }
    }
    i++;
  }

  // Join all prompt parts into a single string
  result.prompt = promptParts.join(" ");

  // Validate mutual exclusivity
  if (hasSearchBackend && hasExplicitProvider) {
    console.error("--search-backend and --provider are mutually exclusive");
    process.exit(EXIT_CODES.GENERAL_ERROR);
  }

  return result;
}
