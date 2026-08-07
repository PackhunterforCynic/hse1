/**
 * Recursively flattens a nested translation dictionary into O(1) dot-notated key map.
 * Example: { hero: { title: "Hello" } } => { "hero.title": "Hello" }
 */
export function flattenDictionary(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenDictionary(value, fullKey));
    } else {
      result[fullKey] = value;
    }
  }
  return result;
}

/**
 * Localized date formatting using Intl.DateTimeFormat
 */
export function formatDate(date, langCode = 'en', options = {}) {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(langCode, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }).format(d);
  } catch {
    return String(date);
  }
}

/**
 * Localized number formatting using Intl.NumberFormat
 */
export function formatNumber(number, langCode = 'en', options = {}) {
  try {
    return new Intl.NumberFormat(langCode, options).format(number);
  } catch {
    return String(number);
  }
}
