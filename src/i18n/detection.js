import { DEFAULT_LANGUAGE, STORAGE_KEY, URL_PARAM_KEY, LANGUAGES } from './constants';

const supportedCodes = new Set(LANGUAGES.map((lang) => lang.code));

/**
 * Multi-tier language detection chain:
 * 1. Saved preference in localStorage
 * 2. URL query parameter (?lang=xx)
 * 3. Browser languages (navigator.languages / navigator.language)
 * 4. Default language fallback ('en')
 */
export function detectInitialLanguage() {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  // 1. URL parameter check (high priority when shared as a localized link)
  try {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get(URL_PARAM_KEY)?.toLowerCase();
    if (urlLang && supportedCodes.has(urlLang)) {
      return urlLang;
    }
  } catch (e) {
    // Ignore URL parsing errors
  }

  // 2. Saved preference from localStorage
  try {
    const savedLang = localStorage.getItem(STORAGE_KEY)?.toLowerCase();
    if (savedLang && supportedCodes.has(savedLang)) {
      return savedLang;
    }
  } catch (e) {
    // Ignore storage errors
  }

  // 3. Browser language inspection
  try {
    const browserLangs = navigator.languages || [navigator.language || navigator.userLanguage];
    for (const lang of browserLangs) {
      if (!lang) continue;
      const code = lang.split('-')[0].toLowerCase();
      if (supportedCodes.has(code)) {
        return code;
      }
    }
  } catch (e) {
    // Ignore navigator inspection errors
  }

  // 4. Default fallback
  return DEFAULT_LANGUAGE;
}
