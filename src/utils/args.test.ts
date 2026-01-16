import { describe, expect, test } from "bun:test";
import { parseArgs } from "./args";

describe("parseArgs", () => {
  test("returns defaults with just a prompt", () => {
    const result = parseArgs(["hello world"]);
    expect(result.prompt).toBe("hello world");
    expect(result.mode).toBe("llm");
    expect(result.provider).toBe("claude");
    expect(result.stream).toBe(true);
    expect(result.maxResults).toBe(10);
    expect(result.help).toBe(false);
  });

  test("parses -h flag", () => {
    const result = parseArgs(["-h"]);
    expect(result.help).toBe(true);
  });

  test("parses --help flag", () => {
    const result = parseArgs(["--help"]);
    expect(result.help).toBe(true);
  });

  test("parses -ns flag", () => {
    const result = parseArgs(["-ns", "prompt"]);
    expect(result.stream).toBe(false);
  });

  test("parses --no-stream flag", () => {
    const result = parseArgs(["--no-stream", "prompt"]);
    expect(result.stream).toBe(false);
  });

  test("parses --provider claude", () => {
    const result = parseArgs(["--provider", "claude", "prompt"]);
    expect(result.provider).toBe("claude");
    expect(result.mode).toBe("llm");
  });

  test("parses --provider openai", () => {
    const result = parseArgs(["--provider", "openai", "prompt"]);
    expect(result.provider).toBe("openai");
  });

  test("parses --provider gemini", () => {
    const result = parseArgs(["--provider", "gemini", "prompt"]);
    expect(result.provider).toBe("gemini");
  });

  test("parses --search-backend ddg", () => {
    const result = parseArgs(["--search-backend", "ddg", "query"]);
    expect(result.searchBackend).toBe("ddg");
    expect(result.mode).toBe("search");
  });

  test("parses --ddg shorthand", () => {
    const result = parseArgs(["--ddg", "query"]);
    expect(result.searchBackend).toBe("ddg");
    expect(result.mode).toBe("search");
  });

  test("parses --claude shorthand", () => {
    const result = parseArgs(["--claude", "prompt"]);
    expect(result.provider).toBe("claude");
    expect(result.mode).toBe("llm");
  });

  test("parses --max-results", () => {
    const result = parseArgs(["--search-backend", "ddg", "--max-results", "5", "query"]);
    expect(result.maxResults).toBe(5);
  });

  test("caps --max-results at 30", () => {
    const result = parseArgs(["--search-backend", "ddg", "--max-results", "100", "query"]);
    expect(result.maxResults).toBe(30);
  });

  test("parses --model", () => {
    const result = parseArgs(["--model", "sonnet", "prompt"]);
    expect(result.model).toBe("sonnet");
  });

  test("handles multiple flags together", () => {
    const result = parseArgs(["--no-stream", "--model", "haiku", "my prompt"]);
    expect(result.stream).toBe(false);
    expect(result.model).toBe("haiku");
    expect(result.prompt).toBe("my prompt");
  });

  test("joins multiple words without quotes into single prompt", () => {
    const result = parseArgs(["best", "restaurants", "in", "honolulu"]);
    expect(result.prompt).toBe("best restaurants in honolulu");
  });

  test("joins words with flags interspersed", () => {
    const result = parseArgs(["--model", "sonnet", "what", "is", "the", "weather"]);
    expect(result.prompt).toBe("what is the weather");
    expect(result.model).toBe("sonnet");
  });
});
