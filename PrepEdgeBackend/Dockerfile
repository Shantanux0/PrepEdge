# Use a lightweight Java 21 image
FROM openjdk:21-jdk-slim

# Set a working directory inside the container
WORKDIR /app

# Copy the compiled JAR file from the target directory to the container
COPY target/*.jar app.jar

# Tell the container to listen on the port specified by the PORT environment variable, defaulting to 8080
EXPOSE 8080

# The command to run when the container starts
ENTRYPOINT ["java","-jar","app.jar"]