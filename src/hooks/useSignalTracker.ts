
import { useSignalState } from './useSignalState';
import { useAntidelayManager } from './useAntidelayManager';
import { useSaveTsManager } from './useSaveTsManager';
import { CapacitorIntents } from 'capacitor-android-intents';
import { useToast } from '@/hooks/use-toast';

export const useSignalTracker = (showScreenLockSetup?: () => void) => {
  const { toast } = useToast();
  const {
    signalsText,
    setSignalsText,
    savedSignals,
    antidelaySeconds,
    setAntidelaySeconds,
    saveButtonPressed,
    handleSaveSignals,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    handleClear
  } = useSignalState();

  const {
    showAntidelayDialog,
    antidelayInput,
    setAntidelayInput,
    handleAntidelaySubmit,
    handleAntidelayCancel
  } = useAntidelayManager(savedSignals, antidelaySeconds, setAntidelaySeconds);

  const {
    showSaveTsDialog,
    antidelayInput: saveTsAntidelayInput,
    setAntidelayInput: setSaveTsAntidelayInput,
    saveTsButtonPressed,
    handleSaveTsMouseDown,
    handleSaveTsMouseUp,
    handleSaveTsMouseLeave,
    handleSaveTsSubmit: originalHandleSaveTsSubmit,
    handleSaveTsCancel
  } = useSaveTsManager();

  // Wrapper functions to pass signalsText to handlers
  const handleSaveTsMouseDownWithSignals = (e: React.MouseEvent | React.TouchEvent) => {
    handleSaveTsMouseDown(e);
  };

  const handleSaveTsMouseUpWithSignals = (e: React.MouseEvent | React.TouchEvent) => {
    handleSaveTsMouseUp(e, signalsText);
  };


  const handleRingOff = async () => {
    console.log('🔴 Ring Off button clicked - Starting function');
    
    try {
      console.log('🔴 Checking Capacitor availability...');
      console.log('🔴 Window.Capacitor exists:', !!(window as any).Capacitor);
      console.log('🔴 Is native platform:', (window as any).Capacitor?.isNativePlatform?.());
      console.log('🔴 Platform:', (window as any).Capacitor?.getPlatform?.());
      
      if ((window as any).Capacitor && (window as any).Capacitor.isNativePlatform()) {
        if ((window as any).Capacitor.getPlatform() === 'android') {
          console.log('🔴 Android platform detected - attempting to send broadcast intent');
          console.log('🔴 Broadcast intent action: com.tasker.SOUND_OFF');
          
          // Send broadcast intent using capacitor-android-intents
          await CapacitorIntents.sendBroadcastIntent({
            action: 'com.tasker.SOUND_OFF',
            value: {
              source: 'signal-scribe-app',
              timestamp: Date.now()
            }
          });
          
          console.log('🔴 Broadcast intent sent successfully: com.tasker.SOUND_OFF');
        } else {
          console.log('🔴 Not Android platform');
        }
      } else {
        console.log('🔴 Web environment - Not on mobile device');
        console.log('🔴 For Tasker: Use broadcast intent com.tasker.SOUND_OFF');
      }
    } catch (error) {
      console.error('🔴 Error in Ring Off handler:', error);
    }
    
    console.log('🔴 Ring Off function completed');
  };

  const handleScreenOff = async () => {
    console.log('📱 Screen Off button clicked - Starting function');
    
    try {
      console.log('📱 Checking Capacitor availability...');
      console.log('📱 Window.Capacitor exists:', !!(window as any).Capacitor);
      console.log('📱 Is native platform:', (window as any).Capacitor?.isNativePlatform?.());
      console.log('📱 Platform:', (window as any).Capacitor?.getPlatform?.());
      
      if ((window as any).Capacitor && (window as any).Capacitor.isNativePlatform()) {
        if ((window as any).Capacitor.getPlatform() === 'android') {
          console.log('📱 Android platform detected - attempting to lock screen using accessibility service');
          
          // Import LockScreen plugin dynamically to avoid web environment issues
          const { default: LockScreen } = await import('../plugins/LockScreenPlugin');
          
          // Check if accessibility service is enabled first
          const serviceStatus = await LockScreen.isAccessibilityServiceEnabled();
          console.log('📱 Accessibility service enabled:', serviceStatus.enabled);
          
          if (!serviceStatus.enabled) {
            console.log('📱 Accessibility service not enabled - showing setup dialog');
            
            // Show setup dialog if provided, otherwise fall back to direct settings
            if (showScreenLockSetup) {
              showScreenLockSetup();
            } else {
              const settingsResult = await LockScreen.openAccessibilitySettings();
              console.log('📱 Settings opened:', settingsResult.success);
              
              toast({
                title: "Accessibility Service Required",
                description: "Please enable 'Signal Scribe Screen Lock' in Accessibility settings to use screen lock feature.",
              });
            }
            return;
          }
          
          // Attempt to lock screen using accessibility service
          const lockResult = await LockScreen.lockScreen();
          console.log('📱 Lock screen result:', lockResult);
          
          if (lockResult.success) {
            console.log('📱 Screen locked successfully using accessibility service');
          } else if (lockResult.needsPermission) {
            console.log('📱 Accessibility permission needed - redirecting to settings');
            await LockScreen.openAccessibilitySettings();
            
            toast({
              title: "Enable Accessibility Service",
              description: "Please turn on 'Signal Scribe Screen Lock' in the accessibility settings to lock your screen.",
            });
          } else {
            console.error('📱 Failed to lock screen:', lockResult.error);
            
            toast({
              title: "Screen Lock Failed",
              description: lockResult.error || "Could not lock screen. Please check accessibility settings.",
              variant: "destructive",
            });
          }
        } else {
          console.log('📱 Not Android platform - screen lock not supported');
          
          toast({
            title: "Not Supported",
            description: "Screen lock is only supported on Android devices.",
          });
        }
      } else {
        console.log('📱 Web environment - Not on mobile device');
        console.log('📱 Screen lock requires Android device with accessibility service');
        
        toast({
          title: "Mobile Only Feature",
          description: "Screen lock feature requires an Android device with accessibility permissions.",
        });
      }
    } catch (error) {
      console.error('📱 Error in Screen Off handler:', error);
      
      toast({
        title: "Error",
        description: "Failed to lock screen. Please try again.",
        variant: "destructive",
      });
    }
    
    console.log('📱 Screen Off function completed');
  };

  return {
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
    handleSaveTsMouseDown: handleSaveTsMouseDownWithSignals,
    handleSaveTsMouseUp: handleSaveTsMouseUpWithSignals,
    handleSaveTsMouseLeave,
    handleSaveTsSubmit: originalHandleSaveTsSubmit,
    handleSaveTsCancel,
    handleAntidelaySubmit,
    handleAntidelayCancel,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    handleClear,
    handleRingOff,
    handleScreenOff
  };
};

