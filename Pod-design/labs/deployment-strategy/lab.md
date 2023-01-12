1. create a deployment with the rolling update strategy 
    - create a desired value of 5 pods 
    - set a maxSurge of 7 
    - set a maxUnavailble of 2
2. update the image with the ``` kubectl set image ``` command 
3. view the status of the rolling update 
4. annotate the rollout with a change-cause of "setting image to nginx:1.23.3"
4. view the history of the rolling update 



additional fields to add: 
  - maxUnavailable: max number of pods that can be unavailable during the update process, can be a number or a percentage
  - maxSurge: max number of pods that can be created over the desired number of pods, of this is set to 50%, it means that during the update there may be 150% of desired pods at one time 
  - strategy: this is how you can specify the RollingUpdate or Recreate, recreate will destroy one replicaSet before bringing up another replicaSet 


How to view the status of the rolling update:
``` kubectl rollout status deployment/webapp-deployment ``` 

how to annotate the change-cause 
``` kubectl annotate deployment/webapp-deployment kubernetes.io/change-cause="setting image to nginx:1.23.3" ```

How to view the history of the rolling update 
``` kubectl rollout history deployment/webapp-deployment ```


