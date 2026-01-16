import { BaseSearchBackend } from "./base";
import type { SearchResult } from "../types";

interface DdgrResult {
  abstract: string;
  title: string;
  url: string;
}

export class DuckDuckGoSearch extends BaseSearchBackend {
  name = "ddg";

  async search(query: string, maxResults: number): Promise<SearchResult[]> {
    // Check if ddgr is installed
    const which = Bun.spawnSync(["which", "ddgr"]);
    if (which.exitCode !== 0) {
      throw new Error(
        "ddgr is not installed. Install it with your package manager:\n" +
          "  Arch: pacman -S ddgr\n" +
          "  macOS: brew install ddgr\n" +
          "  Ubuntu: apt install ddgr\n" +
          "  https://github.com/jarun/ddgr"
      );
    }

    const proc = Bun.spawn(["ddgr", "--json", "--noua", "--np", "-n", String(maxResults), query], {
      stdout: "pipe",
      stderr: "pipe",
    });

    const output = await new Response(proc.stdout).text();
    const stderr = await new Response(proc.stderr).text();
    const exitCode = await proc.exited;

    if (exitCode !== 0) {
      throw new Error(`ddgr failed: ${stderr || "unknown error"}`);
    }

    if (!output.trim()) {
      return [];
    }

    const results: DdgrResult[] = JSON.parse(output);

    return results.map((r) => ({
      title: r.title,
      url: r.url,
      snippet: r.abstract,
    }));
  }
}
