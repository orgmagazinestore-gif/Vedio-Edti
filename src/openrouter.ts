import { OpenRouter } from '@openrouter/sdk';
import * as errors from '@openrouter/sdk/models/errors';

/** Default model. Any slug from https://openrouter.ai/models works here. */
export const DEFAULT_MODEL = process.env.OPENROUTER_MODEL ?? 'anthropic/claude-opus-5.5';

/** Builds a client, reading the key from OPENROUTER_API_KEY. Never hard-code the key. */
export function createClient(): OpenRouter {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      'OPENROUTER_API_KEY is not set. Create a key at https://openrouter.ai/keys, then: export OPENROUTER_API_KEY="sk-or-v1-..."',
    );
  }
  return new OpenRouter({
    apiKey,
    appTitle: 'Vedio-Edti', // Optional: shows the app on openrouter.ai rankings.
  });
}

/** Sends one prompt and returns the model's text answer. */
export async function ask(prompt: string, model: string = DEFAULT_MODEL): Promise<string> {
  const client = createClient();
  const response = await client.responses.send({
    responsesRequest: { model, input: prompt },
  });

  if (!('output' in response)) {
    throw new Error('Expected a non-streaming response');
  }
  if (response.status !== 'completed') {
    throw new Error(response.error?.message ?? `Response ended as ${response.status}`);
  }

  const message = response.output.find((item) => item.type === 'message');
  const text = message?.content.find((part) => part.type === 'output_text')?.text;
  if (!text) {
    throw new Error('The model returned no text output');
  }
  return text;
}

/** Turns any thrown error into a short, human-readable explanation. */
export function describeError(err: unknown): string {
  if (err instanceof errors.UnauthorizedResponseError) {
    return 'Invalid or revoked API key (401). Check OPENROUTER_API_KEY or create a new key at https://openrouter.ai/keys.';
  }
  if (err instanceof errors.PaymentRequiredResponseError) {
    return 'Out of credits (402). Add credits at https://openrouter.ai/settings/credits.';
  }
  if (err instanceof errors.TooManyRequestsResponseError) {
    return 'Rate limited (429). Wait a moment and try again.';
  }
  if (err instanceof errors.OpenRouterError) {
    return `OpenRouter returned HTTP ${err.statusCode}: ${err.body || err.message}`;
  }
  if (err instanceof errors.ConnectionError || err instanceof errors.RequestTimeoutError) {
    return `Could not reach OpenRouter: ${err.message}`;
  }
  return err instanceof Error ? err.message : String(err);
}
