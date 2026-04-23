# --- PRODUCTION_BUILD_V2.1 ---
# --- Stage 1: Build Stage ---
FROM maven:3.9-eclipse-temurin-21-alpine AS build

# Set build directory
WORKDIR /build

# 1. Copy pom.xml only to cache dependencies
COPY pom.xml .

# 2. Download dependencies
RUN mvn dependency:go-offline -B

# 3. Copy source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests -B

# --- Stage 2: Runtime Stage ---
FROM eclipse-temurin:21-jre-alpine

# Set deployment directory
WORKDIR /app

# 1. Create a non-root user
RUN addgroup -S prepedge && adduser -S prepedge -G prepedge

# 2. Copy the fat JAR from the build stage
COPY --from=build /build/target/*.jar app.jar

# 3. Set ownership
RUN chown -R prepedge:prepedge /app
USER prepedge

# 4. Environment adjustments for Railway
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"
ENV SPRING_PROFILES_ACTIVE=prod

# 5. Railway typically uses the PORT env var
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
