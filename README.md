# Vedio-Edti

## OpenRouter

Calls models through [OpenRouter](https://openrouter.ai) with the official `@openrouter/sdk`.
The code lives in `src/openrouter.ts` (client, `ask()`, error messages); `src/index.ts` is a runnable example.

### Setup

1. Create an API key at https://openrouter.ai/keys.
2. Provide it as `OPENROUTER_API_KEY`, either exported in your shell or in a `.env` file
   (copy `.env.example` to `.env`). `.env` is git-ignored: never commit the key.
3. Install dependencies:

```bash
npm install
```

### Run

```bash
npm start -- "Write a one-line tagline for a video editor"
```

Choose a different model by slug (full list: https://openrouter.ai/models):

```bash
OPENROUTER_MODEL=anthropic/claude-sonnet-5.5 npm start -- "Hello"
```

Errors are explained in plain words: missing key, invalid key (401), no credits (402),
rate limit (429), other HTTP errors, and network failures. The process exits with code 1 on error.

Type-check:

```bash
npm run typecheck
```

Behind an HTTP proxy, Node's built-in `fetch` ignores `HTTPS_PROXY` unless you run with
`NODE_USE_ENV_PROXY=1` (Node 22.21+).
