import { conceptIndex } from '$lib/server/book';

export function load() {
  return { doc: conceptIndex() };
}
