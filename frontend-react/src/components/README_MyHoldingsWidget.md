# MyHoldingsWidget Component

## Overview
The MyHoldingsWidget is a comprehensive holdings management component that displays detailed information about a user's stock portfolio, including real-time PnL calculations and performance statistics.

## Features

### 📊 Summary Statistics
- **Total Value**: Current market value of all holdings
- **Total P/L**: Absolute profit/loss in dollars
- **P/L %**: Percentage gain/loss on total investment
- **Positions**: Number of different stocks held

### 📈 Detailed Holdings Table
- **Symbol**: Stock ticker symbol
- **Quantity**: Number of shares owned
- **Avg Price**: Average purchase price per share
- **Current**: Current market price (updated every 30 seconds)
- **Value**: Current market value of the position
- **P/L**: Absolute profit/loss for each position
- **P/L %**: Percentage gain/loss for each position

### 🔄 Interactive Features
- **Sortable Columns**: Click any column header to sort by that field
- **Real-time Updates**: Live prices update every 30 seconds
- **Refresh Button**: Manual refresh of holdings data
- **Responsive Design**: Works on desktop and mobile devices

### 🎨 Visual Design
- **Color-coded P/L**: Green for profits, red for losses
- **Modern UI**: Matches the Finovia dashboard theme
- **Hover Effects**: Interactive table rows and buttons
- **Loading States**: Smooth loading and error handling

## Technical Details

### Props
- `onRefresh`: Callback function called when data is refreshed

### State Management
- Fetches holdings data from `/api/portfolio/me`
- Fetches live prices from `/api/stocks/quote/{symbol}`
- Auto-updates prices every 30 seconds
- Handles loading and error states

### Calculations
- **Current Value**: `currentPrice × quantity`
- **Total Cost**: `averagePurchasePrice × quantity`
- **P/L**: `currentValue - totalCost`
- **P/L %**: `(P/L / totalCost) × 100`

## Usage

```jsx
import MyHoldingsWidget from './MyHoldingsWidget';

function Dashboard() {
  const handleRefresh = () => {
    // Refresh dashboard data
  };

  return (
    <div>
      <MyHoldingsWidget onRefresh={handleRefresh} />
    </div>
  );
}
```

## API Endpoints Used

### GET `/api/portfolio/me`
Returns user's portfolio data including:
- `virtualBalance`: Available cash
- `holdings`: Array of holding objects

### GET `/api/stocks/quote/{symbol}`
Returns current stock price:
- `currentPrice`: Current market price

## Styling
The component uses its own CSS file (`MyHoldingsWidget.css`) with:
- Dark theme matching the dashboard
- Responsive grid layouts
- Smooth animations and transitions
- Mobile-friendly design

## Error Handling
- Network errors with retry functionality
- Authentication errors with clear messaging
- Graceful fallbacks for missing data
- Loading states for better UX 