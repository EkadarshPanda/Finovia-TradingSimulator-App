import React, { useEffect, useRef, memo } from "react";

function NewsWidget() {
  const containerRef = useRef(null);

  useEffect(() => {
    // If container is not mounted or already has children, do nothing
    if (!containerRef.current || containerRef.current.children.length > 0) {
      return;
    }

    // Store the current ref value in a variable for use in cleanup
    const container = containerRef.current;

    // Create script element for TradingView embed widget
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.async = true;
    script.type = "text/javascript";

    // TradingView expects the config object as the script's innerHTML (text content)
    script.text = JSON.stringify({
      feedMode: "all_symbols",
      isTransparent: false,
      displayMode: "adaptive",
      width: "100%",
      height: 700,
      colorTheme: "dark",
      locale: "en",
    });

    // Append the script to the container div (TradingView will replace it with widget)
    container.appendChild(script);

    // Cleanup: remove all children when component unmounts to prevent duplicates
    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  return (
    <div style={{ marginTop: "30px" }}>
      <h2 style={{ color: "#3cffa6", marginBottom: "12px", fontWeight: "700" }}>
        Trending News
      </h2>
      <div
        className="tradingview-widget-container"
        ref={containerRef}
        style={{ width: "100%", height: "700px" }}
      />
    </div>
  );
}

export default memo(NewsWidget);
