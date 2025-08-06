import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MarketSentimentWidget() {
  const [sentimentData, setSentimentData] = useState({
    fearGreedIndex: 65,
    vix: 18.5,
    marketBreadth: 0.72,
    socialSentiment: 0.58,
    lastUpdated: new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    // In a real implementation, you would fetch from an API
    // For now, we'll use sample data with some randomization
    const updateSentimentData = () => {
      setSentimentData({
        fearGreedIndex: Math.floor(Math.random() * 40) + 30, // 30-70 range
        vix: (Math.random() * 10 + 15).toFixed(1), // 15-25 range
        marketBreadth: (Math.random() * 0.4 + 0.5).toFixed(2), // 0.5-0.9 range
        socialSentiment: (Math.random() * 0.4 + 0.4).toFixed(2), // 0.4-0.8 range
        lastUpdated: new Date().toISOString()
      });
    };

    // Update every 30 seconds to simulate real-time data
    const interval = setInterval(updateSentimentData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getFearGreedLabel = (index) => {
    if (index >= 80) return 'Extreme Greed';
    if (index >= 60) return 'Greed';
    if (index >= 40) return 'Neutral';
    if (index >= 20) return 'Fear';
    return 'Extreme Fear';
  };

  const getFearGreedColor = (index) => {
    if (index >= 80) return '#ef4444';
    if (index >= 60) return '#f97316';
    if (index >= 40) return '#fbbf24';
    if (index >= 20) return '#3b82f6';
    return '#8b5cf6';
  };

  const getSentimentColor = (value) => {
    if (value >= 0.7) return '#22c55e';
    if (value >= 0.5) return '#fbbf24';
    return '#ef4444';
  };

  const getSentimentLabel = (value) => {
    if (value >= 0.7) return 'Bullish';
    if (value >= 0.5) return 'Neutral';
    return 'Bearish';
  };

  const getVixColor = (value) => {
    if (value >= 25) return '#ef4444'; // High volatility
    if (value >= 20) return '#f97316'; // Medium-high
    if (value >= 15) return '#fbbf24'; // Medium
    return '#22c55e'; // Low volatility
  };

  const getVixLabel = (value) => {
    if (value >= 25) return 'High';
    if (value >= 20) return 'Elevated';
    if (value >= 15) return 'Normal';
    return 'Low';
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Header */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          cursor: 'pointer',
          padding: '8px 0',
          userSelect: 'none'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 style={{ color: "var(--text-accent)", marginBottom: '0', fontSize: '1.1rem', fontWeight: '600' }}>
          Market Sentiment
        </h3>
        <span style={{ 
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
          fontSize: '12px',
          color: 'var(--text-accent)'
        }}>
          ▼
        </span>
      </div>

      {/* Fear & Greed Index */}
      {isExpanded && (
        <div style={{ 
          maxHeight: isExpanded ? '1000px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease, opacity 0.3s ease',
          opacity: isExpanded ? 1 : 0
        }}>
          <div style={{ 
            padding: '16px',
            backgroundColor: '#1f2937',
            borderRadius: '8px',
            border: '1px solid #374151',
            marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>Fear & Greed Index</span>
              <span style={{ 
                color: getFearGreedColor(sentimentData.fearGreedIndex),
                fontSize: '12px',
                fontWeight: '600',
                padding: '4px 8px',
                backgroundColor: `${getFearGreedColor(sentimentData.fearGreedIndex)}20`,
                borderRadius: '4px'
              }}>
                {getFearGreedLabel(sentimentData.fearGreedIndex)}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div style={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: '#374151', 
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '8px'
            }}>
              <div style={{
                width: `${sentimentData.fearGreedIndex}%`,
                height: '100%',
                backgroundColor: getFearGreedColor(sentimentData.fearGreedIndex),
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6b7280', fontSize: '11px' }}>Extreme Fear</span>
              <span style={{ color: '#fff', fontSize: '16px', fontWeight: '700' }}>
                {sentimentData.fearGreedIndex}
              </span>
              <span style={{ color: '#6b7280', fontSize: '11px' }}>Extreme Greed</span>
            </div>
          </div>

          {/* VIX Volatility */}
          <div style={{ 
            padding: '12px',
            backgroundColor: '#1f2937',
            borderRadius: '8px',
            border: '1px solid #374151',
            marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>VIX Volatility</div>
                <div style={{ color: '#6b7280', fontSize: '11px' }}>Market Fear Index</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  color: getVixColor(sentimentData.vix), 
                  fontSize: '16px', 
                  fontWeight: '700' 
                }}>
                  {sentimentData.vix}
                </div>
                <div style={{ 
                  color: getVixColor(sentimentData.vix), 
                  fontSize: '10px', 
                  fontWeight: '600' 
                }}>
                  {getVixLabel(sentimentData.vix)}
                </div>
              </div>
            </div>
          </div>

          {/* Market Breadth */}
          <div style={{ 
            padding: '12px',
            backgroundColor: '#1f2937',
            borderRadius: '8px',
            border: '1px solid #374151',
            marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>Market Breadth</div>
                <div style={{ color: '#6b7280', fontSize: '11px' }}>Advancing vs Declining</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  color: getSentimentColor(sentimentData.marketBreadth), 
                  fontSize: '16px', 
                  fontWeight: '700' 
                }}>
                  {(sentimentData.marketBreadth * 100).toFixed(0)}%
                </div>
                <div style={{ 
                  color: getSentimentColor(sentimentData.marketBreadth), 
                  fontSize: '10px', 
                  fontWeight: '600' 
                }}>
                  {getSentimentLabel(sentimentData.marketBreadth)}
                </div>
              </div>
            </div>
          </div>

          {/* Social Sentiment */}
          <div style={{ 
            padding: '12px',
            backgroundColor: '#1f2937',
            borderRadius: '8px',
            border: '1px solid #374151',
            marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>Social Sentiment</div>
                <div style={{ color: '#6b7280', fontSize: '11px' }}>Social Media Analysis</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  color: getSentimentColor(sentimentData.socialSentiment), 
                  fontSize: '16px', 
                  fontWeight: '700' 
                }}>
                  {(sentimentData.socialSentiment * 100).toFixed(0)}%
                </div>
                <div style={{ 
                  color: getSentimentColor(sentimentData.socialSentiment), 
                  fontSize: '10px', 
                  fontWeight: '600' 
                }}>
                  {getSentimentLabel(sentimentData.socialSentiment)}
                </div>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div style={{ 
            textAlign: 'center',
            padding: '8px',
            color: '#6b7280',
            fontSize: '11px',
            maxHeight: isExpanded ? '1000px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease, opacity 0.3s ease',
            opacity: isExpanded ? 1 : 0
          }}>
            Last updated: {formatTime(sentimentData.lastUpdated)}
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketSentimentWidget; 