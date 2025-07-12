# Android Screen Lock Setup Instructions

This guide will help you set up the screen lock functionality on Android devices using the accessibility service.

## Prerequisites

- Android Studio installed
- Capacitor Android platform added (`npx cap add android`)

## Step 1: Copy Required Files

### 1.1 Copy Java Plugin Files
Copy these files to your Android project:

**From:** `android/app/src/main/java/app/lovable/lockscreen/`
**To:** `android/app/src/main/java/app/lovable/lockscreen/`

Files:
- `LockScreenPlugin.java`
- `LockScreenAccessibilityService.java`

### 1.2 Copy XML Configuration
Copy this file to your Android project:

**From:** `android-files/accessibility_service_config.xml`
**To:** `android/app/src/main/res/xml/accessibility_service_config.xml`

## Step 2: Update AndroidManifest.xml

Add the following service declaration inside the `<application>` tag in `android/app/src/main/AndroidManifest.xml`:

```xml
<!-- Accessibility Service for Screen Lock -->
<service 
    android:name="app.lovable.lockscreen.LockScreenAccessibilityService"
    android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
    android:label="@string/accessibility_service_label"
    android:exported="false">
    <meta-data
        android:name="android.accessibilityservice"
        android:resource="@xml/accessibility_service_config" />
    <intent-filter>
        <action android:name="android.accessibilityservice.AccessibilityService" />
    </intent-filter>
</service>
```

## Step 3: Update strings.xml

Add these strings to `android/app/src/main/res/values/strings.xml`:

```xml
<!-- Accessibility Service Labels -->
<string name="accessibility_service_label">Signal Scribe Screen Lock</string>
<string name="accessibility_service_description">Allows the app to turn off the screen without using the power button. This service only performs the screen lock action when requested by the app.</string>
```

## Step 4: Build and Test

1. Run `npx cap sync` to sync changes
2. Open Android Studio: `npx cap open android`
3. Build and run the app on a device
4. Test the "Screen Off" button - it should prompt you to enable accessibility settings
5. Enable the "Signal Scribe Screen Lock" service in accessibility settings
6. Test the screen lock functionality

## How It Works

1. **Accessibility Service**: Uses Android's accessibility framework to perform global actions
2. **Screen Lock**: Calls `performGlobalAction(GLOBAL_ACTION_LOCK_SCREEN)` which is equivalent to pressing the power button once
3. **Permission Model**: Requires user to manually enable the accessibility service for security
4. **No Root Required**: Uses legitimate Android APIs, no root privileges needed

## Troubleshooting

### Service Not Found
- Ensure all Java files are in the correct package: `app.lovable.lockscreen`
- Verify AndroidManifest.xml service declaration is correct
- Check that strings.xml contains the required string resources

### Permission Denied
- Make sure user has enabled the accessibility service in Settings > Accessibility
- The service name should appear as "Signal Scribe Screen Lock"

### Build Errors
- Ensure package names match across all files
- Verify XML files are in correct directories
- Run `npx cap sync` after making changes

## Security Note

This implementation uses Android's official accessibility service API and requires explicit user permission. The accessibility service only performs screen lock actions and does not access any user data or other system functions.