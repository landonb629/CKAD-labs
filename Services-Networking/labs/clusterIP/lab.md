1. create a deployment for the nginx image with 2 replicas
2. view the IP addresses of each pod in the deployment
3. use the busy.yml and deploy the pod
    - connect to the pod with ``` kubectl exec utility -i -t -- /bin/bash ```
    - curl the pod ip addresses and see what you get as a response 
4. create a service for the deployment of type clusterIP
5. use the utility pod to curl the IP address of the clusterIP 
    - you will be able to curl the nginx pods from that one single IP address