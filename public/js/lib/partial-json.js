/**
 * Partial JSON parser for streaming LLM responses
 * Uses jsonrepair library to handle incomplete JSON
 */
import { jsonrepair } from "https://esm.sh/jsonrepair@3"

/**
 * Attempts to parse partial JSON by repairing incomplete structures
 * @param {string} text - Potentially incomplete JSON string
 * @returns {object|null} - Parsed object or null if unparseable
 */
export const parsePartialJson = (text) => {
  if (!text || text.trim().length === 0) return null

  // First, try parsing as-is (fastest path)
  try {
    return JSON.parse(text)
  } catch {
    // Continue to repair
  }

  // Find the start of JSON
  const jsonStart = text.search(/[\[{]/)
  if (jsonStart === -1) return null

  const json = text.slice(jsonStart)

  // Use jsonrepair to fix incomplete JSON
  try {
    const repaired = jsonrepair(json)
    return JSON.parse(repaired)
  } catch {
    // jsonrepair couldn't fix it
    return null
  }
}

/**
 * Deep merge two objects, preferring values from the newer object
 */
export const mergePartial = (base, update) => {
  if (!base) return update
  if (!update) return base

  if (Array.isArray(update)) {
    return update
  }

  if (typeof update !== "object") {
    return update
  }

  const result = { ...base }
  for (const key of Object.keys(update)) {
    if (update[key] !== null && update[key] !== undefined) {
      if (typeof update[key] === "object" && !Array.isArray(update[key])) {
        result[key] = mergePartial(base[key], update[key])
      } else {
        result[key] = update[key]
      }
    }
  }
  return result
}

export default parsePartialJson
