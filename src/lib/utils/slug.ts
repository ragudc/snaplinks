import { customAlphabet } from "nanoid"

const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789"
const SLUG_LENGTH = 7

const nanoid = customAlphabet(ALPHABET, SLUG_LENGTH)

/** Generates a unique 7-character alphanumeric lowercase slug. */
export const generateSlug = (): string => nanoid()

/** Validates a custom slug: only lowercase letters, numbers, hyphens; 3–50 chars. */
export const isValidSlugFormat = (slug: string): boolean =>
  /^[a-z0-9-]{3,50}$/.test(slug)
