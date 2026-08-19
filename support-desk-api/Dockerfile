FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /workspace

# Copy the pom.xml and download the dependencies
COPY pom.xml ./
RUN mvn -B -DskipTests dependency:go-offline

# Copy the source code and build the application
COPY src ./src
RUN mvn -B clean package -DskipTests

# Copy exactly one executable JAR to a predictable filename
# Exclude original -*sources.jar and -*javadoc.jar files
RUN JAR_FILE=$(find target -maxdepth 1 -type f -name "*.jar" ! -name "*original.jar" ! -name "*-javadoc.jar" | head -n 1) \
    && echo "Using JAR file: ${JAR_FILE}" \
    && cp "${JAR_FILE}" /workspace/app.jar

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Safe defaults only. Real secrets (Mongo credentials, JWT secret) are
# supplied at "docker run" time via --env-file, never baked into the image.
ENV SERVER_PORT=8080
ENV JAVA_OPTS=""

COPY --from=build /workspace/app.jar app.jar

EXPOSE 8080

# /api/health
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:8080/api/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
