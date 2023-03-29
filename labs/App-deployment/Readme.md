# Lab1 - use k8s primitives to implement a common deployment strategy 

a. create a deployment using the lbabay.azurecr.io/alpha:v1.0 image, the deployment should have a max surge of 50% and a max unavailable of 25%, expose the application through a service


b. perform a rolling update from the command line for the alpha service by updating the image to lbabay.azurecr.io/alpha:v1.1
``` k set image deployment/alpha-deploy alpha=lbabay.azurecr.io/alpha:v1.1 ```

c. perform a rolling update by editing the deployment back to the lbabay.azurecr.io/alpha:v1.0 image, add a change cause 
    - edit the existing manifest and apply the change 


d. view the rollout history for the deployment 
``` k rollout history deployment/alpha-deploy ``` 

e. roll back the deployment to the revision #2 
``` k rollout undo deployment/alpha-deploy --to-revision=2 ```

f. deploy the helm chart found in the helm folder called lbabay-mern, perform the following actions:
    - change the replicaCount for the frontend from 1 to 2 
    - upgrade the helm chart, verify that the deployment now has 2 containers in the pod 
    - rollback the helm deployment
    - uninstall the helm deployment

g. deploy the lab1g-starter. this will deploy a new app, we need to update the version from httpd:alpine to nginx:alpine, create another deployment called lab1g-v2, deploy the new deployment and make sure it is in a running state, once it's in a running state, change the service to point at the new deployment