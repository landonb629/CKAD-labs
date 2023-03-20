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

f. create a helm chart for the application 