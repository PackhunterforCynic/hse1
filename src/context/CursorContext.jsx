import { createContext, useState, useContext } from 'react';

const CursorContext = createContext();

export const CursorProvider = ({ children }) => {
  const [cursorState, setCursorState] = useState({
    active: false,
    text: '',
    video: null,
    blend: false,
  });

  const updateCursor = (newState) => {
    setCursorState(prev => ({ ...prev, ...newState }));
  };

  const resetCursor = () => {
    setCursorState({ active: false, text: '', video: null, blend: false });
  };

  return (
    <CursorContext.Provider value={{ cursorState, updateCursor, resetCursor }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => useContext(CursorContext);
