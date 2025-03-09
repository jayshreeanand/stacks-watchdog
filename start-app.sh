#!/bin/bash

# Parse command line arguments
DATA_SOURCE="mock"  # Default to mock data

while [[ "$#" -gt 0 ]]; do
  case $1 in
    --testnet) DATA_SOURCE="testnet"; shift ;;
    --mainnet) DATA_SOURCE="mainnet"; shift ;;
    --mock) DATA_SOURCE="mock"; shift ;;
    *) echo "Unknown parameter: $1"; exit 1 ;;
  esac
done

# Set environment variables based on data source
if [ "$DATA_SOURCE" = "testnet" ]; then
  echo "Starting with Electroneum Testnet data..."
  export ETN_WATCHDOG_DATA_SOURCE="testnet"
  # Use the testnet configuration
  npm run switch:testnet
elif [ "$DATA_SOURCE" = "mainnet" ]; then
  echo "Starting with Electroneum Mainnet data..."
  export ETN_WATCHDOG_DATA_SOURCE="mainnet"
  # Use the mainnet configuration
  npm run switch:mainnet
else
  echo "Starting with Mock data..."
  export ETN_WATCHDOG_DATA_SOURCE="mock"
  # No need to switch network for mock data
fi

# Start the backend server
echo "Starting backend server..."
if [ "$DATA_SOURCE" = "mock" ]; then
  # Use simple server for mock data
  node simple-server.js &
else
  # Use full server for real data
  node src/index.js &
fi
BACKEND_PID=$!

# Wait a moment for the backend to start
sleep 2

# Start the frontend
echo "Starting frontend..."
cd frontend && npm start

# When the frontend is stopped, also stop the backend
kill $BACKEND_PID 