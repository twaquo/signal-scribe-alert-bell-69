import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Settings, Smartphone, Shield } from 'lucide-react';

interface ScreenLockSetupProps {
  isVisible: boolean;
  onClose: () => void;
}

const ScreenLockSetup: React.FC<ScreenLockSetupProps> = ({ isVisible, onClose }) => {
  const [serviceEnabled, setServiceEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkAccessibilityService = async () => {
    try {
      if ((window as any).Capacitor && (window as any).Capacitor.isNativePlatform()) {
        const { default: LockScreen } = await import('../plugins/LockScreenPlugin');
        const result = await LockScreen.isAccessibilityServiceEnabled();
        setServiceEnabled(result.enabled);
      }
    } catch (error) {
      console.error('Error checking accessibility service:', error);
    }
  };

  const handleOpenSettings = async () => {
    setIsLoading(true);
    try {
      if ((window as any).Capacitor && (window as any).Capacitor.isNativePlatform()) {
        const { default: LockScreen } = await import('../plugins/LockScreenPlugin');
        await LockScreen.openAccessibilitySettings();
      }
    } catch (error) {
      console.error('Error opening settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      checkAccessibilityService();
      // Check periodically if user enables the service
      const interval = setInterval(checkAccessibilityService, 2000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Screen Lock Setup
          </CardTitle>
          <CardDescription>
            Enable accessibility service to use screen lock functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {serviceEnabled ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                ✅ Accessibility service is enabled! You can now use the screen lock feature.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  To lock your screen without the power button, please enable the accessibility service.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Setup Instructions:
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Tap "Open Settings" below</li>
                  <li>Find "Signal Scribe Screen Lock" in the list</li>
                  <li>Toggle it ON</li>
                  <li>Confirm by tapping "Allow" or "OK"</li>
                  <li>Return to this app</li>
                </ol>
              </div>

              <Button 
                onClick={handleOpenSettings} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Opening Settings...' : 'Open Accessibility Settings'}
              </Button>
            </>
          )}

          <div className="flex gap-2">
            {serviceEnabled && (
              <Button onClick={onClose} className="flex-1">
                Done
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={onClose} 
              className={serviceEnabled ? "flex-1" : "w-full"}
            >
              {serviceEnabled ? 'Cancel' : 'Close'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScreenLockSetup;