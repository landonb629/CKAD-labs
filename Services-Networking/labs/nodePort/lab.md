1. build the dockerfile in the app directory
2. create a pod definition file for that application
3. create a nodeport service that exposes that pod 
4. access the application in your browser



note about minikube: 
  - minikube will not expose the port on the target port that you specify 
  - to find the port that the service is running on 
``` minikube service <servicename> --url ```