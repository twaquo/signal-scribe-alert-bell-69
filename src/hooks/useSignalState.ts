
import { useState, useEffect } from 'react';
import { Signal } from '@/types/signal';
import { parseSignals, hasSignalTimePassed } from '@/utils/signalUtils';
import { 
  saveAntidelayToStorage, 
  loadAntidelayFromStorage 
} from '@/utils/signalStorage';
import { signalStateManager } from '@/utils/signalStateManager';

export const useSignalState = () => {
  const [signalsText, setSignalsText] = useState('');
  const [savedSignals, setSavedSignals] = useState<Signal[]>([]);
  const [antidelaySeconds, setAntidelaySeconds] = useState(15);
  const [saveButtonPressed, setSaveButtonPressed] = useState(false);
  
  const [textHistory, setTextHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Load saved data on component mount
  useEffect(() => {
    const loadedSignals = signalStateManager.getSignals();
    const loadedAntidelay = loadAntidelayFromStorage();
    const savedText = localStorage.getItem('signals_text') || '';
    
    if (loadedSignals.length > 0) {
      setSavedSignals(loadedSignals);
      console.log('📊 Loaded signals from state manager:', loadedSignals);
    }
    
    setAntidelaySeconds(loadedAntidelay);
    setSignalsText(savedText);
    console.log('📊 Loaded antidelay from storage:', loadedAntidelay);
    console.log('📊 Loaded saved text:', savedText);
    
  }, []);

  // Subscribe to signal state updates
  useEffect(() => {
    const unsubscribe = signalStateManager.onSignalsUpdate((updatedSignals) => {
      setSavedSignals(updatedSignals);
      console.log('📊 Signals updated from state manager:', updatedSignals.length);
    });

    return unsubscribe;
  }, []);

  // Save antidelay changes to storage
  useEffect(() => {
    saveAntidelayToStorage(antidelaySeconds);
  }, [antidelaySeconds]);

  // Save text handler - saves text to localStorage or clears if empty
  const handleSaveSignals = () => {
    setSaveButtonPressed(true);
    setTimeout(() => setSaveButtonPressed(false), 200);
    
    // If text is empty, clear localStorage and don't add to history
    if (!signalsText.trim()) {
      try {
        localStorage.removeItem('signals_text');
        console.log('📊 Cleared text from localStorage');
      } catch (error) {
        console.error('Failed to clear text from localStorage:', error);
      }
      return;
    }
    
    // Add current text to history before saving (only non-empty text)
    setTextHistory(prev => {
      const newHistory = [...prev];
      if (signalsText.trim() && signalsText !== newHistory[newHistory.length - 1]) {
        newHistory.push(signalsText);
        // Keep only last 5 entries
        if (newHistory.length > 5) {
          newHistory.shift();
        }
      }
      return newHistory;
    });
    
    // Reset history index to current (latest)
    setHistoryIndex(-1);
    
    // Simply save the raw text to localStorage
    try {
      localStorage.setItem('signals_text', signalsText);
      console.log('📊 Text saved to localStorage');
    } catch (error) {
      console.error('Failed to save text to localStorage:', error);
    }
  };



  // Undo functionality
  const handleUndo = () => {
    if (textHistory.length > 0) {
      if (historyIndex === -1) {
        // First undo - go to the last saved version
        setHistoryIndex(textHistory.length - 1);
        setSignalsText(textHistory[textHistory.length - 1]);
      } else if (historyIndex > 0) {
        // Go to previous version
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setSignalsText(textHistory[newIndex]);
      }
    }
  };

  // Redo functionality
  const handleRedo = () => {
    if (historyIndex !== -1 && historyIndex < textHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setSignalsText(textHistory[newIndex]);
    } else if (historyIndex === textHistory.length - 1) {
      // Go back to current (latest) version
      setHistoryIndex(-1);
      setSignalsText('');
    }
  };

  // Check if undo/redo is available
  const canUndo = textHistory.length > 0 && (historyIndex > 0 || historyIndex === -1);
  const canRedo = historyIndex !== -1 && historyIndex < textHistory.length - 1;

  // Clear functionality
  const handleClear = () => {
    setSignalsText('');
    setHistoryIndex(-1);
  };

  return {
    signalsText,
    setSignalsText,
    savedSignals,
    setSavedSignals,
    antidelaySeconds,
    setAntidelaySeconds,
    saveButtonPressed,
    handleSaveSignals,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    handleClear
  };
};

