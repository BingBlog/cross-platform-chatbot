package com.chatbot.mobile;

import android.app.Application;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return true; // Enable developer support for debug builds
        }

        @Override
        protected List<ReactPackage> getPackages() {
          // Return empty list for now, we'll add packages manually
          return Arrays.asList();
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return false; // Disable new architecture for now
        }

        @Override
        protected Boolean isHermesEnabled() {
          return true; // Enable Hermes
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    // New architecture is disabled for now
    // if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
    //   DefaultNewArchitectureEntryPoint.load();
    // }
    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }
}
