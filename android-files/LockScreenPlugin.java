package app.lovable.lockscreen;

import android.content.ComponentName;
import android.content.Intent;
import android.provider.Settings;
import android.text.TextUtils;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import android.util.Log;

/**
 * Capacitor plugin for screen lock functionality
 * 
 * This file should be placed in: android/app/src/main/java/app/lovable/lockscreen/
 */
@CapacitorPlugin(name = "LockScreen")
public class LockScreenPlugin extends Plugin {
    private static final String TAG = "LockScreenPlugin";

    @PluginMethod
    public void lockScreen(PluginCall call) {
        try {
            if (!isAccessibilityServiceEnabled()) {
                JSObject ret = new JSObject();
                ret.put("success", false);
                ret.put("error", "Accessibility service not enabled");
                ret.put("needsPermission", true);
                call.resolve(ret);
                return;
            }

            LockScreenAccessibilityService service = LockScreenAccessibilityService.getInstance();
            if (service != null) {
                service.lockScreen();
                JSObject ret = new JSObject();
                ret.put("success", true);
                call.resolve(ret);
            } else {
                JSObject ret = new JSObject();
                ret.put("success", false);
                ret.put("error", "Service not available");
                call.resolve(ret);
            }
        } catch (Exception e) {
            Log.e(TAG, "Error locking screen", e);
            call.reject("Failed to lock screen: " + e.getMessage());
        }
    }

    @PluginMethod
    public void isAccessibilityServiceEnabled(PluginCall call) {
        boolean enabled = isAccessibilityServiceEnabled();
        JSObject ret = new JSObject();
        ret.put("enabled", enabled);
        call.resolve(ret);
    }

    @PluginMethod
    public void openAccessibilitySettings(PluginCall call) {
        try {
            Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getActivity().startActivity(intent);
            
            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            Log.e(TAG, "Error opening accessibility settings", e);
            call.reject("Failed to open accessibility settings: " + e.getMessage());
        }
    }

    private boolean isAccessibilityServiceEnabled() {
        ComponentName expectedComponentName = new ComponentName(getContext(), LockScreenAccessibilityService.class);
        String enabledServicesSetting = Settings.Secure.getString(
            getContext().getContentResolver(),
            Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
        );
        
        if (enabledServicesSetting == null) {
            return false;
        }

        TextUtils.SimpleStringSplitter colonSplitter = new TextUtils.SimpleStringSplitter(':');
        colonSplitter.setString(enabledServicesSetting);
        
        while (colonSplitter.hasNext()) {
            String componentNameString = colonSplitter.next();
            ComponentName enabledService = ComponentName.unflattenFromString(componentNameString);
            if (enabledService != null && enabledService.equals(expectedComponentName)) {
                return true;
            }
        }
        
        return false;
    }
}