use the react application in this directory 
    - create a file in a certain directory, remove the file with a script to crash the application 

1. create a service that consists of two instances of this application 
2. create an init container using the busy box image of 15 seconds 
3. create a readiness probe on one of the PODS (see if you are able to get to the apps uninterrupted)
4. create a liveness probe to to look for a specific file 