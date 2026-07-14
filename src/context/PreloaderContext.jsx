import { createContext, useState, useContext, useEffect } from 'react';

const PreloaderContext = createContext();

export const PreloaderProvider = ({ children }) => {
  // Check if we've already shown the preloader in this session
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('preloaderShown') === 'true') {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      sessionStorage.setItem('preloaderShown', 'true');
    }
  }, [loading]);

  return (
    <PreloaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </PreloaderContext.Provider>
  );
};

export const usePreloader = () => useContext(PreloaderContext);
