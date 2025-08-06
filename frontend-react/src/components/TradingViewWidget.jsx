import React, { useEffect, memo } from 'react';

function TradingViewWidget() {
  useEffect(() => {
    // Check if TradingView script already loaded on the page
    if (!window.TradingView) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        createWidget();
      };
      document.head.appendChild(script);
    } else {
      createWidget();
    }

    function createWidget() {
      if (window.TradingView && document.getElementById('tradingview_chart_container')) {
        // Clear previous widget if any
        document.getElementById('tradingview_chart_container').innerHTML = '';
        new window.TradingView.widget({
          autosize: true,
          symbol: 'NASDAQ:AAPL',
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: 1,
          locale: 'en',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: 'tradingview_chart_container',
        });
      }
    }

    // Cleanup function to clear the widget container
    return () => {
      const container = document.getElementById('tradingview_chart_container');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div style={{ 
      height: '600px', 
      width: '100%', 
      marginTop: '30px'
    }}>
      <div id="tradingview_chart_container" style={{ height: '100%', width: '100%' }} />
    </div>
  );
}

export default memo(TradingViewWidget);
