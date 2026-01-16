import { BaseLLMProvider } from "./base";
import type { LLMOptions, ClaudeStreamEvent } from "../types";
import { EXIT_CODES } from "../types";

export class ClaudeProvider extends BaseLLMProvider {
  name = "claude";

  async execute(prompt: string, options: LLMOptions): Promise<void> {
    // Check if claude CLI is available
    const which = Bun.spawnSync(["which", "claude"]);
    if (which.exitCode !== 0) {
      console.error("claude not found in PATH");
      process.exit(EXIT_CODES.GENERAL_ERROR);
    }

    if (options.stream) {
      await this.executeStreaming(prompt, options.model);
    } else {
      await this.executeNonStreaming(prompt, options.model);
    }
  }

  private async executeStreaming(prompt: string, model?: string): Promise<void> {
    const args = [
      "-p",
      "--verbose",
      "--output-format",
      "stream-json",
      "--include-partial-messages",
      "--allowedTools",
      "WebSearch,WebFetch",
      "--permission-mode",
      "dontAsk",
    ];

    if (model) {
      args.push("--model", model);
    }

    args.push("--", prompt);

    const proc = Bun.spawn(["claude", ...args], {
      stdout: "pipe",
      stderr: "pipe",
    });

    const reader = proc.stdout.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let hasOutput = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep incomplete line in buffer

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const event: ClaudeStreamEvent = JSON.parse(line);

          // Extract text from content_block_delta events
          if (
            event.type === "stream_event" &&
            event.event?.type === "content_block_delta" &&
            event.event?.delta?.type === "text_delta" &&
            event.event?.delta?.text
          ) {
            // Write chunk directly without newline
            process.stdout.write(event.event.delta.text);
            hasOutput = true;
          }
        } catch {
          // Ignore malformed JSON lines
        }
      }
    }

    // Final newline if we had output
    if (hasOutput) {
      console.log();
    }

    const exitCode = await proc.exited;
    if (exitCode !== 0) {
      const stderr = await new Response(proc.stderr).text();
      if (stderr.trim()) {
        console.error(stderr);
      }
      process.exit(exitCode);
    }
  }

  private async executeNonStreaming(prompt: string, model?: string): Promise<void> {
    const args = [
      "-p",
      "--output-format",
      "text",
      "--allowedTools",
      "WebSearch,WebFetch",
      "--permission-mode",
      "dontAsk",
    ];

    if (model) {
      args.push("--model", model);
    }

    args.push("--", prompt);

    const proc = Bun.spawn(["claude", ...args], {
      stdout: "pipe",
      stderr: "pipe",
    });

    const stdout = await new Response(proc.stdout).text();
    const exitCode = await proc.exited;

    if (exitCode !== 0) {
      const stderr = await new Response(proc.stderr).text();
      if (stderr.trim()) {
        console.error(stderr);
      }
      process.exit(exitCode);
    }

    // Print the response
    process.stdout.write(stdout);
    // Ensure trailing newline
    if (!stdout.endsWith("\n")) {
      console.log();
    }
  }
}
