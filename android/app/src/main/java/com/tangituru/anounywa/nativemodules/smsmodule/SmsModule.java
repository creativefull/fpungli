package com.tangituru.anounywa.nativemodules.smsmodule;

import android.telephony.SmsManager;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.ArrayList;
import java.util.List;


public class SmsModule extends ReactContextBaseJavaModule {
	private final ReactApplicationContext reactContext;

	public SmsModule(ReactApplicationContext context) {
		super(context);
		this.reactContext = context;
	}

	@Override
	public String getName() {
		return "RNSms";
	}

	@ReactMethod
	public void send(String text, String number) {
		// Intent sendIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("whatsapp://send?phone=" + number + "&text=" + text));
		SmsManager sms = SmsManager.getDefault();
		sms.sendTextMessage(number, null, text, null,null);
	}
}