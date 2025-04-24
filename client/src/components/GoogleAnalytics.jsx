import React, { useEffect } from 'react';

const GoogleAnalytics = () => {
  useEffect(() => {
    if (process.env.REACT_APP_GA_MEASUREMENT_ID) {
      // Load Google Analytics script dynamically
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.REACT_APP_GA_MEASUREMENT_ID}`;
      
      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.REACT_APP_GA_MEASUREMENT_ID}');
      `;
      
      document.head.appendChild(script1);
      document.head.appendChild(script2);
    }
    
    return () => {
      // Clean up if component unmounts
      const scripts = document.querySelectorAll(`script[src*="googletagmanager.com/gtag/js"]`);
      scripts.forEach(script => script.parentNode?.removeChild(script));
    };
  }, []);
  
  return null;
};

export default GoogleAnalytics;