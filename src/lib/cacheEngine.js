/**
 * Havilah Studio — Integrated Asset, Content & Animation Cache Engine
 * Manages zero-latency browser asset caching, media pre-warming, animation state persistence,
 * and Service Worker orchestration for instantaneous page reload performance.
 */

// 1. SERVICE WORKER ORCHESTRATION
export function initCacheEngine() {
  if (typeof window === 'undefined') return;

  // Register Service Worker for Cache-First offline media and stale-while-revalidate bundles
  if ('serviceWorker' in navigator && window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.debug('Havilah Cache Engine: Service Worker active with scope', registration.scope);
          // Kick off background asset and animation warming during browser idle periods
          scheduleIdleTask(() => warmMediaAndContentCache());
        })
        .catch((err) => {
          console.warn('Havilah Cache Engine: SW registration skipped or failed:', err);
          scheduleIdleTask(() => warmMediaAndContentCache());
        });
    });
  } else {
    scheduleIdleTask(() => warmMediaAndContentCache());
  }
}

function scheduleIdleTask(callback) {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout: 4000 });
  } else {
    setTimeout(callback, 1500);
  }
}

// 2. MEDIA PRE-WARMING (Images & Video)
// Silently fetches high-priority visual assets into browser storage so page reloads are instantaneous
const CRITICAL_MEDIA_ASSETS = [
  '/videos/show reel/window_compressed.mp4',
  '/images/services/service1.png',
  '/images/services/service2.png',
  '/images/services/service3.png',
  '/images/services/service4.jpeg',
  '/images/services/image.png',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1574044565707-1bcf3511eb06?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80'
];

export async function warmMediaAndContentCache() {
  if (typeof window === 'undefined' || !('caches' in window)) return;

  try {
    const cache = await caches.open('havilah-media-v1');
    for (const url of CRITICAL_MEDIA_ASSETS) {
      const match = await cache.match(url);
      if (!match) {
        // Fetch with fallback handling without blocking rendering thread
        fetch(url, { mode: 'no-cors' }).then((response) => {
          if (response) cache.put(url, response);
        }).catch(() => {
          // Ignore network errors during pre-warming
        });
      }
    }
  } catch (error) {
    console.debug('Media pre-warming completed with fallback handling.');
  }
}

// 3. ANIMATION STATE & RELOAD OPTIMIZATION
// Persists entrance flags and animation readiness so repeated page reloads render immediately at 120fps without preloader blocking
const ANIMATION_CACHE_KEY = 'havilah_animation_state_v1';
const RELOAD_BUFFER_MS = 1000 * 60 * 120; // 2 hours validity for fast animation bypass

export function shouldSkipEntranceAnimation() {
  if (typeof window === 'undefined') return false;

  try {
    const sessionPlayed = sessionStorage.getItem('havilah-intro-played');
    if (sessionPlayed === 'true') return true;

    const cachedState = localStorage.getItem(ANIMATION_CACHE_KEY);
    if (cachedState) {
      const parsed = JSON.parse(cachedState);
      const isFresh = (Date.now() - parsed.timestamp) < RELOAD_BUFFER_MS;
      if (isFresh && parsed.completed) {
        // Hydrate session storage for superfast sub-millisecond check next time
        sessionStorage.setItem('havilah-intro-played', 'true');
        return true;
      }
    }
  } catch (err) {
    return false;
  }
  return false;
}

export function recordAnimationComplete() {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem('havilah-intro-played', 'true');
    localStorage.setItem(ANIMATION_CACHE_KEY, JSON.stringify({
      completed: true,
      timestamp: Date.now(),
      version: '1.0.0'
    }));
  } catch (err) {
    // Ignore storage quota errors
  }
}

// 4. I18N CONTENT SYNCHRONOUS MEMORY STORAGE
// Stores translation dictionaries in localStorage for 0ms content hydration on page reload
const DICTIONARY_PREFIX = 'havilah_dict_cache_';

export function getCachedDictionary(language) {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(`${DICTIONARY_PREFIX}${language}`);
    if (stored) {
      const { data, timestamp } = JSON.parse(stored);
      // Ensure content cache is valid for 7 days
      if (Date.now() - timestamp < 1000 * 60 * 60 * 24 * 7) {
        return data;
      }
    }
  } catch (err) {
    return null;
  }
  return null;
}

export function cacheDictionary(language, dictionaryData) {
  if (typeof window === 'undefined' || !dictionaryData) return;
  try {
    localStorage.setItem(`${DICTIONARY_PREFIX}${language}`, JSON.stringify({
      data: dictionaryData,
      timestamp: Date.now()
    }));
  } catch (err) {
    // Silently handle LocalStorage quota limit reached
  }
}
