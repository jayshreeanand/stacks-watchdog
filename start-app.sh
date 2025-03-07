#!/bin/bash

# Start the backend server
echo "Starting backend server..."
node simple-server.js &
BACKEND_PID=$!

# Wait a moment for the backend to start
sleep 2

# Start the frontend
echo "Starting frontend..."
cd frontend && npm start

# When the frontend is stopped, also stop the backend
kill $BACKEND_PID 