```
   __ _ ___| | __
  / _` / __| |/ /
 | (_| \__ \   <
  \__,_|___/_|\_\
```

# ask

A CLI for querying LLMs or searching the web.

![Bun](https://img.shields.io/badge/Bun-runtime-f9f1e1?logo=bun)
![License](https://img.shields.io/badge/License-MIT-blue)

---

> **LLM mode** (default): Ask Claude anything. It has web search if it needs current info.
>
> **Search mode**: Get raw DuckDuckGo results. No AI, just links.

---

## Quick Start

```bash
git clone https://github.com/moesy/ask.git && cd ask
bun install

# Ask Claude something
bun run src/index.ts what is the mass of the sun

# Search the web (no AI)
bun run src/index.ts --search-backend ddg best mechanical keyboard 2024
```

## Usage

### LLM Mode

```bash
ask explain the CAP theorem
ask what is the mass of the mass of the sun
ask --model sonnet write a bash one-liner to find large files
ask -ns summarize this error log
```

### Search Mode

```bash
ask --search-backend ddg rust vs go performance
ask --search-backend ddg --max-results 5 bun typescript runtime
```

```
1. Title of Result
   https://example.com/article
   Snippet from the page...

2. Another Result
   https://example.com/other
   More snippet text...
```

## Options

| Flag | Description |
|:-----|:------------|
| `-h, --help` | Show help |
| `-ns, --no-stream` | Disable streaming (LLM only) |
| `--claude` | Use Claude (default) |
| `--ddg` | Use DuckDuckGo search |
| `--provider <name>` | `claude` (default), `openai`, `gemini` |
| `--search-backend <name>` | `ddg` |
| `--max-results <N>` | Results count (default: 10, max: 30) |
| `--model <name>` | Model name for LLM |

> `--provider` and `--search-backend` are mutually exclusive.

## Shortcuts

Skip the verbose flags:

| Instead of | Use |
|:-----------|:----|
| `--provider claude` | `--claude` |
| `--search-backend ddg` | `--ddg` |

```bash
# These are equivalent:
ask --provider claude what is rust
ask --claude what is rust
ask what is rust              # claude is default

# These are equivalent:
ask --search-backend ddg best keyboard
ask --ddg best keyboard
```

## Build

```bash
bun run build
```

**Pro tip:** Create a quick alias

```bash
alias '??'='noglob /path/to/dist/ask'
```

The `noglob` lets you use `?` and `*` without escaping:

```bash
?? what is the mass of the sun?
```

## Development

```bash
bun test          # run tests
bun run start     # run from source
```

## Requirements

- [Bun](https://bun.sh)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (for LLM mode)
- [ddgr](https://github.com/jarun/ddgr) (for search mode)

---

MIT License
