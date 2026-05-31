# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and download dependencies first (this utilizes Docker layer caching for faster builds)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy src and build the package
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the built jar file from the build stage
COPY --from=build /app/target/healthCare_backend-0.0.1-SNAPSHOT.jar app.jar

# Expose standard container port
EXPOSE 8081

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
