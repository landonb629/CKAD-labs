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

