# CKAD area - Application Design and Build 


#  utilize persistent and ephemeral volumes 

##  Volumes 
- Component of a pod, they are defined in the pods spec just like containers. 
- available to all containers in the pod, but must be mounted 
- you need to define a volume, and then in the pod you need to define a volumeMount
- enables safe container restart



##  PersistentVolumes
- pool of pre-provisioned storage resources in a cluster, lifecycle is separate from a pod 
- enables safe pod termination or restart



##  PersistentVolumeClaims
- process of storage requests from PVs by the user in k8s 
- users request for storage and resources 
- allows a pod to claim a persistent volume and store data on it
- persistent volume claims can be mounted inside deployments, and pods


## Relationship between PV and PVC
- Persistent volumes are setup, and then a persistent volume claim is made (unless using a different storageClass that supports dynamic provisioning)

## When using a cluster
- you should use NFS storage or shared storage
- this is because all the pods will have access to the same data no matter what theyre on 


## Labs for persisting storage 
1. you will need to create a multi container pod. a volume called html-volume. create a pod called volume-demo. create a container in the pod using the nginx image called html-host and map the html-volume to var/www/html. create another container in the pod using the ubuntu image called html-source map the log volume to /tmp/.
  - exec into the html-source container and create a test html file (touch index.html)
  - exec into the html-host container and check if the file exists
  - if the file exists, you are done 

2. create a persistent volume called pv0001 of size 200Mi, mapped to the host location /data, create a persistent volume claim of 5Mi, make it RWX, map the PVC to /tmp/test in the pod
  - in order for this to work on minikube, you must first create a storage class called manual


# Understand multi-container Pod design patterns 

- pods should optimally have only one container, there are some design patterns that require multiple containers per pod

When should you use multiple containers per pod?
- when both containers have the same lifecycle 
- allows for simple communication between containers, they can reference eachother by localhost

Multicontainer design patterns
- sidecar: used for logging utility, sync services, watchers, and monitoring agents
- adapter: standardize application output for monitoring or aggregation
- ambassador: connect container to the outside world, could be a proxy container
