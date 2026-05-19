
# Sensor-Manager

> Real-time monitoring dashboard for library occupancy, temperature and available seats.

**Licenciatura em Engenharia Informática — IADE – Universidade Europeia**  
Programação Web · 2º Ano, 2º Semestre

---

##  Team

| Name | Student ID | Role |
|------|-----------|------|
| Martim Fonseca | 20241218 | Backend & data processing logic |
| Bento D'Orey | 20241233 | Sensor configuration & real-time metrics capture, Frontend support |
| Vasco de Sousa Pinto | 20231182 | Frontend (HTML5 structure & CSS styling) |

---

##  Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database](#database)
- [REST API](#rest-api)
- [Design System](#design-system)
- [Use Cases & Domain Model](#use-cases--domain-model)
- [Known Limitations](#known-limitations)

---

## Overview

**Library Monitor Pro** is a real-time monitoring dashboard that displays live metrics about a library's current state — including occupancy, ambient temperature, and available seats. The application is built with a modular architecture to make it easy to maintain, extend, and integrate with physical sensors.

---

## Architecture

```
Sensors → Backend (Node.js/Express) → Database (MySQL/PostgreSQL)
                                              ↓
                              REST API → Frontend Dashboard
```

### Frontend
- Semantic **HTML5** + **CSS3**
- **Font Awesome** for metric icons
- **Chart.js** for dynamic occupancy graphs
- Fully responsive layout

### Backend
- **Node.js** + **Express.js**
- REST API exposing sensor data to the frontend
- Designed for real-time data updates

### Database
- **MySQL** / **PostgreSQL**
- Stores historical sensor readings for trend analysis

---

## Features

### Implemented

- [x] Responsive, modern visual dashboard
- [x] Real-time-ready structure for sensor metrics
- [x] Display of: **Temperature**, **People count**, **Free seats**
- [x] Chart.js integration for occupancy graph
- [x] Font Awesome icon library
- [x] Semantic HTML structure (`header`, `main`, `section`)
- [x] REST API-ready frontend structure
- [x] Dynamic data update infrastructure

###  Not Yet Implemented

- [ ] Full historical graph with real data
- [ ] Auto-updating real-time clock
- [ ] Automatic sensor data refresh
- [ ] Visual alerts for critical situations (e.g. full capacity, high temperature)
- [ ] Final sensor ↔ frontend integration
- [ ] User authentication system
- [ ] Persistent metric history in the database

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL / PostgreSQL |
| Visualisation | Chart.js |
| Icons | Font Awesome |

---

## Database

The database is designed to store sensor data and support historical analysis.

### Schema

**`sensors`**
| Field | Type |
|-------|------|
| id | PK |
| tipo | VARCHAR |
| localizacao | VARCHAR |

**`metrics`**
| Field | Type |
|-------|------|
| id | PK |
| sensor_id | FK → sensors.id |
| valor | FLOAT |
| timestamp | DATETIME |

**`library`**
| Field | Type |
|-------|------|
| id | PK |
| nome | VARCHAR |
| capacidade | INT |

### Relationships
- One **sensor** generates many **metrics**
- One **library** contains many **sensors**

The separation between `sensors` and `metrics` ensures scalability, data history, and flexibility to add new sensor types in the future.

---

## REST API

The REST API handles communication between sensors, backend, and frontend.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/metrics` | Returns all recorded metrics |
| `GET` | `/metrics/latest` | Returns the most recent sensor values |
| `POST` | `/metrics` | Submit new data from sensors |

### Example Response

```json
{
  "temperatura": 22,
  "pessoas": 43,
  "mesas_livres": 12
}
```

---

## Design System

| Token | Value |
|-------|-------|
| Primary colour | Blue |
| Background | White |
| Secondary elements | Grey |
| Typography | Sans-serif (Arial / Roboto) |
| Icons | Font Awesome |

### UI Components
- **Metric cards** — temperature, people, free seats
- **Occupancy chart** — rendered with Chart.js
- **Header** — system name + current time
- **Responsive grid** — adapts to all screen sizes

---

## Use Cases & Domain Model

### Actors
- **User (Student)** — browses the dashboard
- **Sensor System** — feeds data into the backend

### Main Use Cases
1. View library occupancy
2. Check ambient temperature
3. See number of available seats
4. Analyse historical occupancy trends
5. Automatic data refresh

### Domain Entities

```
Sensor
├── id
├── tipo (temperature | count | sound)
├── valor
└── timestamp

Metric
├── id
├── tipo (occupancy | temperature | seats)
├── valor
└── data_registo

Library
├── id
├── nome
└── capacidade_total
```

**Relationships:**
- A `Sensor` generates many `Metrics`
- A `Library` aggregates many `Metrics`

---

## Known Limitations

| Issue | Detail |
|-------|--------|
| **Static data** | Values are currently hardcoded in HTML for visual demonstration |
| **No live alerts** | No automatic warnings for full capacity, high temperature, or no seats |
| **Integration pending** | Full connection between physical sensors and frontend is not yet complete |

---

## Data Flow

```
1. Sensors capture data
2. Backend processes the information
3. Data is stored in the database
4. REST API exposes the data
5. Frontend consumes the API
6. Dashboard updates automatically
```

---

## Conclusion

Library Monitor Pro provides a modern, modular solution for real-time library monitoring. Although some features are still in development, the core architecture is in place and ready for future expansion — including full sensor integration, persistent storage, and user authentication.

---

## Project Structure

```
Sensor-Manager/
├── BD/             SQL scripts (table definitions and data)
├── Documentos/     Project report, PDFs, figures and individual reports
├── arduino/        Arduino sketch for the physical sensors
├── backend/        Server-side logic (PHP endpoints)
├── frontend/       Web interface (HTML, CSS, JavaScript, images)
└── README.md
```
