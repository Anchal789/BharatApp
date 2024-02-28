import React, { useEffect } from 'react';

const BannerAd = () => {
  useEffect(() => {
    // Trigger the AdSense ad rendering after the component mounts
    if (window.adsbygoogle) {
      window.adsbygoogle.push({});
    }
  }, []);

  return (
    <div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4197896435460491"
        data-ad-slot="9474994711"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default BannerAd;
