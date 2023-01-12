# POD Design 

# Labels, Selectors & Annotations 
- Labels: key value pairs that are attached to objects. they are intended to help identify the objects 
- k8s uses labels and selectors to connect objects together


How do you add labels?
```
apiVersion: v1
kind: Pod
metadata:
  name: simple-webapp
  labels:
    app: App1
    function: Front-end 
```

How to select a pod with a specific label 
``` kubectl get pods --selector app=App1 ```


Places that we use labels?
- ReplicaSets
    - the first labels are given to the replicaSet 
    - the second labels are given to the pods inside the repliaSet
    - we want the replicaSet to discover the pods 
    
    The selector field:
        - this field is how the replicaSet will create the pods 

- Service 
    - this works the same way as the replicaSets
```
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: web-app
  labels: // these are the labels that the replicaSet will get
    app: app1
    environment: dev 
    function: frontend

spec:
  replicas: 3
  selector:
    matchLabels:
      app: App1
  template:
    metadata:
      labels: // these are the labels that the pod gets
        app: App1
        function: frontend
    spec:
      containers:
        - name: simple-app
          image: nginx
```


## Annotations 
- attach arbitrary non-identifying metadata to objects 
- annotations are not used to identify and select objects. the metadata in an annotation can be small or large, structured or unstructured and can include characters not permitted by labels 


How to add an annotation 

```
apiVersion: v1
kind: Pod 
metadata:
  name: test-pod
  annotations:
    imageregistry: "https://test.ecr.com"
```



## Rolling updates and Rollbacks 
- rollouts and versioning 
    - when you create a deployment, it creates a rollout which will create a new deployment revision
    - when you upgrade the app, a new rollout gets triggered, that will update the revision version 

Rollout commands 

- shows you the status of your rollout 
``` kubectl rollout status deployment/mydeployment```

- how to view the history of your rollouts 
``` kubectl rollout history deployment/mydeployment ```


Deployment strategies 

- recreate strategy: destroy all current app versions, bring up the new app version. This will cause downtime, this is not the default method of deployment
- rolling update: default deployment strategy, takes down the old version, then brings up the new version one by one 

How to apply changes to a deployment?
- using kubectl apply 
- use kubectl set image to update the image of the application, when you use this method, the definition file will have a different image then the deployed version (be aware of that)


How is an upgrade performed?
- when you create a replicaSet, that initial set of pods is deployed
- once you deploy an update, a new replicaSet is deployed and the rolling update begins to create pods in the new repliaSet, while also remove the pods in the old replicaSet


Rollback
- when there is something wrong with your application, you can use the rollout undo command to go to a previous version
``` kubectl rollout undo deployment/mydeployment ```
 

## Jobs 
- job: used to run a specific number of containers to run a task until completion 

flags that can be set:
- completions: tells how many times the pod should run the container
- parallelism: attempts to run all the containers at the same time 

creating a job definition file: 
```
apiVersion: batch/v1
kind: Job
metadata:
  name: batchProcess

spec: 
  template:
    spec:
      containers:
        - name: math
          image: ubuntu
          command: ["add"]
      restartPolicy: Never
```

What if you want to run the batch process multiple times?
- you can use the element: completions 
```
spec:
  completions: 3
  template:
    spec:
      containers:
       ...
```

What if one of the pods fail?
- the pod will run as many containers as it takes until you reach the designated number of completions

How to view the standard output of a container:
- using the log command 

Types of workloads that are long running: 
- web 
- application
- database 

Types of workloads that are short lived:
- batch processing 
- analytics 

What happens in k8s when you try to create a pod that does a task and exits?
- the pod will just continue respawning a container that does the job over and over again 
- default pod behavior is to always recreate a container once it exits 

How do you change this in a pod?
```
spec: 
  containers:
    - name: container
      image: test
      restartPolicy: never
```

what if you want to run the pods in parallel?
- add the attribute ```parallelism: ```

example:
```
spec:
  completions: 3
  parallelism: 3
  template:
    spec:
      containers:
        ...
```

## cron job in k8s 
what are cron jobs? 
- tasks that are meant to be scheduled and run periodically

how to create a cron job definition file 
```
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: reporting-cron-job
spec:
  schedule: "/1 * * * *"
  jobTemplate:
    spec:
      completions: 5
      parallelism: 5 
      template:
        spec:
          containers:
            - name: test
              image: test
          restartPolicy: never
```


