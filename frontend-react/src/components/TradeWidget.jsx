import React, { useState } from 'react';
import axios from 'axios';

function TradeWidget({ onTradeSuccess }) {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [quote, setQuote] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Sample companies for the grid
  const companies = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META',
    'NVDA', 'NFLX', 'AMD', 'INTC', 'CRM', 'ADBE'
  ];

  const handleGetQuote = async (selectedSymbol = symbol) => {
    if (!selectedSymbol) return;
    setMessage('');
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/stocks/quote/${selectedSymbol}`);
      setQuote(response.data);
      setSymbol(selectedSymbol);
    } catch (error) {
      setMessage(`Error fetching quote for ${selectedSymbol}`);
      setQuote(null);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!symbol || quantity <= 0) return;
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = { symbol, quantity: parseInt(quantity, 10) };

      await axios.post('http://localhost:8080/api/stocks/buy', payload, config);
      setMessage(`Successfully purchased ${quantity} share(s) of ${symbol}!`);
      setQuote(null);
      onTradeSuccess();
    } catch (error) {
      setMessage(error.response?.data || 'Purchase failed.');
      console.error(error);
    }
  };

  const handleSell = async () => {
    if (!symbol || quantity <= 0) return;
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = { symbol, quantity: parseInt(quantity, 10) };

      await axios.post('http://localhost:8080/api/stocks/sell', payload, config);
      setMessage(`Successfully sold ${quantity} share(s) of ${symbol}!`);
      setQuote(null);
      onTradeSuccess();
    } catch (error) {
      setMessage(error.response?.data || 'Sale failed.');
      console.error(error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGetQuote();
    }
  };

  const handleCompanyClick = (company) => {
    handleGetQuote(company);
  };

  return (
    <div style={{ 
      textAlign: 'left',
      backgroundColor: '#22252b',
      borderRadius: '16px',
      border: '1px solid #313343',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 16px rgba(0,0,0,0.13)'
    }}>
      {/* Header - Clickable to expand/collapse */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '16px 20px',
          backgroundColor: '#1f2937',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'background-color 0.2s ease',
          borderBottom: isExpanded ? '1px solid #374151' : 'none'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#1f2937'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#3cffa6',
            boxShadow: '0 0 8px rgba(60, 255, 166, 0.4)'
          }} />
          <h2 style={{ 
            margin: 0, 
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#eaeaea'
          }}>
            New Trade
          </h2>
        </div>
        <div style={{
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease',
          color: '#9ca3af',
          fontSize: '18px'
        }}>
          ▼
        </div>
      </div>

      {/* Collapsible Content */}
      <div style={{
        maxHeight: isExpanded ? '800px' : '0px',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease-in-out',
        backgroundColor: '#22252b'
      }}>
        <div style={{ padding: '20px' }}>
          {/* Search Bar */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#1f2937',
              borderRadius: '8px',
              border: '2px solid #3cffa6',
              padding: '12px 16px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#4ade80';
              e.target.style.boxShadow = '0 4px 8px rgba(60, 255, 166, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#3cffa6';
              e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            }}
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#3cffa6" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ marginRight: '12px' }}
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Search for a company"
                style={{ 
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  color: '#eaeaea',
                  backgroundColor: 'transparent'
                }}
              />
              <button 
                onClick={() => handleGetQuote()}
                disabled={isLoading || !symbol}
                style={{ 
                  padding: '8px 16px',
                  backgroundColor: isLoading || !symbol ? '#374151' : '#3cffa6',
                  color: isLoading || !symbol ? '#6c757d' : '#000',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: isLoading || !symbol ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && symbol) {
                    e.target.style.backgroundColor = '#4ade80';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading && symbol) {
                    e.target.style.backgroundColor = '#3cffa6';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      border: '2px solid transparent',
                      borderTop: '2px solid #000',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Loading...
                  </>
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </div>

          {/* Trending stocks section */}
          <div style={{ marginBottom: '20px' }}>
            <span style={{ 
              color: '#eaeaea', 
              fontSize: '16px', 
              fontWeight: '500' 
            }}>
              Trending stocks:
            </span>
          </div>

          {/* Company Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '24px'
          }}>
            {companies.map((company) => (
              <button
                key={company}
                onClick={() => handleCompanyClick(company)}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#eaeaea',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#374151';
                  e.target.style.borderColor = '#3cffa6';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(60, 255, 166, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#1f2937';
                  e.target.style.borderColor = '#374151';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {company}
              </button>
            ))}
          </div>

          {/* Quote Display */}
          {quote && (
            <div style={{ 
              marginBottom: '20px',
              padding: '20px', 
              backgroundColor: '#1f2937', 
              borderRadius: '10px', 
              border: '1px solid #374151',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              animation: 'slideDown 0.3s ease'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '20px' 
              }}>
                <div>
                  <h4 style={{ margin: 0, color: '#eaeaea', fontSize: '18px', fontWeight: '600' }}>
                    {symbol}
                  </h4>
                  <p style={{ margin: '4px 0 0 0', color: '#9ca3af', fontSize: '14px' }}>
                    Current Price
                  </p>
                </div>
                <span style={{ 
                  color: '#3cffa6', 
                  fontWeight: '700', 
                  fontSize: '28px',
                  textShadow: '0 0 10px rgba(60, 255, 166, 0.3)'
                }}>
                  ${quote.currentPrice.toFixed(2)}
                </span>
              </div>
              
              {/* Trading Controls */}
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                alignItems: 'center', 
                flexWrap: 'wrap' 
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ color: '#eaeaea', fontSize: '14px', fontWeight: '500' }}>
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    style={{ 
                      padding: '10px 12px', 
                      borderRadius: '6px', 
                      border: '1px solid #374151',
                      backgroundColor: '#1f2937',
                      color: '#eaeaea',
                      width: '120px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3cffa6';
                      e.target.style.boxShadow = '0 0 0 2px rgba(60, 255, 166, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#374151';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={handleBuy} 
                    style={{ 
                      padding: '10px 20px', 
                      backgroundColor: '#22c55e',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#16a34a';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(34, 197, 94, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#22c55e';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Buy
                  </button>
                  <button 
                    onClick={handleSell} 
                    style={{ 
                      padding: '10px 20px', 
                      backgroundColor: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#dc2626';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#ef4444';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Sell
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div style={{ 
              padding: '12px 16px',
              backgroundColor: message.includes('Successfully') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: message.includes('Successfully') ? '#22c55e' : '#ef4444',
              borderRadius: '8px',
              fontSize: '14px',
              border: `1px solid ${message.includes('Successfully') ? '#22c55e' : '#ef4444'}`,
              animation: 'slideDown 0.3s ease'
            }}>
              {message}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default TradeWidget;