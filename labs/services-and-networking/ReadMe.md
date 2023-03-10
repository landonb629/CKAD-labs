# Lab 1 

a. create two ubuntu pods, create a deny all ingress and egress network policy, exec into the pods and make sure that they are unable to ping each other, create the proper network policies to allow the ubuntu pods to ping each other 

b. create an nginx pod, create a ClusterIp service that exposes the pod on port 3000

c. create a nodeport service for the image lbabay.azurecr.io/alpha:v1.0, create the nodeport 30005, the port and target port should be 3000, use the following command to view your service
    ``` minikube service $servicename --url ```