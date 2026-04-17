# --- Stage 1: Build Stage ---
FROM maven:3.9-eclipse-temurin-21-slim AS build

# Set build directory
WORKDIR /build

# 1. Copy pom.xml only to cache dependencies
COPY pom.xml .

# 2. Download dependencies (this layer will be cached unless pom.xml changes)
RUN mvn dependency:go-offline -B

# 3. Copy source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests -B

# --- Stage 2: Runtime Stage ---
FROM eclipse-temurin:21-jre-alpine

# Set deployment directory
WORKDIR /app

# 1. Create a non-root user for security
RUN addgroup -S prepedge && adduser -S prepedge -G prepedge

# 2. Copy the fat JAR from the build stage
COPY --from=build /build/target/*.jar app.jar

# 3. Set ownership to the non-root user
RUN chown -R prepedge:prepedge /app
USER prepedge

# 4. Standard Spring Boot environment variables
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"
ENV SPRING_PROFILES_ACTIVE=prod

# 5. Expose the server port
EXPOSE 8080

# 6. Optimized entry point with memory management
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
