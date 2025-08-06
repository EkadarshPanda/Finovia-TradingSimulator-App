# Finovia - Full-Stack Paper Trading Application

Finovia is a comprehensive, full-stack web application that allows users to simulate stock trading with real-time market data. It's built with a modern technology stack featuring a React frontend and a Spring Boot backend, designed to provide a realistic and educational trading experience without financial risk.

## Features

- **User Authentication:** Secure user registration and login using JWT (JSON Web Tokens).
- **Portfolio Management:** A live dashboard showing virtual cash balance, total portfolio value, and real-time profit/loss.
- **Stock Trading:** Functionality to "buy" and "sell" real-world stocks at their current market prices.
- **Live Stock Screener:** Fetch detailed company profiles and fundamental financial data for any stock symbol.
- **Interactive Charting:** A professional, interactive TradingView chart for market analysis.
- **Trending News:** An integrated news feed to help users make informed decisions.

## Technology Stack

### Frontend
- **Framework:** React
- **Routing:** React Router
- **API Calls:** Axios
- **Styling:** CSS with a modern, dark-theme UI

### Backend
- **Framework:** Spring Boot (Java)
- **API:** REST APIs with Spring Web
- **Security:** Spring Security for authentication and JWT management
- **Database:** PostgreSQL with Spring Data JPA / Hibernate

### External Services
- **Database:** Supabase (Cloud PostgreSQL)
- **Financial Data:** Finnhub.io API
- **Charting:** TradingView Widgets

## Getting Started

### Prerequisites
- Java JDK 17 or higher
- Node.js and npm
- Git

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/EkadarshPanda/finovia-trading-app.git](https://github.com/EkadarshPanda/finovia-trading-app.git)
    cd finovia-trading-app
    ```

2.  **Backend Setup:**
    - Navigate to the `backend` directory.
    - Create an `application.properties` file in `src/main/resources`.
    - Add your database credentials and API keys to this file (use `application.properties.example` as a template).
    - Run the Spring Boot application using your IDE or Maven.

3.  **Frontend Setup:**
    - Navigate to the `frontend-react` directory.
    - Install dependencies: `npm install`
    - Start the development server: `npm run dev`

The application will be running at `http://localhost:5173`.
