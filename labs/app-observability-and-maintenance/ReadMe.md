# Application Observability and Maintenance Labs 

a. create a deployment using the lbabay.azurecr.io/simple-backend:v1.1 image, create a service to expose that deployment of type NodePort. add an HTTP liveness probe that checks the /healthcheck path, configure an initial delay of 15 seconds, and check that path every 5 seconds
    - shortly after the first deployment, you should see your application start to go into a restart loop, run the describe command on one of the pods in your deployment, you should see that the liveness probe is failing 
    - deploy the db.yml file 
    - run the following command ``` k get pods --watch ``` 
    - you should see the application stabilize and stop restarting because now the liveness probe is succeeding