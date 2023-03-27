# Tips for the exam 

## 1. become proficient with vim 


## 2. become proficient with running k8s from the CLI before using manifests

It is important to be proficient in creating manifests for kubernetes resources, but there are some resources that are going to save you time on the exam, if you create them from the command line.

some of those resources are: 
- secrets 
- pods 
- exposing pods with basic services 
- configMaps
    - --from-file=index.html=/path/to/html
    - --from-literal=key1=config1
- deployments 
    - this is useful to create basic deployments, then output to yaml and edit them afterwards


#### Pods 
- Creating pods from the CLI 
``` kubectl run ```
options: 
- rm: deletes the pod after it exits 
- l: comma separated labels to apply to the pod, wrapped in quotes
Examples: 

- creating a pod that gets removed after it exits 
``` kubectl run $PodName --image=nginx --labels="tier=frontend,env=dev" -it --rm=true ```

- creating a pod that gives you a shell on it, and removes it afterwards 
``` kubectl run $podname --image=ngxin -it --rm=true -- /bin/sh ```


#### Deployments
- creating a deployment from the CLI and output to a yaml file
``` kubectl create deployment $name --image=$image --replicas=$replicaNumber ```
``` kubectl get deploy $name -o yaml > deploy.yml ``` 
