#!/bin/bash

# Start Nginx in the foreground
nginx -g "daemon off;" &

# Start the Java application in the foreground
java -jar /app/app.jar