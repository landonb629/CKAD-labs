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

# RepicaSets and Replication Controller  
- replication controller: run multiple instances of a pod, allowing us to achieve high availability
    - can be used with a single pod, replication controller will bring up a new pod if your existing pod failed
    - ensures that specified number of pods is running at all times 

  - load balancing and scaling: replication controller will span multiple nodes in a cluster, helps to scale the application when demand increases

Replication Controller vs Replica Set
- Replication controller is the legacy method for setting up replicas, all replicas should be created with the replica set

## creating replicationControllers
How do you create a replication controller?
- create a new definiton file
    - the definition file will look as following 
    ``` 
    apiVersion: v1 //replicationControllers use the v1 api version
    kind: ReplicationController
    metadata: 
      name:
      labels:
        test: test
    
    spec: // this is where it gets different, we add a "template" for what container the controller needs to use 
      template: //we need to move EVERYTHING from the pod definition file we created besides the apiVersion and kind
        metadata:
          name: nginx
          type: front-end
        spec:
          containers:
            - name: nginx
              image: nginx
      replicas: 3 //this is a child of spec, so template and replicas needs to be on the same line
    ```

    - commands for interacting with the replication controller 
    ```
    //deploy
    kubectl apply -f rc-definition.yml 

    //get replication controllers 
    kubectl get replicationControllers

    //delete replication controllers
    kubectl delete replicationControllers $controllerName

    ```

    ## Creating ReplicaSets
    -  replicaSets bring in labels and selectors.
```
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: frontend
  labels:
    tier: frontend

spec:
  replicas: 4
  selectors:
    matchLabels:
      tier: frontend
  template:
    spec:
      metadata: 
        name: frontend
        labels:
          tier: frontend
      containers:
        - name: nginx
          image: nginx 
```

## Deployments
Deployments are a kubernetes object that comes higher than the replica sets or replication controllers. a deployment will automatically create a replica set

You can create a deployment using a definition file. 
```
apiVersion: apps/v1
kind: deployment
metadata:
  name:
  labels:

spec: 


```
- a deployment will create a new replica set, as well as pods. to see all the resources created, we need to run 

```
kubectl get all
```

- Rolling updates: updating each instance one by one, only taking on container offline at a time 


## Namespaces
- the default namespace is created and used at first when kubernetes is first setup
- namespaces are a way to run logically separate k8's containers in different environments on the same cluster
- each namespace will have its own policies and resource limits 

How to reference a container that is in another cluster
```
db-service.dev.svc.cluster.local
#this is how you would access something in the dev cluster
```
- cluster.local is the default domain name of the k8s cluster

How to create a pod in a non default namespace?
```
kubectl apply -f deployment.yml --namespace=dev
```
- you can also add the namespace to the pod definition file under metadata
```
apiVersion: v1
kind: Pod
metadata:
  name: frontend
  namespace: dev
```

How do you create a new namespace? 
- use a namespace definition file 
- running the k8s command for it 
```
kubectl create namespace dev
```

How do you limit the resources that a namespace can use?
- creating a resource quota