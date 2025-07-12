import { useState, useEffect } from 'react';

export const useScreenLockSetup = () => {
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [serviceEnabled, setServiceEnabled] = useState(false);

  const checkAccessibilityService = async () => {
    try {
      if ((window as any).Capacitor && (window as any).Capacitor.isNativePlatform()) {
        const { default: LockScreen } = await import('../plugins/LockScreenPlugin');
        const result = await LockScreen.isAccessibilityServiceEnabled();
        setServiceEnabled(result.enabled);
        return result.enabled;
      }
      return false;
    } catch (error) {
      console.error('Error checking accessibility service:', error);
      return false;
    }
  };

  const showSetup = () => {
    setShowSetupDialog(true);
  };

  const hideSetup = () => {
    setShowSetupDialog(false);
  };

  // Check service status when component mounts
  useEffect(() => {
    checkAccessibilityService();
  }, []);

  return {
    showSetupDialog,
    serviceEnabled,
    showSetup,
    hideSetup,
    checkAccessibilityService,
  };
};