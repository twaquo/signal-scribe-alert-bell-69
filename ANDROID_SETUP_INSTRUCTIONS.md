# Android Screen Lock Setup Instructions

All required Android files are now included in the project. No manual copying is needed.

## Build and Run Instructions

After cloning the repository and running `npm install` and `npm run build`, follow these steps:

1. **Add Android Platform:**
   ```bash
   npx cap add android
   ```

2. **Sync Capacitor:**
   ```bash
   npx cap sync android
   ```

3. **Run on Android:**
   ```bash
   npx cap run android
   ```

## First-Time Setup

When you first run the app on your Android device:

1. **Launch the app** - It will install and open on your device
2. **Tap "Screen Off" button** - The app will guide you through accessibility setup
3. **Enable accessibility service** - Follow the in-app instructions to enable "Signal Scribe Screen Lock" in Android accessibility settings
4. **Return to app** - The screen lock feature will now work

## Troubleshooting

- If the app doesn't build, make sure Android Studio is installed and configured
- If screen lock doesn't work, check that the accessibility service is enabled in Android Settings > Accessibility > Signal Scribe Screen Lock
- For USB debugging issues, ensure developer options are enabled on your Android device

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