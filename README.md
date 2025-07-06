# 🎮 Rock, Paper, Scissors Game

A full-stack **Rock, Paper, Scissors** game featuring a **Spring Boot** backend, an **Angular** frontend, an **H2 Database**, and **Docker** containerization.

Includes **player management**, **game logic**, a **leaderboard**, and **monitoring setup** with Prometheus.

## 📚 Table of Contents

- [✨ Features](#-features)
- [🛠 Technologies Used](#-technologies-used)
- [🚀 Getting Started](#-getting-started)
  - [✅ Prerequisites](#-prerequisites)
  - [⚙️ Backend Setup](#-backend-setup)
  - [🎨 Frontend Setup](#-frontend-setup)
  - [🐳 Docker Setup](#-docker-setup)
- [🏃 Running the Application](#-running-the-application)
- [🌐 Access the Application](#-access-the-application)
- [📐 UI/UX Design](#-uiux-design)
- [📡 API Endpoints](#-api-endpoints)
- [🕹️ How to Play](#️-how-to-play)
- [📁 Project Structure](#-project-structure)
- [🔮 Future Enhancements](#-future-enhancements)

## ✨ Features

- **Player Management**: Create and reset player profiles.
- **Classic RPS Gameplay**: Play Rock, Paper, Scissors against a computer opponent.
- **Dynamic Leaderboard**: Ranked by [Wilson Score Interval](https://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval#Wilson_score_interval).
- **Responsive UI**: Built with Angular and Tailwind CSS, with building reusable components in mind.
- **Keyboard Shortcut**: Press **`TAB`** to view the leaderboard while playing.
- **API Documentation**: Swagger/OpenAPI UI available.
- **H2 Database Console**: Inspect the in-memory database via browser.
- **Metrics Monitoring**: Via [Micrometer](https://micrometer.io/) and [Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/actuator-api/html/) with Prometheus integration.
- **Dockerized Deployment**: Single Docker container for backend & frontend.
- **Intelligent Caching**: Angular Signals for caching players and leaderboard data.

## 🛠 Technologies Used

### 🔧 Backend

- [Spring Boot](https://spring.io/projects/spring-boot)
- [Maven](https://maven.apache.org/)
- [H2 Database](https://www.h2database.com/)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Micrometer](https://micrometer.io/)
- [Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/actuator-api/html/)
- [Lombok](https://projectlombok.org/)
- [Swagger/OpenAPI](https://swagger.io/)

### 🎨 Frontend

- [Angular 20+](https://angular.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Angular Signals](https://angular.dev/guide/signals)

### 🐳 Containerization & Monitoring

- [Docker](https://www.docker.com/)
- [Prometheus](https://prometheus.io/)

## 🚀 Getting Started

### ✅ Prerequisites

Ensure you have the following installed:

- Java Development Kit (JDK) 17+
- Maven 3.8.5+
- Node.js 18+ & npm 8+ (or Yarn)
- Angular CLI 17+ → `npm install -g @angular/cli`
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

### ⚙️ Backend Setup

```bash
cd rps-challengee/backend
mvn clean install
```

### 🎨 Frontend Setup

```bash
cd rps-challengee/frontend
npm install
npm run build
```

### 🐳 Docker Setup

```bash
docker build --no-cache -t rps-challengee .
```
Troubleshooting:
Make sure Dockerfile, nginx.conf, and docker-entrypoint.sh are in plain text format (not RTF).
Avoid inline comments — place comments on separate lines.

## 🏃 Running the Application

```bash
docker run -p 80:80 -p 8080:8080 --name my-rps-app rps-challengee
```

## 🌐 Access the Application

```bash
🎮 Frontend	            | http://localhost:4200
📊 Prometheus Metrics	  | http://localhost:8080/actuator/prometheus
🛢️ H2 Console	          | http://localhost:8080/h2-console
🧾 Swagger UI	          | http://localhost:8080/swagger-ui/index.html
```

```bash
H2 Console Settings:

JDBC URL: jdbc:h2:mem:testdb
User: sa
Password: myverystrongpassword
```

📍 Prometheus UI (if running separately):
http://localhost:9090

Ensure prometheus.yml scrapes host.docker.internal:8080.

## 📐 UI/UX Design
This project includes a Figma file for the color palette of the reusable button UI component.

Figma Link: [RPS Figma Design](https://www.figma.com/design/QUTgI6n68WYZdcKe7c2kzd/RPS-Figma?node-id=0-1&m=dev&t=b0azLlaDYP928T2r-1).

This design helps maintain UI consistency and can be extended for future visual enhancements.

## 📡 API Endpoints

```bash
GET	/player	List all players
POST	/player	Create a new player
POST	/player/reset/{playerId}	Reset a player's stats
GET	/game/play?playerId=...&choice=...	Play a game round
GET	/leaderboard	Leaderboard by Wilson Score
```

## 🕹️ How to Play

Open http://localhost:4200

Create a player

Play Rock, Paper, Scissors

View the leaderboard

Press TAB (gamer shortcut)

Or click "View Leaderboard"

## 📁 Project Structure

```bash
rps-challengee/
├── backend/                   # Spring Boot backend
│   ├── src/main/java/
│   ├── src/main/resources/
│   └── pom.xml
├── frontend/                  # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/        # Reusable Angular components
│   │   │   ├── shared/
│   │   │   │   ├── interfaces/
│   │   │   │   ├── pipes/
│   │   │   │   └── services/
│   │   │   └── views/             # Feature-specific views/pages
│   │   └── ...
├── Dockerfile
├── nginx.conf
├── docker-entrypoint.sh
└── README.md
```

## 🔮 Future Enhancements

🔐 User Authentication

💾 Persistent Database (e.g., PostgreSQL)

📈 Grafana Dashboards

🧠 Smarter Computer AI

🏆 More Game Modes (Best of 3, Tournaments)

🎨 Custom Player Icons







