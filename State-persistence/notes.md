# State Persistence

## volumes in Kubernetes 
- pod containers are ephemeral, this means that any data that is saved to the pod during its lifetime, will be deleted when it dies

Volumes are used to solve that problem
    - volumes specify a directory on the host to save data from a specific pod 
    - these volumes can be attached to the pod, so that the data will persist

to mount a volume: 
  - use the volumeMounts object
  - you must also create the volume in the manifest
  - the hostPath option tells kubernetes where to store the volume on the host machine 

This is not recommended for a multinode cluster, all the nodes would have different volumes in their /data directory

```
apiVersion: v1
kind: Pod 
metadata:
  name: persist

spec:
  containers:
    - name: persist
      image: ubuntu
      command: ["touch", "test.txt"]
      volumeMounts:
      - mountPath: /opt
        name: data-volume
    
  volumes:
  - name: data-volume
    hostPath:
      path: /data
      type: Directory

```

## Persistent volumes 
- cluster wide pool of storage volumes 
- pods can pull storage from this pool using persistent storage claims

api object: PersistentVolume
  configuration: 
    - accessModes: specifies how the storage should be mounted on the host 
        - ReadOnlyMany
        - ReadWriteOnce
        - ReadWriteMany 
    - capacity: the amount of storage that is reserved for this volume
        - storage: ex - 1Gi
    - hostPath:
        path:

Different access modes 
- ReadWriteOnce: volume can be mounted as read write by a single node 
- ReadOnlyMany: volume can be mounted as read only by many
- ReadWriteMany: volume can be mounted as read write for many nodes 


```
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv

spec:
  accessModes: 
    - ReadWriteOnce
  capacity:
    storage: 1Gi
  hostPath:
    path: /data
```

## Persistent volume claims
- makes the storage available to the nodes 
- persistent volumes and persistent volume claims are two different objects in k8s 

admins create persistent volumes
users create persistent volume claims 

Binding 
- persistent volume claims are bound to persistent volumes 
- you can specifically choose your volumes with labels and selectors 

1 to 1 relationship with claims and volumes, if your claim only takes up some of the volume, no other claim can fill the remaining space on that volume 
NOTE: you can map the persistent volume claim to multiple containers though

persistent volume claim 
- accessMode: tells what mode to mount the volume as
- resources: type of resource that we are creating 
    requests: 
      storage: how much storage to make a request for
- persistentVolumeReclaimPolicy:
    - default = retain: keep the volume but no other claims can use it 
    - delete: delete the volume once the claim has been deleted 
    - recycle: delete the data from the volume and make it available for other claims to use 

```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: claim

spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 500Mi

```

Deleting persistent volume claims 
- you choose what happens to the volume once you have deleted the claim
  by default: the persistent volume will be retained, it is not available for reuse 


How to use a persistent volume claim inside of a POD 
- under the volumes api object, you can use the persistentVolumeClaim: option with claimName:

```
volumes:
  - name: pvc
    persistentVolumeClaim:
      claimName: claimName
```


## Storage Classes

Dynamic provisioning of volumes 
- you don't need to create a persistent volume because you can ues provisioners 
- when you create a persistent volume claim, ,the provisioner will automatically create the volume for you


you do this by create a storage class definition

```
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: google-storage
provisioner: kubernetest.io/gce-pd
```

- add the storageClassName to the PVC definition and it will know to use the storage class


## StatefulSets 
- similar to a deployment, few differences
- pods are created in a sequential order 
- unique ordinal index to each pod, each pod gets a unique name (no random names) it will be the name of the set plus -0 (this increments)
- names are the same even if the pod crashes


### Configuration of stateful sets 
- configured the same as deployments, just change the kind to StatefulSet
- you must add the name of a headless service
- you can override to remove the stateful set ordered approach


after you deploy:
- ordered, graceful pod deployment
- stable, unique network DNS name 


## Headless Service

what does a headless service do?
- gives us a way to reach into a specific pod without having to have the service do load balancing 
- for headless services no cluster IP is allocated 
- just created DNS entries for each pod 
example headless service dns entry: ``` podname.headless-servicename.namespace.svc.cluster-domain ``` 


How do you create a headless service?

```
apiVersion: v1
kind: Service
metadata:
  name: mysql-h
spec:
  ports:
    - port: 3306
  selector:
    app: mysql
  clusterIp: None
```


How do you associate a headless service with pods?
- the subdomain field below spec, must be the same name as the headless service
- you must also specify the hostname option, this is what creates the DNS record 


## Storage in StatefulSets 
- if you did a persistent volume claim in the StateFulSet, all of the pods would share the claim, that is not always the intended outcome. 

So how do we make sure that each pod will get its own claim?
- persistent volume claim template, This is something that gets added on to the pod configuration 
- its an array so you can specify multiple templates 

what if a pod fails?
- if the pod fails and comes back up, the statefulset will make sure that the pod gets attached to the same PV

StatefulSet definition file 
``` 
apiVersion: apps/v1
kind: StatefulSet
metadata: 
  name: mysql
  labels:
    app: mysql

spec:
  replicas: 3
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql
        volumeMounts:
        - mountPath: /var/lib/mysql
          name: data-volume
  volumeClaimTemplates:
  - metadata:
      name: data-volume
    spec:
      accessModes: 
        - ReadWriteOnce
    storageClassName: google-storage
    resources:
      requests:
        storage: 500Mi
```




# Conclusion 

Topics covered 
- using volumes in kubernetes 
- persistent volumes
- persistent volume claims
- storage classes 
- stateful sets: deployment and scaling of pods, ensures ordering and uniqueness of these pods, statefulsets require a headless service to be created
    - useful for applications where you need unique network identifiers, persistent storage, graceful and ordered deployment and scaling 
- headless services: deploys a service without load balancing and a single IP address
- how to handle storage in stateful sets


Labs to create 

1. create an ubuntu container with a volume mounted to the /opt directory, create a file in that directory, destroy the pod, recreate the pod with another pod, attach the volume and see if your file persisted
2. create a Persistent volume and inspect the volume, create a pod with a persistent volume claim, check the volume status, remove your pod, remove your persistent volume 
3. create a stateful set for an nginx container, with a headless service, that has a persistent volume claim for each pod 