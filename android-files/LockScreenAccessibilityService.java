package app.lovable.lockscreen;

import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.content.Intent;
import android.view.accessibility.AccessibilityEvent;
import android.util.Log;

/**
 * Accessibility service for screen lock functionality
 * Based on Pineapple Lock Screen implementation
 * 
 * This file should be placed in: android/app/src/main/java/app/lovable/lockscreen/
 */
public class LockScreenAccessibilityService extends AccessibilityService {
    private static final String TAG = "LockScreenA11yService";
    
    public static final String ACTION_LOCK_SCREEN = "app.lovable.lockscreen.LOCK_SCREEN";
    private static LockScreenAccessibilityService sInstance;

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();
        sInstance = this;
        Log.d(TAG, "Accessibility service connected");
        
        // Configure the service
        AccessibilityServiceInfo info = new AccessibilityServiceInfo();
        info.eventTypes = AccessibilityEvent.TYPE_NOTIFICATION_STATE_CHANGED;
        info.feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC;
        info.flags = AccessibilityServiceInfo.FLAG_INCLUDE_NOT_IMPORTANT_VIEWS;
        setServiceInfo(info);
    }

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        // We don't need to handle accessibility events for screen lock
    }

    @Override
    public void onInterrupt() {
        Log.d(TAG, "Accessibility service interrupted");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && ACTION_LOCK_SCREEN.equals(intent.getAction())) {
            lockScreen();
        }
        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onDestroy() {
        sInstance = null;
        super.onDestroy();
    }

    /**
     * Lock the screen using accessibility service
     */
    public void lockScreen() {
        try {
            boolean success = performGlobalAction(GLOBAL_ACTION_LOCK_SCREEN);
            Log.d(TAG, "Lock screen action result: " + success);
        } catch (Exception e) {
            Log.e(TAG, "Failed to lock screen", e);
        }
    }

    /**
     * Check if the accessibility service is enabled
     */
    public static boolean isServiceEnabled() {
        return sInstance != null;
    }

    /**
     * Get the current service instance
     */
    public static LockScreenAccessibilityService getInstance() {
        return sInstance;
    }
}