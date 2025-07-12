import { registerPlugin } from '@capacitor/core';

export interface LockScreenPlugin {
  /**
   * Lock the screen using accessibility service
   */
  lockScreen(): Promise<{ success: boolean; error?: string; needsPermission?: boolean }>;
  
  /**
   * Check if accessibility service is enabled
   */
  isAccessibilityServiceEnabled(): Promise<{ enabled: boolean }>;
  
  /**
   * Open accessibility settings
   */
  openAccessibilitySettings(): Promise<{ success: boolean }>;
}

const LockScreen = registerPlugin<LockScreenPlugin>('LockScreen');

export default LockScreen;