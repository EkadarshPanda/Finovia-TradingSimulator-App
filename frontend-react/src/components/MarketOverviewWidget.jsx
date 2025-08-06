import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MarketOverviewWidget() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [marketData, setMarketData] = useState({
    indices: [
      { symbol: '^GSPC', name: 'S&P 500', price: 0, change: 0, changePercent: 0 },
      { symbol: '^IXIC', name: 'NASDAQ', price: 0, change: 0, changePercent: 0 },
      { symbol: '^DJI', name: 'DOW', price: 0, change: 0, changePercent: 0 }
    ],
    marketStatus: 'CLOSED',
    sectors: [
      { name: 'Technology', change: 1.2, color: '#3cffa6' },
      { name: 'Healthcare', change: -0.8, color: '#ef4444' },
      { name: 'Finance', change: 0.5, color: '#3cffa6' },
      { name: 'Energy', change: 2.1, color: '#3cffa6' }
    ]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        
        // Fetch major indices
        const indexPromises = marketData.indices.map(async (index) => {
          try {
            const response = await axios.get(`http://localhost:8080/api/stocks/quote/${index.symbol}`);
            return {
              ...index,
              price: response.data.currentPrice || 0,
              change: response.data.change || 0,
              changePercent: response.data.changePercent || 0
            };
          } catch (err) {
            console.error(`Error fetching ${index.symbol}:`, err);
            return index;
          }
        });

        const updatedIndices = await Promise.all(indexPromises);
        
        // Determine market status (simplified logic)
        const now = new Date();
        const isWeekend = now.getDay() === 0 || now.getDay() === 6;
        const isMarketHours = !isWeekend && now.getHours() >= 9 && now.getHours() < 16;
        const marketStatus = isMarketHours ? 'OPEN' : 'CLOSED';

        setMarketData(prev => ({
          ...prev,
          indices: updatedIndices,
          marketStatus
        }));
      } catch (err) {
        console.error('Error fetching market data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    
    // Update every 5 minutes
    const interval = setInterval(fetchMarketData, 300000);
    return () => clearInterval(interval);
  }, []);

  const getMarketStatusColor = (status) => {
    return status === 'OPEN' ? '#22c55e' : '#ef4444';
  };

  const getChangeColor = (change) => {
    return change >= 0 ? '#22c55e' : '#ef4444';
  };

  return (
    <div style={{ marginTop: '24px' }}>
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
          Market Overview
        </h3>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          transition: 'transform 0.2s ease'
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: getMarketStatusColor(marketData.marketStatus),
            boxShadow: `0 0 6px ${getMarketStatusColor(marketData.marketStatus)}40`
          }} />
          <span style={{ 
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            fontSize: '12px',
            color: 'var(--text-accent)'
          }}>
            ▼
          </span>
        </div>
      </div>
      
      {/* Market Status */}
      <div style={{ 
        marginBottom: '16px', 
        padding: '12px', 
        backgroundColor: '#1f2937', 
        borderRadius: '8px',
        border: '1px solid #374151',
        maxHeight: isExpanded ? '1000px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease, opacity 0.3s ease',
        opacity: isExpanded ? 1 : 0
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Market Status</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: getMarketStatusColor(marketData.marketStatus),
              boxShadow: `0 0 8px ${getMarketStatusColor(marketData.marketStatus)}40`
            }} />
            <span style={{ 
              color: getMarketStatusColor(marketData.marketStatus), 
              fontWeight: '600',
              fontSize: '14px'
            }}>
              {marketData.marketStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Major Indices */}
      <div style={{ 
        marginBottom: '16px',
        maxHeight: isExpanded ? '1000px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease, opacity 0.3s ease',
        opacity: isExpanded ? 1 : 0
      }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '8px', fontWeight: '500' }}>
          Major Indices
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {marketData.indices.map((index) => (
            <div
              key={index.symbol}
              style={{
                padding: '10px 12px',
                backgroundColor: '#1f2937',
                borderRadius: '6px',
                border: '1px solid #374151',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>
                  {index.name}
                </div>
                <div style={{ color: '#b0b8c1', fontSize: '11px' }}>
                  {index.symbol}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>
                  ${index.price?.toFixed(2) || 'N/A'}
                </div>
                <div style={{ 
                  color: getChangeColor(index.changePercent),
                  fontSize: '11px',
                  fontWeight: '500'
                }}>
                  {index.changePercent >= 0 ? '+' : ''}{index.changePercent?.toFixed(2) || '0.00'}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Performance */}
      <div style={{ 
        maxHeight: isExpanded ? '1000px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease, opacity 0.3s ease',
        opacity: isExpanded ? 1 : 0
      }}>
        <div style={{ color: '#b0b8c1', fontSize: '12px', marginBottom: '8px', fontWeight: '500' }}>
          Sector Performance
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {marketData.sectors.map((sector, index) => (
            <div
              key={index}
              style={{
                padding: '8px 12px',
                backgroundColor: '#1f2937',
                borderRadius: '6px',
                border: '1px solid #374151',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ color: '#fff', fontSize: '12px' }}>
                {sector.name}
              </span>
              <span style={{ 
                color: getChangeColor(sector.change),
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh indicator */}
      {loading && isExpanded && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '12px',
          color: '#b0b8c1',
          fontSize: '11px',
          maxHeight: isExpanded ? '1000px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease, opacity 0.3s ease',
          opacity: isExpanded ? 1 : 0
        }}>
          Updating...
        </div>
      )}
    </div>
  );
}

export default MarketOverviewWidget; 