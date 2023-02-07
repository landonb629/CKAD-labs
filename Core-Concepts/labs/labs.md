## pod lab 
1. build the dockerfile that is in this directory 
2. create a pod and run the pod 

## blue / green deployment lab 
1. create a deployment with the application that is in this directory 
2. create a service for the application 
3. update the class called background-color and create a v2 
4. create a deployment for the v2 of the application
5. update the service to use the label of the second version


## Canary deployment lab
- use the same steps as above to create 2 deployments, one with a new version, one with an old version of the application
1. instead of updating the service to route traffic to one deployment, create a common label that the service uses to route to both
2. make sure that less then 50% of traffic is going to the v2 deployment
3. verify they are both receiving traffic 
4. scale the inital deployment to 0, scale the v2 deployment to 3 replicas
