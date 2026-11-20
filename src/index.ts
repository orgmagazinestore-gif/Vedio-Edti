import { ask, DEFAULT_MODEL, describeError } from './openrouter.ts';

const prompt = process.argv.slice(2).join(' ') || 'Say hello in one short sentence.';

try {
  console.error(`[openrouter] model: ${DEFAULT_MODEL}`);
  console.log(await ask(prompt));
} catch (err) {
  console.error(`[openrouter] error: ${describeError(err)}`);
  process.exitCode = 1;
}
