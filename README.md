### outlierMobileApp

### Setting up the development environment
#### iOS development on Mac
- `brew install node` (If you have already installed Node on your system, make sure it is Node 12 or newer)
- `brew install watchman`
- `Install Xcode` (The easiest way to install Xcode is via the [Mac App Store](https://itunes.apple.com/us/app/xcode/id497799835?mt=12). Installing Xcode will also install the iOS Simulator and all the necessary tools to build your iOS app.) If you have already installed Xcode on your system, make sure it is version 10 or newer.

#### Android development on Linux
- Follow the [installation instructions for your Linux distribution](https://nodejs.org/en/download/package-manager/) to install Node 12 or newer.
- `Install Java development Kit` React Native requires at least the version 8 of the Java SE Development Kit (JDK). You may download and install [OpenJDK](http://openjdk.java.net/) from [AdoptOpenJDK](https://adoptopenjdk.net/) or your system packager. You may also [Download and install Oracle JDK 14](https://www.oracle.com/java/technologies/javase-downloads.html) if desired.
- `Install Android Studio`
- `Install Android SDK 10 (Q)`
- Configure the `ANDROID_HOME` environment variable
```
  export ANDROID_HOME=$HOME/Android/Sdk
  export PATH=$PATH:$ANDROID_HOME/emulator
  export PATH=$PATH:$ANDROID_HOME/tools
  export PATH=$PATH:$ANDROID_HOME/tools/bin
  export PATH=$PATH:$ANDROID_HOME/platform-tools
 ```

#### Detailed reference can be found here
1. Go to https://reactnative.dev/docs/environment-setup
2. Click `React Native CLI Quickstart`
3. Choose development OS and Target OS you want to start developing then follow the instructions.

### Environment Setup
- git clone git@github.com:outlier-org/student-mobile.git
- cd student-mobile
- npm install
- cp .env.sample .env
- update environment variables

### Running the application - Android
- `npx react-native start`
- `npx react-native run-android` in a different terminal

### Running the application - iOS
- `npx react-native start`
- `cd ios && pod install && cd ../`
- `npx react-native run-ios` in a different terminal

### Compatibility issues with Apple M1 chip

#### Running on Android emulator
 - use the [Canary build of Android Studio](https://developer.android.com/studio/preview) which has arm64 support for Android virtual device.

### Helpful commands
- On iOS, if you are facing issue related to pods try this command `cd ios && pod deintegrate && pod install`

### Math tab or Myscript Integration
- To test this tab use [this url](https://deploy-preview-3911--outlier-calculus.netlify.app/#/662b74aa-d69c-4754-8ccf-8ed250a3a6d9/2d9aca40-e507-4f81-bd6a-edd6e9824da7) on desktop
