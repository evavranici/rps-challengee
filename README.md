Rock, Paper, Scissors Game
A full-stack Rock, Paper, Scissors game featuring a Spring Boot backend, an Angular frontend, an H2 Database, and Docker containerisation. This application includes players management, game logic, a leaderboard, and basic metrics/monitoring setup with Prometheus.

Table of Contents
Features

Technologies Used

Getting Started

Prerequisites

Backend Setup

Frontend Setup

Docker Setup

Running the Application

API Endpoints

How to Play

Project Structure

Future Enhancements

1. Features
Player Management: Create and reset player profiles.

Classic RPS Gameplay: Play Rock, Paper, Scissors against a computer opponent.

Dynamic Leaderboard: View top players ranked by their performance (Wilson Score Interval). It can also be accessed while in the game playground by pressing the TAB key (for an authentic gamer experience 🎮 ).

Responsive UI: Built with Angular and Tailwind CSS to enhance the gamer experience.

API Documentation: Comprehensive API documentation provided by Swagger/OpenAPI.

H2 Database Console: Web-based UI for inspecting the in-memory H2 database.

Application Metrics & Monitoring: The Spring Boot backend is instrumented with Micrometer to collect various application metrics, such as game round counts, player choices, API call durations, and system health. These metrics are automatically exposed via Spring Boot Actuator's /actuator/prometheus endpoint in a Prometheus-compatible format, allowing an external Prometheus server to scrape and store them. This setup provides insights into application performance and usage patterns.

Containerized Deployment: Docker setup for easy and consistent deployment of the entire application (backend + frontend).

Intelligent Caching: Frontend services use Angular Signals to cache players and leaderboard data, reducing redundant API calls.

2. Technologies Used
Backend:

Spring Boot: Framework for building robust Java applications.

Maven: Dependency management and build automation.

H2 Database: In-memory database for player and game data.

Spring Data JPA: For database interaction.

Spring Boot Actuator & Micrometer: For exposing application metrics.

Lombok: Annotations to effortlessly generate boilerplate code like getters/setters, making Java cleaner.

Swagger/OpenAPI: For API documentation.

Frontend:

Angular 20+: Frontend framework for building dynamic single-page applications.

TypeScript: Superset of JavaScript for type safety.

Tailwind CSS: Utility-first CSS framework for rapid UI development.

Angular Signals: For reactive state management and efficient change detection.

Containerization & Monitoring:

Docker: For containerizing the entire application.

Prometheus: (External) For monitoring application metrics.

3. Getting Started
Follow these instructions to get a copy of the project up and running on your local machine.

Prerequisites
Before you begin, ensure you have the following installed:

Java Development Kit (JDK) 17+

Maven 3.8.5+

Node.js 18+ & npm 8+ (or Yarn)

Angular CLI 17+ (npm install -g @angular/cli)

Docker Desktop - Ensure it's running before proceeding with Docker commands.

Git

Backend Setup
Navigate to the backend directory:

cd rps-challengee/backend
Build the Spring Boot application:

mvn clean install
This will compile the Java code and package it into a .jar file in the target/ directory.

Frontend Setup
Navigate to the frontend directory:

cd rps-challengee/frontend
Install frontend dependencies:

npm install
Build the Angular application:

npm run build
This will compile the Angular code and place the static assets in the dist/ directory. These assets will be served by Nginx inside the Docker container.

Docker Setup
Ensure you are in the root directory of the rps-challengee project (where Dockerfile and nginx.conf are located).

Build the Docker image:
This command will build a multi-stage Docker image that first compiles the backend, then packages both the backend JAR and the frontend static files with Nginx.

docker build --no-cache -t rps-challengee .
Troubleshooting Dockerfile issues: If you encounter errors like unknown instruction: {\rtf1...} or FROM requires either one or three arguments, ensure your Dockerfile and nginx.conf are plain text files (not RTF) and that comments are on their own lines.

Running the Application
Run the Docker container:
This command starts the container, mapping port 80 (for Nginx/frontend) and port 8080 (for Spring Boot backend/metrics) from the container to your host machine.

docker run -p 80:80 -p 8080:8080 --name my-rps-app rps-challengee

Conflict error: If you get a Conflict error, it means a container with that name already exists. Stop and remove it:

docker stop my-rps-app
docker rm my-rps-app

Then, retry the docker run command.

Container Exits Immediately: If docker ps shows no running containers after docker run, it means the container started and then exited. This was addressed by using a docker-entrypoint.sh script to manage both Nginx and Java processes. Ensure your Dockerfile and docker-entrypoint.sh are correctly configured as per our previous discussions.

Access the Application:

Frontend: Open your web browser and navigate to:
http://localhost:4200

Backend Metrics (for Prometheus):
http://localhost:8080/actuator/prometheus

H2 Database Console:
http://localhost:8080/h2-ui

JDBC URL: jdbc:h2:~/test

User/Password: sa/myverystrongpassword

Swagger/OpenAPI UI:
http://localhost:8080/swagger-ui

Access Prometheus UI (if running separately):
If you have a separate Prometheus server running (e.g., via Homebrew or another Docker container), its UI is usually at:
http://localhost:9090
Ensure your Prometheus prometheus.yml is configured to scrape host.docker.internal:8080 for your rps-challengee backend metrics.

4. API Endpoints
The backend exposes the following primary API endpoints:

GET /player: Retrieves a summary list of all registered players (id, name, icon).

POST /player: Creates a new player.

POST /player/reset/{playerId}: Resets a player's game statistics.

GET /game/play: Initiates a game round (requires player choice and player ID).

GET /leaderboard: Retrieves the leaderboard statistics (ranked by Wilson Score Interval).

/actuator/prometheus: Exposes Prometheus-compatible metrics for the Spring Boot application.

/swagger-ui.html (or /swagger-ui/index.html): The interactive Swagger/OpenAPI documentation UI.

5. How to Play
Access the game at http://localhost:4200

Create a Player: If you don't have a player, use the "Create Player" option to set up your profile.

Start Game: Select your player and begin playing Rock, Paper, Scissors against the computer.

View Leaderboard: Press the TAB key (or click a "View Leaderboard" button if available) to open the leaderboard popup. You can also navigate directly to the leaderboard view if your routing supports it.

6. Project Structure
rps-challengee/
├── backend/
│   ├── src/main/java/...       # Spring Boot Java source code
│   ├── src/main/resources/     # Spring Boot configuration (application.properties/yml)
│   ├── pom.xml                 # Maven build file
│   └── ...
├── frontend/
│   ├── src/app/...             # Angular application source code
│   ├── src/assets/...          # Frontend assets
│   ├── src/index.html          # Angular main HTML
│   ├── angular.json            # Angular project configuration
│   ├── package.json            # Frontend dependencies
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── ...
├── Dockerfile                  # Defines the Docker image build process
├── nginx.conf                  # Nginx configuration for serving frontend and proxying backend
├── docker-entrypoint.sh        # Script to manage multiple processes in Docker container
└── README.md                   # This file

7. Future Enhancements
User Authentication: Implement proper user login/registration.

Persistent Database: Configure H2 to save data to a file, or migrate to a production-grade database (e.g., PostgreSQL, MySQL).

Grafana Dashboards: Create rich dashboards in Grafana to visualize game metrics from Prometheus.

Improved Computer AI: Implement more sophisticated AI for the computer opponent.

More Game Modes: Add best-of-three, tournaments, etc.

Custom Player Icons: Allow users to upload or select custom icons.