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



