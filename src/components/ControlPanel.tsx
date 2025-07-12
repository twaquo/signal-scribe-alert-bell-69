import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, FileText, VolumeX, MonitorOff } from 'lucide-react';
interface ControlPanelProps {
  signalsText: string;
  saveButtonPressed: boolean;
  saveTsButtonPressed: boolean;
  onSaveSignals: () => void;
  onSaveTsMouseDown: (e: React.MouseEvent | React.TouchEvent) => void;
  onSaveTsMouseUp: (e: React.MouseEvent | React.TouchEvent) => void;
  onSaveTsMouseLeave: () => void;
  onRingOff: () => void;
  onScreenOff: () => void;
}
const ControlPanel = ({
  signalsText,
  saveButtonPressed,
  saveTsButtonPressed,
  onSaveSignals,
  onSaveTsMouseDown,
  onSaveTsMouseUp,
  onSaveTsMouseLeave,
  onRingOff,
  onScreenOff
}: ControlPanelProps) => {
  const handleSaveClick = () => {
    onSaveSignals();
    // Remove focus after click to return to original color
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }, 200);
  };
  return <div className="bg-card p-4">
      <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
        <Button onClick={onRingOff} variant="secondary" style={{
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }} className="h-16 flex flex-col gap-1 transition-transform duration-200 select-none active:scale-95 border border-input bg-white text-black hover:bg-white/90">
          <VolumeX className="h-6 w-6" />
          <span className="text-xs">Sound Off</span>
        </Button>

        <Button onClick={handleSaveClick} variant="secondary" className={`h-16 flex flex-col gap-1 transition-transform duration-200 select-none active:scale-95 border border-input bg-white text-black hover:bg-white/90 ${saveButtonPressed ? 'scale-95' : ''}`} style={{
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}>
          <Save className="h-6 w-6" />
          <span className="text-xs">Save</span>
        </Button>

        <Button onClick={onScreenOff} variant="secondary" style={{
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }} className="h-16 flex flex-col gap-1 transition-transform duration-200 select-none active:scale-95 border border-input bg-white text-black hover:bg-white/90">
          <MonitorOff className="h-6 w-6" />
          <span className="text-xs">Screen Off</span>
        </Button>

        <Button variant="secondary" className={`h-16 flex flex-col gap-1 transition-transform duration-200 select-none active:scale-95 border border-input bg-white text-black hover:bg-white/90 ${saveTsButtonPressed ? 'scale-95' : ''}`} style={{
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }} onMouseDown={onSaveTsMouseDown} onMouseUp={onSaveTsMouseUp} onMouseLeave={onSaveTsMouseLeave} onTouchStart={onSaveTsMouseDown} onTouchEnd={onSaveTsMouseUp}>
          <FileText className="h-6 w-6" />
          <span className="text-xs">Save Ts</span>
        </Button>
      </div>
    </div>;
};
export default ControlPanel;