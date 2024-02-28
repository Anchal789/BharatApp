import React from "react";
// import {NannerAd,TestIds,AdEventType, BannerAdSize} from "react-native-google-mobile-ads"
import {GoogleAd} from "react-google-ad"
const BannerAd = () => {
  return (
    <div>
      <GoogleAd
        adClient="YOUR_AD_CLIENT_ID"
        adSlot="YOUR_AD_SLOT_ID"
        style={{ width: 300, height: 250 }}
      />
    </div>
  );
};

export default BannerAd;
