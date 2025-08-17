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
    const generateRandomMarketData = () => {
      try {
        setLoading(true);
        
        // Generate random indices data
        const randomIndices = [
          { 
            symbol: '^GSPC', 
            name: 'S&P 500', 
            price: Math.random() * 2000 + 4000, // 4000-6000 range
            change: (Math.random() - 0.5) * 100, // -50 to +50 range
            changePercent: (Math.random() - 0.5) * 4 // -2% to +2% range
          },
          { 
            symbol: '^IXIC', 
            name: 'NASDAQ', 
            price: Math.random() * 3000 + 12000, // 12000-15000 range
            change: (Math.random() - 0.5) * 150, // -75 to +75 range
            changePercent: (Math.random() - 0.5) * 5 // -2.5% to +2.5% range
          },
          { 
            symbol: '^DJI', 
            name: 'DOW', 
            price: Math.random() * 1000 + 32000, // 32000-33000 range
            change: (Math.random() - 0.5) * 200, // -100 to +100 range
            changePercent: (Math.random() - 0.5) * 3 // -1.5% to +1.5% range
          }
        ];

        // Generate random sectors data
        const sectorNames = ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer', 'Industrial', 'Materials', 'Utilities'];
        const randomSectors = sectorNames.map(name => ({
          name,
          change: (Math.random() - 0.5) * 6, // -3% to +3% range
          color: Math.random() > 0.5 ? '#3cffa6' : '#ef4444'
        }));

        // Determine market status based on Indian market hours (7:00 PM - 1:30 AM IST)
        const now = new Date();
        const isWeekend = now.getDay() === 0 || now.getDay() === 6;
        
        // Convert current time to IST (Indian Standard Time)
        const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
        const currentHour = istTime.getHours();
        const currentMinute = istTime.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        
        // Market hours: 7:00 PM (1140 minutes) to 1:30 AM (90 minutes) IST
        // Note: 1:30 AM is 90 minutes from midnight, and 7:00 PM is 1140 minutes from midnight
        const marketOpenMinutes = 19 * 60; // 7:00 PM (1140 minutes)
        const marketCloseMinutes = 1 * 60 + 30; // 1:30 AM (90 minutes)
        
        // Handle the case where market hours span across midnight
        let isMarketHours;
        if (marketOpenMinutes > marketCloseMinutes) {
          // Market hours span across midnight (7:00 PM to 1:30 AM)
          isMarketHours = !isWeekend && (
            currentTimeInMinutes >= marketOpenMinutes || // After 7:00 PM
            currentTimeInMinutes < marketCloseMinutes    // Before 1:30 AM
          );
        } else {
          // Regular case (not applicable here but kept for safety)
          isMarketHours = !isWeekend && 
            currentTimeInMinutes >= marketOpenMinutes && 
            currentTimeInMinutes < marketCloseMinutes;
        }
        
        const marketStatus = isMarketHours ? 'OPEN' : 'CLOSED';

        const newMarketData = {
          ...marketData,
          indices: randomIndices,
          sectors: randomSectors,
          marketStatus
        };
        
        setMarketData(newMarketData);
        
        // Store the generated data in localStorage
        localStorage.setItem('marketData', JSON.stringify({
          indices: randomIndices,
          sectors: randomSectors
        }));
      } catch (err) {
        console.error('Error generating market data:', err);
      } finally {
        setLoading(false);
      }
    };

    // Check if we need to update data (once per day)
    const getStoredDate = () => {
      const stored = localStorage.getItem('marketDataDate');
      return stored ? new Date(stored) : null;
    };

    const setStoredDate = () => {
      localStorage.setItem('marketDataDate', new Date().toDateString());
    };

    const shouldUpdateData = () => {
      const storedDate = getStoredDate();
      const today = new Date().toDateString();
      return !storedDate || storedDate.toDateString() !== today;
    };

    if (shouldUpdateData()) {
      generateRandomMarketData();
      setStoredDate();
    } else {
      // Load existing data from localStorage if available
      const storedData = localStorage.getItem('marketData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setMarketData(prev => ({
            ...prev,
            indices: parsedData.indices || prev.indices,
            sectors: parsedData.sectors || prev.sectors
          }));
        } catch (err) {
          console.error('Error loading stored market data:', err);
        }
      }
      setLoading(false);
    }
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