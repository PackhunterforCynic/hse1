import { useState, useEffect } from 'react';

// Profiles: 'high' | 'medium' | 'low'
export function usePerformanceProfile() {
  const [profile, setProfile] = useState('high');

  useEffect(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

    let calculatedProfile = 'high';

    // 1. Check Hardware Concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 4;
    
    // 2. Check Device Memory (RAM in GB, Chrome/Edge only)
    const memory = navigator.deviceMemory || 4;

    // 3. Network connection (if Save Data is on)
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const saveData = connection ? connection.saveData : false;
    const effectiveType = connection ? connection.effectiveType : '4g'; // 'slow-2g', '2g', '3g', '4g'

    if (saveData || effectiveType === '2g' || effectiveType === 'slow-2g') {
      calculatedProfile = 'low';
    } else if (cores <= 2 || memory <= 2) {
      calculatedProfile = 'low';
    } else if (cores <= 4 || memory <= 4 || effectiveType === '3g') {
      calculatedProfile = 'medium';
    }

    setProfile(calculatedProfile);
  }, []);

  return profile;
}
