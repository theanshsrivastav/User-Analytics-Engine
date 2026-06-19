# User Analytics Engine

A lightweight full-stack analytics platform that captures user interactions on a webpage and visualizes session activity through an interactive dashboard.

The application includes an injection-ready JavaScript tracker, a Node.js backend, MongoDB for event storage, and a React-based analytics dashboard for exploring user journeys and click distributions.

---

## Features

### Event Tracking

* Tracks `page_view` events automatically on page load.
* Tracks `click` events with precise x/y coordinates.
* Generates and persists unique session identifiers using `localStorage`.
* Sends event data asynchronously to the backend API.

### Backend APIs

* Receive and store tracking events.
* Retrieve sessions with aggregated event counts.
* Fetch ordered events for a specific session.
* Retrieve click positions for heatmap visualization.

### Dashboard

* Sessions explorer with total event counts.
* User journey timeline displaying chronological event history.
* Heatmap page showing click distributions for selected URLs.

---

## Tech Stack

| Layer             | Technologies              |
| ----------------- | ------------------------- |
| Frontend          | React, Vite, Tailwind CSS |
| Backend           | Node.js, Express.js       |
| Database          | MongoDB Atlas, Mongoose   |
| Tracking          | Vanilla JavaScript        |
| Development Tools | Nodemon, Axios            |

---

## Architecture

```text
Client Website
       │
       │ tracker.js
       ▼
Express Backend API
       │
       ▼
MongoDB Atlas
       │
       ▼
React Dashboard
       ├── Sessions View
       ├── User Journey
       └── Heatmap View
```

---

## Project Structure

```text
User Analytics Engine/

├── server/
│   ├── models/
│   │   └── Event.js
│   ├── routes/
│   │   ├── eventRoutes.js
│   │   └── sessionRoutes.js
│   ├── .env
│   └── server.js
│

├── client/
│   ├── src/
│   │   ├── api/
│   │   │   └── analytics.js
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   └── TimelineItem.jsx
│   │   ├── pages/
│   │   │   ├── SessionsView.jsx
│   │   │   └── HeatmapView.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   └── vite.config.js
│
├── index.html
├── tracker.js
└── README.md
```

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>

cd user-analytics-engine
```

---

### 2. Configure Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string
```

---

### 3. Start the Backend

```bash
cd server

npm install

npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

---

### 4. Start the Frontend

Open a new terminal.

```bash
cd client

npm install

npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

### 5. Launch Demo Website

Serve `index.html` using any static server.

Examples:

* VS Code Live Server
* Python HTTP Server

```bash
python -m http.server 5500
```

Open:

```text
http://localhost:5500
```

---

## API Endpoints

### Store Event

```http
POST /api/events
```

---

### Get Sessions

```http
GET /api/sessions
```

Returns session IDs with total event counts.

---

### Get Session Events

```http
GET /api/sessions/:sessionId
```

Returns events ordered chronologically.

---

### Get Heatmap Data

```http
GET /api/heatmap?page=/products
```

Returns click coordinates for a page.

---

## Assumptions and Trade-offs

* Session identifiers are persisted in `localStorage`.
* Heatmap visualization is implemented using absolute-positioned click markers.
* Authentication and authorization are intentionally omitted.
* Click tracking focuses on coordinate collection only and does not record scroll depth or element metadata.
* The application prioritizes simplicity and interview explainability over production-scale optimizations.

---

## Future Improvements

* Session expiration handling
* Scroll tracking
* Element metadata capture
* Real-time analytics via WebSockets
* Event batching and queueing
* Advanced heatmap rendering libraries
* User authentication and role-based access

```
```
