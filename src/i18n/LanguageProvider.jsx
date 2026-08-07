import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { DEFAULT_LANGUAGE, STORAGE_KEY, LANGUAGES, URL_PARAM_KEY } from './constants';
import { detectInitialLanguage } from './detection';
import { flattenDictionary, formatDate as formatDateHelper, formatNumber as formatNumberHelper } from './formatter';
import enDict from './locales/en';
import { getCachedDictionary, cacheDictionary } from '../lib/cacheEngine';

const LanguageContext = createContext(null);

// In-memory cache for loaded translation dictionaries
const dictionaryCache = {
  en: flattenDictionary(enDict)
};

// Map of Vite dynamic importers for 32 world languages
const localeImporters = {
  en: () => Promise.resolve({ default: enDict }),
  hi: () => import('./locales/hi'),
  ta: () => import('./locales/ta'),
  kn: () => import('./locales/kn'),
  fr: () => import('./locales/fr'),
  es: () => import('./locales/es'),
  ar: () => import('./locales/ar'),
  de: () => import('./locales/de'),
  it: () => import('./locales/it'),
  pt: () => import('./locales/pt'),
  ru: () => import('./locales/ru'),
  ja: () => import('./locales/ja'),
  ko: () => import('./locales/ko'),
  zh: () => import('./locales/zh'),
  bn: () => import('./locales/bn'),
  ur: () => import('./locales/ur'),
  tr: () => import('./locales/tr'),
  vi: () => import('./locales/vi'),
  th: () => import('./locales/th'),
  id: () => import('./locales/id'),
  ms: () => import('./locales/ms'),
  nl: () => import('./locales/nl'),
  pl: () => import('./locales/pl'),
  sv: () => import('./locales/sv'),
  no: () => import('./locales/no'),
  da: () => import('./locales/da'),
  fi: () => import('./locales/fi'),
  el: () => import('./locales/el'),
  he: () => import('./locales/he'),
  cs: () => import('./locales/cs'),
  hu: () => import('./locales/hu'),
  ro: () => import('./locales/ro'),
  uk: () => import('./locales/uk'),
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => detectInitialLanguage());
  const [dictionary, setDictionary] = useState(() => {
    const initialLang = detectInitialLanguage();
    if (initialLang === 'en') return dictionaryCache.en;
    return dictionaryCache[initialLang] || getCachedDictionary(initialLang) || dictionaryCache.en;
  });
  const [isLoading, setIsLoading] = useState(false);

  const activeLangConfig = useMemo(() => {
    return LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  }, [language]);

  // Lazy-load translation dictionary with persistent localStorage fallbacks
  useEffect(() => {
    let isMounted = true;

    const loadDictionary = async () => {
      // 1. Check fast in-memory cache first
      if (dictionaryCache[language]) {
        if (isMounted) setDictionary(dictionaryCache[language]);
        return;
      }

      // 2. Check instant storage cache for 0ms page reloads
      const localStored = getCachedDictionary(language);
      if (localStored) {
        dictionaryCache[language] = localStored;
        if (isMounted) setDictionary(localStored);
      } else {
        if (isMounted && language !== 'en') setIsLoading(true);
      }

      try {
        const importer = localeImporters[language] || localeImporters.en;
        const mod = await importer();
        const flat = flattenDictionary(mod.default || mod);
        dictionaryCache[language] = flat;
        cacheDictionary(language, flat);
        if (isMounted) {
          setDictionary(flat);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(`Failed to load dictionary for language: ${language}`, error);
        if (isMounted) {
          setDictionary(dictionaryCache.en);
          setIsLoading(false);
        }
      }
    };

    loadDictionary();
    return () => { isMounted = false; };
  }, [language]);

  // Sync DOM document language & direction (RTL/LTR), save to localStorage, and log analytics
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Update root DOM attributes for SEO & Accessibility
    document.documentElement.lang = activeLangConfig.code;
    document.documentElement.dir = activeLangConfig.direction;

    // Persist preference to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, activeLangConfig.code);
    } catch (e) {
      // Ignore incognito quota/access errors
    }
  }, [activeLangConfig]);

  const setLanguage = (newLang) => {
    if (newLang === language) return;
    const from = language;
    
    // Log analytics event
    console.debug('language_changed', { from, to: newLang });
    
    // Update state
    setLanguageState(newLang);

    // Synchronize URL query parameter without triggering page reload
    try {
      const url = new URL(window.location.href);
      if (newLang === DEFAULT_LANGUAGE) {
        url.searchParams.delete(URL_PARAM_KEY);
      } else {
        url.searchParams.set(URL_PARAM_KEY, newLang);
      }
      window.history.replaceState({}, '', url.toString());
    } catch (e) {
      // Ignore navigation replaceState errors
    }
  };

  /**
   * Primary translation lookup helper with variable interpolation and fallback to English.
   * Usage: t('hero.title', { name: 'World' })
   */
  const t = (key, params = {}) => {
    let text = dictionary[key] ?? dictionaryCache.en[key] ?? key;
    
    if (params && typeof params === 'object' && Object.keys(params).length > 0) {
      Object.entries(params).forEach(([k, val]) => {
        text = String(text).replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), val);
      });
    }
    return text;
  };

  const formatDate = (date, options) => formatDateHelper(date, language, options);
  const formatNumber = (num, options) => formatNumberHelper(num, language, options);

  const value = useMemo(() => ({
    language,
    setLanguage,
    activeLangConfig,
    t,
    formatDate,
    formatNumber,
    isLoading,
    languages: LANGUAGES
  }), [language, dictionary, isLoading, activeLangConfig]);

  return (
    <LanguageContext.Provider value={value}>
      <Helmet>
        <html lang={activeLangConfig.code} dir={activeLangConfig.direction} />
        <meta property="og:locale" content={activeLangConfig.ogLocale} />
        {LANGUAGES.map((lang) => (
          <link
            key={lang.code}
            rel="alternate"
            hrefLang={lang.code}
            href={
              typeof window !== 'undefined'
                ? `${window.location.origin}${window.location.pathname}${lang.code === DEFAULT_LANGUAGE ? '' : `?lang=${lang.code}`}`
                : undefined
            }
          />
        ))}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : undefined}
        />
      </Helmet>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
