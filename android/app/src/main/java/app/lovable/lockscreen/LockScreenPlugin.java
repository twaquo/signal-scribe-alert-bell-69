package app.lovable.lockscreen;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.JSObject;

import android.content.Intent;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.Log;

/**
 * Capacitor plugin for screen lock functionality
 * Interfaces with LockScreenAccessibilityService
 */
@CapacitorPlugin(name = "LockScreen")
public class LockScreenPlugin extends Plugin {
    private static final String TAG = "LockScreenPlugin";

    /**
     * Lock the screen using accessibility service
     */
    @PluginMethod
    public void lockScreen(PluginCall call) {
        try {
            Log.d(TAG, "Lock screen requested");
            
            // Check if accessibility service is enabled
            if (!isAccessibilityServiceEnabled()) {
                Log.w(TAG, "Accessibility service not enabled");
                JSObject ret = new JSObject();
                ret.put("success", false);
                ret.put("needsPermission", true);
                ret.put("error", "Accessibility service not enabled. Please enable it in settings.");
                call.resolve(ret);
                return;
            }
            
            // Get the accessibility service instance
            LockScreenAccessibilityService service = LockScreenAccessibilityService.getInstance();
            if (service == null) {
                Log.e(TAG, "Accessibility service instance not available");
                JSObject ret = new JSObject();
                ret.put("success", false);
                ret.put("error", "Accessibility service not available");
                call.resolve(ret);
                return;
            }
            
            // Lock the screen
            service.lockScreen();
            
            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
            
        } catch (Exception e) {
            Log.e(TAG, "Error locking screen", e);
            JSObject ret = new JSObject();
            ret.put("success", false);
            ret.put("error", e.getMessage());
            call.resolve(ret);
        }
    }

    /**
     * Check if accessibility service is enabled
     */
    @PluginMethod
    public void isAccessibilityServiceEnabled(PluginCall call) {
        boolean enabled = isAccessibilityServiceEnabled();
        JSObject ret = new JSObject();
        ret.put("enabled", enabled);
        call.resolve(ret);
    }

    /**
     * Open accessibility settings
     */
    @PluginMethod
    public void openAccessibilitySettings(PluginCall call) {
        try {
            Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            
            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            Log.e(TAG, "Error opening accessibility settings", e);
            JSObject ret = new JSObject();
            ret.put("success", false);
            call.resolve(ret);
        }
    }

    /**
     * Check if the accessibility service is enabled
     */
    private boolean isAccessibilityServiceEnabled() {
        try {
            String settingValue = Settings.Secure.getString(
                getContext().getContentResolver(),
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
            );
            
            if (settingValue != null) {
                String expectedComponentName = "app.lovable.lockscreen/.LockScreenAccessibilityService";
                return settingValue.contains(expectedComponentName);
            }
        } catch (Exception e) {
            Log.e(TAG, "Error checking accessibility service status", e);
        }
        return false;
    }
}