import { glossary } from '$lib/server/book';

export function load() {
  return { doc: glossary() };
}
