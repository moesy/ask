#!/usr/bin/env bun

import { parseArgs } from "./utils/args";
import { runLLM } from "./providers";
import { runSearch } from "./search";
import { EXIT_CODES } from "./types";

const HELP_TEXT = `ask - Query LLMs or search the web

Usage:
  ask [options] "<prompt>"

Options:
  -h, --help                  Show this help message
  -ns, --no-stream            Disable streaming (LLM only)
  --provider <name>           LLM provider: claude (default), openai, gemini
  --search-backend <name>     Search engine: ddg (mutually exclusive with --provider)
  --max-results <N>           Number of search results (default: 10, max: 30)
  --model <name>              Model name passed to LLM provider

Examples:
  ask "What is TypeScript?"
  ask --no-stream "Hello"
  ask --provider claude --model sonnet "Summarize this"
  ask --search-backend ddg "best ramen in honolulu"
  ask --search-backend ddg --max-results 5 "bun runtime"
`;

async function main() {
  const args = parseArgs(Bun.argv.slice(2));

  if (args.help) {
    console.log(HELP_TEXT);
    process.exit(EXIT_CODES.SUCCESS);
  }

  if (!args.prompt) {
    console.error("Error: No prompt provided");
    console.log(HELP_TEXT);
    process.exit(EXIT_CODES.GENERAL_ERROR);
  }

  if (args.mode === "search") {
    await runSearch(args);
  } else {
    await runLLM(args);
  }
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(EXIT_CODES.GENERAL_ERROR);
});
