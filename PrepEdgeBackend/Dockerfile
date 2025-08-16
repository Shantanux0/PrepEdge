# --- Build Stage ---
# Use a valid and official Maven image that includes JDK 21
FROM maven:3.9-eclipse-temurin-21 AS build

# Set the working directory
WORKDIR /app

# Copy the pom.xml and the source code
COPY pom.xml .
COPY src ./src

# Build the application and create the executable JAR file
RUN mvn clean package -DskipTests

# --- Final Stage ---
# Use a lightweight Java 21 image for the final container
FROM openjdk:21-jdk-slim

# Set a working directory inside the container
WORKDIR /app

# Copy the compiled JAR file from the 'build' stage
COPY --from=build /app/target/*.jar app.jar

# Tell the container to listen on port 8080
EXPOSE 8080

# The command to run when the container starts
ENTRYPOINT ["java","-jar","app.jar"]
