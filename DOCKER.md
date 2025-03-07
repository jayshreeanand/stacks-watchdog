# Running ETN Watchdog with Docker

If you're having issues with Node.js versions or MongoDB installation, you can use Docker to run the application in a containerized environment.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Option 1: Run Simple Server (No MongoDB)

This option runs a simplified version of the server that doesn't require MongoDB:

```bash
# Build and start the container
docker-compose -f docker-compose.simple.yml up -d

# View logs
docker-compose -f docker-compose.simple.yml logs -f
```

Access the API at http://localhost:3000

## Option 2: Run Full Application with MongoDB

This option runs the full application with MongoDB:

```bash
# Build and start the containers
docker-compose up -d

# View logs
docker-compose logs -f
```

Access the API at http://localhost:3000

## Stopping the Application

```bash
# For simple server
docker-compose -f docker-compose.simple.yml down

# For full application
docker-compose down
```

## Rebuilding After Changes

If you make changes to the code, you need to rebuild the Docker image:

```bash
# For simple server
docker-compose -f docker-compose.simple.yml build
docker-compose -f docker-compose.simple.yml up -d

# For full application
docker-compose build
docker-compose up -d
```

## Accessing MongoDB Data

If you're running the full application with MongoDB, you can access the MongoDB data using a MongoDB client like MongoDB Compass. Connect to:

```
mongodb://localhost:27017
```

## Troubleshooting

If you encounter any issues:

1. Check the logs: `docker-compose logs -f`
2. Restart the containers: `docker-compose restart`
3. Rebuild the containers: `docker-compose build --no-cache`
