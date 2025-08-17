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
          allow_symbol_change: true,
          calendar: false,
          details: true,
          hide_side_toolbar: false,
          hide_top_toolbar: false,
          hide_legend: false,
          hide_volume: false,
          hotlist: true,
          interval: "1",
          locale: "en",
          save_image: true,
          style: "1",
          symbol: "CRYPTO:BTCUSD",
          theme: "dark",
          timezone: "Etc/UTC",
          backgroundColor: "#0F0F0F",
          gridColor: "rgba(242, 242, 242, 0.06)",
          watchlist: [],
          withdateranges: false,
          compareSymbols: [],
          studies: [
            "STD;Divergence%1Indicator",
            "STD;EMA"
          ],
          autosize: true,
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
