
import React from 'react';
import { useSignalTracker } from '@/hooks/useSignalTracker';
import SignalInput from '@/components/SignalInput';
import ControlPanel from '@/components/ControlPanel';
import SaveTsDialog from '@/components/SaveTsDialog';

const Index = () => {
  const {
    signalsText,
    setSignalsText,
    saveButtonPressed,
    saveTsButtonPressed,
    showAntidelayDialog,
    antidelayInput,
    setAntidelayInput,
    antidelaySeconds,
    showSaveTsDialog,
    saveTsAntidelayInput,
    setSaveTsAntidelayInput,
    handleSaveSignals,
    handleSaveTsMouseDown,
    handleSaveTsMouseUp,
    handleSaveTsMouseLeave,
    handleSaveTsSubmit,
    handleSaveTsCancel,
    handleAntidelaySubmit,
    handleAntidelayCancel,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    handleClear,
    handleRingOff,
    handleScreenOff,
  } = useSignalTracker();

  return (
    <div className="bg-background flex flex-col select-none" style={{ 
      userSelect: 'none', 
      WebkitUserSelect: 'none',
      height: '100dvh', // Dynamic viewport height for mobile
      maxHeight: '100dvh', // Prevent overflow
      overflow: 'hidden', // Prevent any scrolling beyond viewport
      overscrollBehavior: 'none', // Prevent overscroll on Android
      paddingBottom: 'env(safe-area-inset-bottom)' // Safe area for mobile
    }}>
      <div className="flex-1 min-h-0">
        <SignalInput
          signalsText={signalsText}
          onSignalsTextChange={setSignalsText}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          onClear={handleClear}
        />
      </div>
      
      <div className="flex-shrink-0 pb-4 pt-2">
        <ControlPanel
          signalsText={signalsText}
          saveButtonPressed={saveButtonPressed}
          saveTsButtonPressed={saveTsButtonPressed}
          onSaveSignals={handleSaveSignals}
          onSaveTsMouseDown={handleSaveTsMouseDown}
          onSaveTsMouseUp={handleSaveTsMouseUp}
          onSaveTsMouseLeave={handleSaveTsMouseLeave}
          onRingOff={handleRingOff}
          onScreenOff={handleScreenOff}
        />
      </div>

      <SaveTsDialog
        open={showSaveTsDialog}
        antidelayValue={saveTsAntidelayInput}
        onAntidelayChange={setSaveTsAntidelayInput}
        onSave={handleSaveTsSubmit}
        onCancel={handleSaveTsCancel}
      />
    </div>
  );
};

export default Index;
