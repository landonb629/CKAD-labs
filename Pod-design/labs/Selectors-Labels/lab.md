1. apply the configuration file in the called selector-test.yml
2. find the pods that have the tier of frontend
3. create a replicaset with the labels of tier = database


answers:
to find the pods with the tier of frontend
``` kubectl get pods --selector tier=frontend ```

check the final folder for the replicaSet with database selectors 
    - to view the pods that were created with that selector 
``` kubectl get pods --selector tier=database  ```
