# 🎮 Rock, Paper, Scissors Game

A full-stack **Rock, Paper, Scissors** game featuring a **Spring Boot** backend, an **Angular** frontend, an **H2 Database**, and **Docker** containerization.

Includes **players management**, **game logic**, a **leaderboard**, and **monitoring setup** with Prometheus.

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
- **Keyboard Shortcut**: Press **`TAB`** to view the leaderboard while playing, a touch to the classic gaming.
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
- [Lombok](https://projectlombok.org/) for auto generated Getters/Setters
- [Swagger/OpenAPI](https://swagger.io/)

### 🎨 Frontend

- [Angular 20+](https://angular.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

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
- [Prometheus](https://prometheus.io/)
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

🎮 Frontend	                | http://localhost:4200

📊 Actuator Metrics	        | http://localhost:8080/actuator/metrics

Check one specific metrics:
- Nr. of all players created: http://localhost:8080/actuator/metrics/player.created.total
- Nr. of all games played: http://localhost:8080/actuator/metrics/player.stats.updated.total
- Nr. of total resets by players: http://localhost:8080/actuator/metrics/player.stats.reset.total

📊 Metrics for Prometheus	  | http://localhost:8080/actuator/prometheus

🛢️ H2 Console	              | http://localhost:8080/h2-ui

🧾 Swagger UI	              | http://localhost:8080/swagger-ui/index.html

```bash
H2 Console Settings:

JDBC URL: jdbc:h2:mem:rps_db
User: rps
Password: myverystrongpassword
```

📍 Prometheus UI (if running separately)
```bash
brew services start prometheus
```
and then access it at: http://localhost:9090


## 📐 UI/UX Design
This project includes a Figma file for the color palette of the reusable button UI component.

Figma Link: [RPS Figma Design](https://www.figma.com/design/QUTgI6n68WYZdcKe7c2kzd/RPS-Figma?node-id=0-1&m=dev&t=b0azLlaDYP928T2r-1).

This design helps maintain UI consistency and can be extended for future visual enhancements.

## 📡 API Endpoints

```bash
GET	/api/players	List all players
POST /api/players	Create a new player
GET	/api/players/{id}	A player by id
GET	/api/players/leaderboard-stats	Leaderboard by Wilson Score
PUT	/api/players{id}/stats Update a player's stats from a game round
PUT	/api/players/{id}/reset-stats	Reset a player's stats
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
├── backend/                           # Spring Boot backend
│   ├── src/main/java/
│   │   ├── com/interview/challenge/
│   │   │   ├── config/               # configures CORS to allow requests from frontend (http://localhost:4200/api)
│   │   │   ├── dto/                  # holds dto-s: LeaderboardPlayerStatsDto.java & PlayerSimplifiedDto.java
│   │   │   ├── player/               # holds everything related to Player: PlayerEntity, PlayerController, PlayerRepository, PlayerService
│   │   │   │   ├── stats/            # holds everything related to PlayerStats: PlayerStats.java, GameChoice enum
│   │   │   ├── shared/               # GameChoiceConverter.java
│   ├── src/main/resources/
│   │   ├── application.properties/   # configurations for server, database h2, swagger openai, actuator, prometheus
│   └── pom.xml                       # all the dependancies
├── frontend/                      # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/               # files generated from npm run generate-api  
│   │   │   ├── components/        # Reusable Angular components
│   │   │   ├── shared/
│   │   │   │   ├── interfaces/
│   │   │   │   ├── pipes/
│   │   │   │   └── services/
│   │   │   └── store/             # ngrx store
│   │   │   └── views/             # Feature-specific views/pages
│   │   └── assets
│   │   │   ├── api-docs.json/               # json copied from openapi (http://localhost:8080/api-docs)
│   │   └── ...
├── docker-entrypoint.sh
├── Dockerfile
├── nginx.conf
├── prometheus.yml
└── README.md
```

## 🔮 Future Enhancements

🔐 User Login & User Delete

💾 Persistent Database (e.g., PostgreSQL)

🧠 Smarter Computer AI

🏆 More Game Modes (Best of 3, Tournaments)

🎛️ Introduce Toogle for mode switching (with/without 'Well')

📱 Make UI Mobile friendly

🎨 Custom Player Icons

📈 Grafana Dashboards

🔤 Handle translations







