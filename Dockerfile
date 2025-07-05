# Stage 1: Build the Java Spring Boot application
# Uses a Maven image with OpenJDK 17
FROM maven:3.8.5-openjdk-17 AS backend-build

# Set the working directory inside this build stage container
WORKDIR /app/backend

# Copy the Maven project files (pom.xml first for better caching)
# This uses the 'backend/' folder from your host machine
COPY backend/pom.xml .

# Copy the source code for the backend
# This copies the 'backend/src' folder from your host machine
COPY backend/src ./src

# Build the Spring Boot application
# 'mvn clean package' compiles, tests (skipped here), and packages your application into a JAR
# -DskipTests is used to speed up the Docker build; you should run tests separately in CI/CD
RUN mvn clean package -DskipTests

# --- Stage 2: Final Image - Combine JRE for backend and Nginx for frontend ---
# Uses a lightweight OpenJDK 17 Java Runtime Environment
FROM eclipse-temurin:17-jre-jammy

# Install Nginx:
# apt-get update: Updates the package list
# apt-get install -y nginx: Installs Nginx without asking for confirmation
# rm -rf /var/lib/apt/lists/*: Cleans up cached package lists to reduce image size
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Copy the custom Nginx configuration file
# This file will be placed where Nginx expects its default configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a dedicated directory inside the container for your Spring Boot app
WORKDIR /app

# Copy the built JAR file from the 'backend-build' stage
# This is the JAR created by 'mvn clean package'
# Make sure 'challenge-0.0.1-SNAPSHOT.jar' matches your actual JAR name
COPY --from=backend-build /app/backend/target/challenge-0.0.1-SNAPSHOT.jar app.jar

# Copy your static frontend files to Nginx's default web root
# This copies everything from your 'frontend/' directory on the host
COPY frontend/ /usr/share/nginx/html

# Expose the ports that your container will listen on:
# Port 80: For Nginx, serving your frontend
# Port 8080: For your Spring Boot application (for direct API calls or Prometheus scraping)
EXPOSE 80
EXPOSE 8080

# Define the command that runs when the container starts:
# 1. Start the Nginx service in the background
# 2. Then, run your Spring Boot application JAR
# This ensures both your frontend server and backend application are running
# CMD service nginx start && java -jar app.jar
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]