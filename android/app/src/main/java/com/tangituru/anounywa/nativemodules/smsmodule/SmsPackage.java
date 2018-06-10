package com.tangituru.anounywa.nativemodules.smsmodule;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class SmsPackage implements ReactPackage {
	@Override
	public List<ViewManager> createViewManagers(ReactApplicationContext context) {
		return Collections.emptyList();
	}

	public List<NativeModule> createNativeModules(ReactApplicationContext context) {
		List<NativeModule> modules = new ArrayList<>();
		modules.add(new SmsModule(context));
		return modules;
	}
}