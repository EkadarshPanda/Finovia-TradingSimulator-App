# Finovia - Paper Trading Simulator

A full-stack web application for simulated stock trading with real-time market data.

## Features
- User authentication with JWT
- Portfolio management & live trading
- Real-time stock quotes via Finnhub API
- Interactive TradingView charts
- News feed integration

## Tech Stack
- **Frontend**: React, React Router, Axios
- **Backend**: Spring Boot, Spring Security, JPA
- **Database**: PostgreSQL (Supabase)
- **APIs**: Finnhub.io, TradingView

## Quick Start

### Backend
```bash
cd backend
# Add database credentials to src/main/resources/application.properties
mvn spring-boot:run
```

### Frontend
```bash
cd frontend-react
npm install
npm run dev
```

Access at `http://localhost:5173`

## Environment Setup
Create `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=your_db_url
spring.datasource.username=your_username
spring.datasource.password=your_password
finnhub.api.key=your_api_key
```
