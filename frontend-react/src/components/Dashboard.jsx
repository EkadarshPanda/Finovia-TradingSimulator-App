import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Dashboard.css';
import TradeWidget from './TradeWidget';
import TradingViewWidget from './TradingViewWidget';
import NewsWidget from './NewsWidget';
import MyHoldingsWidget from './MyHoldingsWidget';
import MarketOverviewWidget from './MarketOverviewWidget';
import MarketSentimentWidget from './MarketSentimentWidget';
import Footer from './Footer';

function Dashboard() {
  const [portfolio, setPortfolio] = useState({ virtualBalance: 0, holdings: [] });
  const [livePrices, setLivePrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPortfolio = useCallback(async () => {
    try {
      if (!loading) setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token); // Debug log
      
      if (!token) {
        setError('No auth token found. Please log in again.');
        return;
      }
      
      const config = { headers: { Authorization: `Bearer ${token}` } };
      console.log('Fetching portfolio from:', 'http://localhost:8080/api/portfolio/me'); // Debug log
      
      const portfolioResponse = await axios.get('http://localhost:8080/api/portfolio/me', config);
      console.log('Portfolio response:', portfolioResponse.data); // Debug log
      
      setPortfolio(portfolioResponse.data);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Portfolio fetch error:', err); // Enhanced error logging
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
        
        if (err.response.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else if (err.response.status === 404) {
          setError('Portfolio endpoint not found. Backend may not be running.');
        } else {
          setError(`Server error: ${err.response.status} - ${err.response.data}`);
        }
      } else if (err.request) {
        setError('Cannot connect to backend server. Please ensure the backend is running on localhost:8080');
      } else {
        setError('Failed to fetch portfolio data: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  // Live prices fetch
  useEffect(() => {
    const fetchPrices = async () => {
      if (!portfolio.holdings || portfolio.holdings.length === 0) return;
      try {
        const pricePromises = portfolio.holdings.map(holding =>
          axios.get(`http://localhost:8080/api/stocks/quote/${holding.stockSymbol}`)
        );
        const priceResponses = await Promise.all(pricePromises);
        const newPrices = {};
        priceResponses.forEach((res, index) => {
          newPrices[portfolio.holdings[index].stockSymbol] = res.data.currentPrice;
        });
        setLivePrices(newPrices);
      } catch (err) {
        console.error("Could not re-fetch prices", err);
      }
    };

    fetchPrices();
    const intervalId = setInterval(fetchPrices, 30000);
    return () => clearInterval(intervalId);
  }, [portfolio.holdings]);

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center' }}>Loading portfolio...</div>;
  }
  if (error) {
    return (
      <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
        <h3>Error Loading Portfolio</h3>
        <p>{error}</p>
        <button 
          onClick={fetchPortfolio}
          style={{
            background: '#3cffa6',
            color: '#000',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // Calculations
  const totalHoldingsValue = portfolio.holdings.reduce((acc, holding) => {
    const currentPrice = livePrices[holding.stockSymbol] || holding.averagePurchasePrice;
    return acc + (currentPrice * holding.quantity);
  }, 0);

  const totalPurchaseValue = portfolio.holdings.reduce((acc, holding) => {
    return acc + (holding.averagePurchasePrice * holding.quantity);
  }, 0);

  const totalPortfolioValue = portfolio.virtualBalance + totalHoldingsValue;
  const totalPL = totalHoldingsValue - totalPurchaseValue;

  // Debug information
  console.log('Current portfolio state:', {
    virtualBalance: portfolio.virtualBalance,
    holdingsCount: portfolio.holdings?.length || 0,
    holdings: portfolio.holdings
  });

  // -------------------------------------
  // New Finovia-Style 3-column Dashboard
  // -------------------------------------
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      background: 'var(--bg-primary)'
    }}>
      <div className="dashboard-container">
        {/* Sidebar (left) */}
        <aside className="sidebar card">
        <div>
          <h2 style={{ color: "#fff", marginBottom: 4, fontWeight: 600 }}>Account Balance</h2>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#3cffa6" }}>
            ${portfolio.virtualBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Portfolio Stats */}
        <div style={{ marginTop: 24 }}>
          <h3 style={{ color: "#fff", marginBottom: 16, fontWeight: 600, fontSize: 16 }}>Portfolio Stats</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: "#b0b8c1", fontSize: 14 }}>Total Value</span>
              <span style={{ color: "#fff", fontWeight: 600 }}>
                ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: "#b0b8c1", fontSize: 14 }}>Holdings Value</span>
              <span style={{ color: "#72fff9", fontWeight: 600 }}>
                ${totalHoldingsValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: "#b0b8c1", fontSize: 14 }}>Total P/L</span>
              <span style={{ color: totalPL >= 0 ? "#22c55e" : "#ef4444", fontWeight: 600 }}>
                {totalPL >= 0 ? '+' : ''}${totalPL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: "#b0b8c1", fontSize: 14 }}>Stocks Owned</span>
              <span style={{ color: "#fa8f35", fontWeight: 600 }}>{portfolio.holdings.length}</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div style={{ marginTop: 24 }}>
          <h3 style={{ color: "#fff", marginBottom: 16, fontWeight: 600, fontSize: 16 }}>Performance</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: "#b0b8c1", fontSize: 14 }}>Return %</span>
              <span style={{ 
                color: totalPurchaseValue > 0 ? (totalPL / totalPurchaseValue * 100 >= 0 ? "#22c55e" : "#ef4444") : "#b0b8c1", 
                fontWeight: 600 
              }}>
                {totalPurchaseValue > 0 ? `${(totalPL / totalPurchaseValue * 100).toFixed(2)}%` : "0.00%"}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: "#b0b8c1", fontSize: 14 }}>Cash %</span>
              <span style={{ color: "#35fa71", fontWeight: 600 }}>
                {totalPortfolioValue > 0 ? `${((portfolio.virtualBalance / totalPortfolioValue) * 100).toFixed(1)}%` : "0.0%"}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: "#b0b8c1", fontSize: 14 }}>Invested %</span>
              <span style={{ color: "#72fff9", fontWeight: 600 }}>
                {totalPortfolioValue > 0 ? `${((totalHoldingsValue / totalPortfolioValue) * 100).toFixed(1)}%` : "0.0%"}
              </span>
            </div>
          </div>
        </div>

        {/* Market Overview Widget */}
        <MarketOverviewWidget />
      </aside>

      {/* Main center */}
      <main className="main-content">
        {/* Portfolio Overview */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ color: "#babec9" }}>Total Portfolio Value</div>
              <div style={{ color: "#fff", fontSize: 32, fontWeight: 700 }}>
                ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <span style={{ color: totalPL >= 0 ? "#22c55e" : "#ef4444", fontSize: 18, fontWeight: 600 }}>
                {totalPL >= 0 ? '+' : ''}${totalPL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span style={{ color: "#b0b8c1", fontSize: 14, marginLeft: 8 }}>P/L</span>
            </div>
          </div>
          <div style={{ marginTop: 18, display: 'flex', gap: 28 }}>
            {/* Example KPIs - you can adjust these or fetch real ones */}
            <div>
              <div style={{ color: "#babec9", fontSize: 13 }}>Total Stocks</div>
              <div style={{ color: "#72fff9", fontWeight: 600 }}>{portfolio.holdings.length}</div>
            </div>
            <div>
              <div style={{ color: "#babec9", fontSize: 13 }}>Top Holding</div>
              <div style={{ color: "#fa8f35", fontWeight: 600 }}>
                {portfolio.holdings.length > 0 ? portfolio.holdings[0].stockSymbol : "—"}
              </div>
            </div>
            <div>
              <div style={{ color: "#babec9", fontSize: 13 }}>Cash</div>
              <div style={{ color: "#35fa71", fontWeight: 600 }}>
                ${portfolio.virtualBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* My Holdings Widget */}
        <MyHoldingsWidget onRefresh={fetchPortfolio} />

        {/* Trade Widget card - moved above chart */}
        <div className="card" style={{ marginBottom: 16 }}>
          <TradeWidget onTradeSuccess={fetchPortfolio} />
        </div>

        {/* Chart Widget */}
        <div className="card" style={{ marginBottom: 16 }}>
          <TradingViewWidget />
        </div>
      </main>

      {/* News Sidebar (right) */}
      <aside className="news-sidebar card">
        <NewsWidget />
        <MarketSentimentWidget />
      </aside>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
