# Core concepts in Kubernetes 

Labs:
- Creating an nginx pod (Directory: PODS)

## Architecture 
- Nodes: this is the infrastructure that will run our kubernetes clusters. ex: virtual machines that have k8s installed and configured
- cluster: set of nodes running together. if you didn't have a cluster and one of your nodes failed, your application would be down.
- master: the nodes that controls the rest of the cluster 


## Master vs Worker 
- worker: infrastructure where containers are deployed, these have the kube agent running 
- master: where the kube api server is held, this communicates with the kube agent on the worker nodes



## PODS
- when we start talking about PODS, there are two things that are assumed: 
    1. the application is developed, built into a docker image, and available in a docker repository 
    2. the k8s cluster is up and running 

A pod has a one-to-one relationship with containers. if you need to scale your application, dont't add containers to the POD, add PODS.


## how do we deploy ~things~ in k8s?
This is where YAML comes into the equation, you use YAML files that will declare what a POD (and other things) should have.

There are 4 top level, required fields in a k8s file 
```
apiVersion: //version of the k8s api, can have varying values 
kind: //type of object that we want to create
metadata: // data about the object. ex: its name, and labels
  name: 
  labels: 
    app: nginx
    type: frontend


spec: //provide your additional information about the application you are trying to deploy
  containers: //This is a list object 
    - name: nginx //this needs a - because that tells that this is the first item in the list
      image: nginx

```

apiVersion - can be a multitiude of different values, this depends on what you are deploying 
LEGEND: Kind = Version 
    - POD = v1
    - Service = v1
    - ReplicaSet = apps/v1
    - Deployment = apps/v1


### basic commands to interact with pods

- How to see what pods are running 

```
kubectl get pods

```

- How to get information about a specific pod 
```
kubectl describe pod $PODNAME

```