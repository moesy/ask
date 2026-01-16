import type { ParsedArgs, SearchResult } from "../types";
import { EXIT_CODES } from "../types";
import { DuckDuckGoSearch } from "./ddg";

const backends = {
  ddg: new DuckDuckGoSearch(),
};

export async function runSearch(args: ParsedArgs): Promise<void> {
  const backend = backends[args.searchBackend || "ddg"];

  if (!backend) {
    console.error(`Unknown search backend: ${args.searchBackend}`);
    process.exit(EXIT_CODES.UNKNOWN_PROVIDER);
  }

  try {
    const results = await backend.search(args.prompt, args.maxResults);
    printResults(results);
  } catch (err) {
    console.error(`Search failed: ${(err as Error).message}`);
    process.exit(EXIT_CODES.GENERAL_ERROR);
  }
}

function printResults(results: SearchResult[]): void {
  if (results.length === 0) {
    console.log("No results found.");
    return;
  }

  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.title}`);
    console.log(`   ${result.url}`);
    if (result.snippet) {
      console.log(`   ${result.snippet}`);
    }
    console.log();
  });
}
