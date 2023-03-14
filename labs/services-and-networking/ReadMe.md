# Lab 1 

a. create two ubuntu pods, create a deny all ingress and egress network policy, exec into the pods and make sure that they are unable to ping each other, create the proper network policies to allow the ubuntu pods to ping each other 

b. create an nginx pod, create a ClusterIp service that exposes the pod on port 3000

c. create a nodeport service for the image lbabay.azurecr.io/alpha:v1.0, create the nodeport 30005, the port and target port should be 3000, use the following command to view your service
    ``` minikube service $servicename --url ```

d. create a deployment with 1 replica using the mongodb image and expose it to the cluster with a service that uses ClusterIP, use the image lbabay.azurecr.io/backend:v1.0 create another deployment, pass the IP address of the mongoDB service as an environment variable to the backend deployment. to get the correct iP address to put in the backend manifest, look at the service that you created for the database


e. add the ingress addon to your minikube cluster. using the two images, lbabay.azurecr.io/alpha:v1.0 and lbabay.azurecr.io/bravo:v1.0, create an ingress rule to route any requests for /alpha to an alpha deployment, and route any requests for /bravo to a bravo deployment