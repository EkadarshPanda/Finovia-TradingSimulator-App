import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyHoldingsWidget.css';

const MyHoldingsWidget = ({ onRefresh }) => {
  const [holdings, setHoldings] = useState([]);
  const [livePrices, setLivePrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'symbol', direction: 'asc' });
  const [isExpanded, setIsExpanded] = useState(true);

  const fetchHoldings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No auth token found. Please log in again.');
        return;
      }
      
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const portfolioResponse = await axios.get('http://localhost:8080/api/portfolio/me', config);
      
      setHoldings(portfolioResponse.data.holdings || []);
      setError('');
    } catch (err) {
      console.error('Holdings fetch error:', err);
      setError('Failed to fetch holdings data');
    } finally {
      setLoading(false);
    }
  };

  const fetchLivePrices = async () => {
    if (!holdings || holdings.length === 0) return;
    
    try {
      const pricePromises = holdings.map(holding =>
        axios.get(`http://localhost:8080/api/stocks/quote/${holding.stockSymbol}`)
      );
      const priceResponses = await Promise.all(pricePromises);
      const newPrices = {};
      priceResponses.forEach((res, index) => {
        newPrices[holdings[index].stockSymbol] = res.data.currentPrice;
      });
      setLivePrices(newPrices);
    } catch (err) {
      console.error("Could not fetch live prices", err);
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  useEffect(() => {
    fetchLivePrices();
    const intervalId = setInterval(fetchLivePrices, 30000); // Update every 30 seconds
    return () => clearInterval(intervalId);
  }, [holdings]);

  const calculateHoldingStats = (holding) => {
    const currentPrice = livePrices[holding.stockSymbol] || holding.averagePurchasePrice;
    const currentValue = currentPrice * holding.quantity;
    const totalCost = holding.averagePurchasePrice * holding.quantity;
    const pnl = currentValue - totalCost;
    const pnlPercent = totalCost > 0 ? (pnl / totalCost) * 100 : 0;
    
    return {
      currentPrice,
      currentValue,
      totalCost,
      pnl,
      pnlPercent
    };
  };

  const getTotalStats = () => {
    const stats = holdings.reduce((acc, holding) => {
      const holdingStats = calculateHoldingStats(holding);
      return {
        totalValue: acc.totalValue + holdingStats.currentValue,
        totalCost: acc.totalCost + holdingStats.totalCost,
        totalPnl: acc.totalPnl + holdingStats.pnl,
        totalQuantity: acc.totalQuantity + holding.quantity
      };
    }, { totalValue: 0, totalCost: 0, totalPnl: 0, totalQuantity: 0 });

    stats.totalPnlPercent = stats.totalCost > 0 ? (stats.totalPnl / stats.totalCost) * 100 : 0;
    return stats;
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedHoldings = [...holdings].sort((a, b) => {
    const aStats = calculateHoldingStats(a);
    const bStats = calculateHoldingStats(b);
    
    let aValue, bValue;
    
    switch (sortConfig.key) {
      case 'symbol':
        aValue = a.stockSymbol;
        bValue = b.stockSymbol;
        break;
      case 'quantity':
        aValue = a.quantity;
        bValue = b.quantity;
        break;
      case 'avgPrice':
        aValue = a.averagePurchasePrice;
        bValue = b.averagePurchasePrice;
        break;
      case 'currentPrice':
        aValue = aStats.currentPrice;
        bValue = bStats.currentPrice;
        break;
      case 'value':
        aValue = aStats.currentValue;
        bValue = bStats.currentValue;
        break;
      case 'pnl':
        aValue = aStats.pnl;
        bValue = bStats.pnl;
        break;
      case 'pnlPercent':
        aValue = aStats.pnlPercent;
        bValue = bStats.pnlPercent;
        break;
      default:
        aValue = a.stockSymbol;
        bValue = b.stockSymbol;
    }
    
    if (sortConfig.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalStats = getTotalStats();

  if (loading) {
    return (
      <div className="holdings-widget card">
        <div className="holdings-header" onClick={() => setIsExpanded(!isExpanded)}>
          <h3>My Holdings</h3>
          <div className="holdings-actions">
            <button onClick={fetchHoldings} className="refresh-btn" onClick={(e) => e.stopPropagation()}>
              ↻
            </button>
            <span className={`expand-arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
        </div>
        <div className={`holdings-content ${isExpanded ? 'expanded' : ''}`}>
          <div className="loading-spinner">Loading holdings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="holdings-widget card">
        <div className="holdings-header" onClick={() => setIsExpanded(!isExpanded)}>
          <h3>My Holdings</h3>
          <div className="holdings-actions">
            <span className={`expand-arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
        </div>
        <div className={`holdings-content ${isExpanded ? 'expanded' : ''}`}>
          <div className="error-message">{error}</div>
          <button onClick={fetchHoldings} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="holdings-widget card">
      <div className="holdings-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>My Holdings</h3>
        <div className="holdings-actions">
          <button onClick={fetchHoldings} className="refresh-btn" title="Refresh" onClick={(e) => e.stopPropagation()}>
            ↻
          </button>
          <span className={`expand-arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
        </div>
      </div>

      <div className={`holdings-content ${isExpanded ? 'expanded' : ''}`}>
        {/* Summary Statistics */}
        <div className="holdings-summary">
          <div className="summary-item">
            <span className="summary-label">Total Value</span>
            <span className="summary-value">
              ${totalStats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total P/L</span>
            <span className={`summary-value ${totalStats.totalPnl >= 0 ? 'positive' : 'negative'}`}>
              {totalStats.totalPnl >= 0 ? '+' : ''}${totalStats.totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">P/L %</span>
            <span className={`summary-value ${totalStats.totalPnlPercent >= 0 ? 'positive' : 'negative'}`}>
              {totalStats.totalPnlPercent >= 0 ? '+' : ''}{totalStats.totalPnlPercent.toFixed(2)}%
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Positions</span>
            <span className="summary-value">{holdings.length}</span>
          </div>
        </div>

        {/* Holdings Table */}
        {holdings.length === 0 ? (
          <div className="no-holdings">
            <p>No holdings yet. Start trading to see your positions here.</p>
          </div>
        ) : (
          <div className="holdings-table-container">
            <table className="holdings-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('symbol')} className="sortable">
                    Symbol {sortConfig.key === 'symbol' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('quantity')} className="sortable">
                    Qty {sortConfig.key === 'quantity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('avgPrice')} className="sortable">
                    Avg Price {sortConfig.key === 'avgPrice' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('currentPrice')} className="sortable">
                    Current {sortConfig.key === 'currentPrice' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('value')} className="sortable">
                    Value {sortConfig.key === 'value' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('pnl')} className="sortable">
                    P/L {sortConfig.key === 'pnl' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('pnlPercent')} className="sortable">
                    P/L % {sortConfig.key === 'pnlPercent' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedHoldings.map((holding) => {
                  const stats = calculateHoldingStats(holding);
                  return (
                    <tr key={holding.stockSymbol}>
                      <td className="symbol-cell">
                        <span className="symbol">{holding.stockSymbol}</span>
                      </td>
                      <td>{holding.quantity.toLocaleString()}</td>
                      <td>${holding.averagePurchasePrice.toFixed(2)}</td>
                      <td>${stats.currentPrice.toFixed(2)}</td>
                      <td>${stats.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className={stats.pnl >= 0 ? 'positive' : 'negative'}>
                        {stats.pnl >= 0 ? '+' : ''}${stats.pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className={stats.pnlPercent >= 0 ? 'positive' : 'negative'}>
                        {stats.pnlPercent >= 0 ? '+' : ''}{stats.pnlPercent.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyHoldingsWidget; 