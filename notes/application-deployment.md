# Application Deployment 

## use k8s primitives to implement a common deployment strategy 

deployment example 

```
apiVersion: apps/v1 
kind: Deployment 
metadata:
  name: alpha-deploy
spec: 
  replicas: 2
  selector: 
    matchLabels: 
      app: alpha
  template:
    metadata:
      labels:
        app: alpha
    spec:
      containers: 
        - name: alpha
          image: lbabay.azurecr.io/alpha:v1.0
```

what are k8s primitives? 
- building blocks of the kubernetes architecture 
    ex: Pod, Deployment, and Service 

Deployments: using CLI or yaml manifest, describe the desired state of the configuration, the deployment controller will attempt to get the actual state to match 

example: I create a deployment and I want it to have 2 replicas, when I first deploy the actual state will be 0 pods and the desired state will be 2 pods, k8s deployment controller will try to deploy 2 pods to get the actual to match the desired

A deployment figures out which pods to manage by using a .spec.selector paired with matchLabels
 - this tells the deployment controller to manage any pods with that label

ex: 

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deploy
spec:
  replicas: 2 
  selector:
    matchLabels:
      app: frontend
```

Updating a deployment
- deployments can be updated by rolling out a new version of the application 
- rollouts are only triggered if the deployment template changes (.spec.template)

Scenario: You need to deploy a new version of your application (deployment) without any downtime

There are several methods to update a deployment
- from the cli 
``` k set image deployment/alpha-deploy alpha=nginx ```
    - we are telling k8s that we want to take the old alpha pod and update with the nginx image
- the edit command 
``` k edit deployment/alpha-deploy ```

NOTE: when using these two methods, the template used to create the deployment will not be updated, so if you were to ``` k apply -f template.yml ``` the deployment would revert back to the original template 

How can we see this?
1. deploy a template 
2. run ```k get pods ```, copy the name of one of the pods 
3. run ``` k get pods $podname -o json | jq .spec.containers ```
    - notice the name of the image 
4. update the deployment by editing the image from the cli, copy the name of one of the new pods 
5. run ``` k get pods $podname -o json | jq .spec.containers ```
    - notice that the image is not updated 
6. apply the original template, copy the name of one of the new pods 
7. run ``` k get pods $podname -o json | jq .spec.containers ```
    - notice the name of the image is reverted back to the original 

Deployment strategies 
- Recreate: all previous pods are killed before creation of new pods
- Rolling Update: 
    options:
      - maxUnavailable: the maximum number of pods that can be unavailable during a rolling update
            - this option would need tuning if you have a very highly utilized application that cannot function with only a percentage of the pool available 
            - example: your app begins to crash when less than 5 / 10 pods are available, so you need to set the max unavailable percentage accordingly, something like 30% 
      - maxSurge: the number of pods that can be created over the desired number of pods

Viewing the properties of your deployment changes 
- viewing the reason why the deployment triggered (change cause)
- viewing the rollout history 
- viewing the rollout status

How to rollback? 
- use the  ``` rollout undo ``` command to undo your rollout to a specific revision
- view the revision with the ``` kubectl rollout history deployment/$deployment-name ``` command 
- to rollback: 
   ``` kubectl rollout undo deployment/$deployment-name --to-revision 3 #or whatever number you want to rollback to ```

How to view the reason for a deployment?
- set with the annotation ``` kubernetes.io/change-cause ```
- you can see the history of your rollout with the following command 
``` kubectl rollout history deployment/$deployment-name ```

How to see the status of your rollout?
- use the ``` rollout status ``` command 
``` kubectl rollout status deployment/$deployment-name ```


## Use the Helm package manager to deploy an existing package

Understanding Helm
- tool for managing k8s packages called charts 
- charts: collection of files inside a directory, the files describe a related set of kubernetes resources 
  - every chart must have a version number 
- helm charts allow you to pass "variables" to the helm charts in order to configure the application differently based on the environment

What would you use a chart for?
 - deploying a simple, or complex kubernetes application 

description of the different files that are part of a helm chart 
- chart.yaml: contains metadata information related to the chart 
- .helmignore: define all the files which we don't want to include in the helm chart 
- values.yaml: defines the values for the YAML templates, ex: replicas, image name
- charts (directory): can add another chart inside, if our chart has dependencies, is empty by default
- templates: all the manifests from the application
- templates/NOTES: text that is output once the helm deployment is successful 
- templates/tests: you can write tests for your helm deployments


