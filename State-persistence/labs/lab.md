1. create a pod with the ubuntu image and mount /var/log/syslog to /logs
2. create a persistent volume that is mapped to the host path of /tmp: access modes: readonlymany, storage: 50Mi
3. create a persistent volume claim: access modes: readwriteonce, storage: 25Mi

- check the persistent volume claim status? 
    - should show as pending 
        - this is because the access modes are different

4. change the access mode in the claim to match the volume

- check the persistent volume claim status now 

5. map the volume claim to the pod and redeploy the pod 
6. delete the persistent volume claim 
    - check the status of the volume claim 
        - should be terminating, it will stay this way until we delete the pod that is using the claim

7. delete the pod 

    - check the status of the volume claim again
        - it should be deleted