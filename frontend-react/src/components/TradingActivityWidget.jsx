import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TradingActivityWidget() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [tradingData, setTradingData] = useState({
    recentTrades: [
      {
        id: 1,
        symbol: 'AAPL',
        type: 'BUY',
        quantity: 10,
        price: 203.35,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: 'COMPLETED'
      },
      {
        id: 2,
        symbol: 'TSLA',
        type: 'SELL',
        quantity: 5,
        price: 309.26,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        status: 'COMPLETED'
      },
      {
        id: 3,
        symbol: 'MSFT',
        type: 'BUY',
        quantity: 15,
        price: 415.80,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        status: 'COMPLETED'
      }
    ],
    pendingOrders: [
      {
        id: 4,
        symbol: 'GOOGL',
        type: 'BUY',
        quantity: 8,
        price: 145.50,
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        status: 'PENDING'
      }
    ],
    dailySummary: {
      totalTrades: 3,
      totalVolume: 30,
      totalValue: 8234.50,
      profitLoss: 156.80
    }
  });

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const getTradeTypeColor = (type) => {
    return type === 'BUY' ? '#22c55e' : '#ef4444';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return '#22c55e';
      case 'PENDING':
        return '#f59e0b';
      case 'CANCELLED':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return '✓';
      case 'PENDING':
        return '⏳';
      case 'CANCELLED':
        return '✗';
      default:
        return '?';
    }
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
        <h3 style={{ color: "#87fff7", marginBottom: '0', fontSize: '1.1rem', fontWeight: '600' }}>
          Trading Activity
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
            backgroundColor: '#22c55e',
            boxShadow: '0 0 6px #22c5540'
          }} />
          <span style={{ 
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            fontSize: '12px',
            color: '#87fff7'
          }}>
            ▼
          </span>
        </div>
      </div>
      
      {/* Daily Summary */}
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
        <div style={{ color: '#b0b8c1', fontSize: '12px', marginBottom: '8px', fontWeight: '500' }}>
          Today's Summary
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>
              {tradingData.dailySummary.totalTrades} Trades
            </div>
            <div style={{ color: '#b0b8c1', fontSize: '11px' }}>
              {tradingData.dailySummary.totalVolume} Shares
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>
              ${tradingData.dailySummary.totalValue.toLocaleString()}
            </div>
            <div style={{ 
              color: tradingData.dailySummary.profitLoss >= 0 ? '#22c55e' : '#ef4444',
              fontSize: '11px',
              fontWeight: '500'
            }}>
              {tradingData.dailySummary.profitLoss >= 0 ? '+' : ''}${tradingData.dailySummary.profitLoss.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Pending Orders */}
      {tradingData.pendingOrders.length > 0 && (
        <div style={{ 
          marginBottom: '16px',
          maxHeight: isExpanded ? '1000px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease, opacity 0.3s ease',
          opacity: isExpanded ? 1 : 0
        }}>
          <div style={{ color: '#b0b8c1', fontSize: '12px', marginBottom: '8px', fontWeight: '500' }}>
            Pending Orders
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {tradingData.pendingOrders.map((order) => (
              <div
                key={order.id}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: getStatusColor(order.status)
                  }} />
                  <div>
                    <div style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>
                      {order.symbol}
                    </div>
                    <div style={{ color: '#b0b8c1', fontSize: '11px' }}>
                      {order.quantity} shares @ ${order.price}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    color: getTradeTypeColor(order.type),
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {order.type}
                  </div>
                  <div style={{ color: '#b0b8c1', fontSize: '10px' }}>
                    {formatTime(order.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Trades */}
      <div style={{ 
        maxHeight: isExpanded ? '1000px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease, opacity 0.3s ease',
        opacity: isExpanded ? 1 : 0
      }}>
        <div style={{ color: '#b0b8c1', fontSize: '12px', marginBottom: '8px', fontWeight: '500' }}>
          Recent Trades
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
          {tradingData.recentTrades.map((trade) => (
            <div
              key={trade.id}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(trade.status)
                }} />
                <div>
                  <div style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>
                    {trade.symbol}
                  </div>
                  <div style={{ color: '#b0b8c1', fontSize: '11px' }}>
                    {trade.quantity} shares @ ${trade.price}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  color: getTradeTypeColor(trade.type),
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {trade.type}
                </div>
                <div style={{ color: '#b0b8c1', fontSize: '10px' }}>
                  {formatTime(trade.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View All Trades Button */}
      {isExpanded && (
        <button
          style={{
            width: '100%',
            marginTop: '12px',
            padding: '8px 12px',
            backgroundColor: '#374151',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '500',
            cursor: 'pointer',
            fontSize: '13px',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#374151'}
        >
          View All Trades
        </button>
      )}
    </div>
  );
}

export default TradingActivityWidget; 