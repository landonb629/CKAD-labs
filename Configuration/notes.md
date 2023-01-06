# Configuration section 


## Commands and Arguments in k8's
- First, it is good to understand what CMD and ENTRYPOINT do
    - ENTRYPOINT: This is the command that is going to run at startup no matter what, this can take in an argument from the command line at start up. whatever you supply at startup will be APPENDED to the entrypoint.
    - CMD: this can be overridden by at startup by any command line argument that is passed.

Example: 
- you want to echo the word test 
```
ENTRYPOINT ["echo"]
CMD ["test"]
```
- now you want to echo the word another-test, all you have to do is pass that to the command line 
docker run echo-image another-test
```
ENTRYPOINT ["echo"]
CMD ["test"]
```

How do we do this in k8s?
```
apiVersion: v1
kind: Pod 
metadata:
  name: echo-image
  labels:
    app: test

spec:
  containers: 
    - name: echo-image
      image: echo-image
      args: ["test"] //This is going to override the CMD instruction in our example 
      command: ["echo 2.0"] //This is going to override the entrypoint instruction from our example
```

## Environment Variables
- the environment variables can be set in the spec section, and the object is an array so the - will start every new element
```
spec:
  containers: 
    - name: test
      image: nginx
  
    env:
      - name: RAILS_ENV
        value: production
```
- the method above would be considered the regular "key/value pair" method 

There are other methods to setup the environment variables 

- configMaps 
```
env:
  - name:
    valueFrom:
      configMapKeyRef:
```
- secrets
```
env: 
  - name:
    valueFrom:
      secretKeyRef:
```

## Config maps
- when you have to manage many different applications with many environment variables, it would be very hard to do in the definition file 
- configMaps are separate files with key/value pairs 

two phases of config maps:
1. create the config map 
2. inject the config map 

two ways to create 
1. declarative
2. imperative ``` kubectl create configmap --from-literal=APP_COLOR=blue```
you could also do path to a file ``` kubectl create configmap --from-file=app_var.properties ```


view config maps: ``` kubectl get configmaps```
describe config maps: ```kubectl describe configmaps```

How to configure with a pod? 

```
spec: 
  containers:
    - name: nginx
      image: nginx
    
    envFrom:
      - configMapRef:
          name: app-config // this would be the configmap that we already created
```

## Secrets 
- similar to config map, except secrets are encoded
- secrets can be created imperatively or declaratively 

- Secrets are not encrypted, they are encoded, anyone can get the secret object and decode it 
- do no checkin your secret definition files
- secrets are not encrypted in ETCD, consider encrypting data at rest
- anyone who is able to create pods in the same namespace can access the secrets too 

```
apiVersion: v1
kind: Secret
metadata:
  name: secret-1
data:
  SECRET_PASSWORD: (encoded value)

```

```
spec:
  containers: 
    - name: test
      image: nginx
  
    envFrom:
      - secretRef:
          name: app-config-secrets
```

How do you encode the value? 
``` echo -n "secret" | base64 ```

# Security contexts in docker

Security contexts in docker 
- containers and the host share the same resources 
- hosts and containers are isolated in linux with namespaces

On the docker host 
- all processes, as well as the child namespaces are visible as a process


Users (security)
- by default, docker runs processes in the container as the root user 
- you can set the user with the user option with docker RUN 


What happens when you run the container with the root user?
- root user in the container has a limited set of capabilities 
- this is implemented through linux capabilities 
- the root user in the container does not have capabilities to run commands that will impact the host

--cap-drop = drop linux capabilities 
--cap-add = add linux capabilities 

# k8s security contexts 
- containers are encapsulated in pods, you can choose to secure the containers at the container level or the pod level

How to configure the security context at the pod level

```
apiVersion: v1
kind: Pod
metadata:
  name: ubuntu

spec:
  securityContext:
    runAsUser: 1000

  containers:
    - name: ubuntu
      image: ubuntu
      command: ["sleep", "3600"]

```

how to configure the security context at the container level
- you have to move the securityContext section under the container 

```
apiVersion: v1
kind: Pod
metadata:
  name: ubuntu

spec:
  containers:
    - name: ubuntu
      image: ubuntu
      command: ["sleep", "3600"]
      securityContext:
        runAsUser: 1000

```

How do you add capabilities? 
- under the securityContext, add capabilities: section
- this can be only added under a container, not a pod 

```
securityContext:
  runAsUser: 1000
  capabilities: 
    add: ["MAC_ADMIN"]
```

# Resource requirements 
- each node in a cluster will have its own cpu mem and disk 
- the scheduler places each pod on a node in the cluster

if there are no resources for your pod, your container will be in a pending state 

what are limits and requests?
- requests: resources requested by the pod on creation
- limits: the limit that is set for the pod, meaning it cannot use more resources then allocated 

resource request = what resources are going to be needed from a node for the pod 
k8s assumes that a pod needs by default: 
- .5 CPU 
- 256 Mi


resource - CPU 
what does 1 cpu mean?
- 1 vcpu in aws
- 1 azure core
- 1 GCP core 
- 1 hyperthread
- lowest = 0.1 cpu 

resource - MEMORY
- 1G gigabyte
- 1GI gibibyte 

Resource limits 
- k8s sets a default limit to 1vcpu 
- k8s sets a default limit of 512Mi

How to set resource limits
```
spec:
  containers:
    - name: test
      image: ubuntu
      resources:
        limits:
          memory: "20Mi"
```

What happens when limits are exceeded
- cpu is throttled, a container cannot use more cpu then it has been allocated
- memory is different, a container can use more memory then its limit, if it constantly tries to get more memory, it will be terminated 


# service accounts 
- accounts used by machines 
- account used by an application to interact with the kubernetes cluster
- each namespace has a default service account

service account mounting upon creation?
- when a pod is created, the default token is mounted as a volume
  this gets mounted as 3 different files (ca.crt, namespace, and token)
- you can choose to not mount with the following option
```automountServiceAccountToken: false ```
```
spec:
  containers:
    - name: test
      image: ubuntu
  automountServiceAccountToken: false
```

- in order for an application to be able to query the kubernetes api, it needs to be authenticated (use a service account)

```kubectl create serviceaccount $name ```
- once the SA is created, it will create a token for the application to use 
- it creates a secret object, and stores the token inside that object 
How to view the token 
```kubectl describe secret $nameoftoken```


```
spec:
  containers:
    - name: test
      image: ubuntu
  serviceAccountName: dashboard-sa
```

when can you edit service accounts? 
- you can edit the service account for a deployment, this will trigger a rolling update 
- you cannot edit the service account of a pod 

updates 
- now tokens are created for the pods but they have an expiry
- now it is a projected volume 

previously:
- service account created = secret creation = token creation with no expiry
- this was then mounted to the pods that used this serviceAccount

Now:
- create service account = does not automatically create a secret or a token 
- you now need to run ```kubectl create token $sa```

Creating a secret object for a service account that is non expiring (This is the old way)

```
apiVersion: v1
kind: kubernetes.io/service-account-token
metadata:
  name: mysecretname
  
  annotations:
    kubernetes.io/service-account.name: dashboard-sa
```


# Tolerations and Taints 
- used to control what pods can be scheduled on what nodes 
- does not tell a pod to go to a particular node, just tells the node to allow only the pods with certain tolerations 
- setting up a taint will not ensure that a pod with matching toleration will be scheduled on that node. that is a differrent concept called nodeAffinity
- taints come in the form of key/value pairs ```key1=value1```

Taints: allow a specific node to repel a pod from being placed on it 
  example: we have a three node cluster, and we have a memory intensive application called app1. We have a node called node1 in the cluster that has more memory. so, we place a taint on that node that will only allow pods from app1 to be placed on it

  Taint Effect: what happens to the pods if they do not tolerate the taint.
    Three effects: 
      - NoSchedule: Pods will not be scheduled on the node
      - PreferNoSchedule: try to avoid placing the pod on the node
      - NoExecute: new pods will not be scheduled, existing pods will be evicted (killed) if they don't tolerate the taint

  How to add a taint to a k8s cluster node:
    Scenario: 3 node cluster: node1, node2, and node3
  ```kubectl taint nodes node1 tier=app:NoSchedule```
  What does this mean? do not schedule a pod on this node unless it has a toleration for tier=app


Tolerations: these are what we apply to the pod itself. Tolerations will allow the scheduler to match with a taint.
  example: we have a node that has a taint of blue, and we have 3 pods, only one pod has a toleration for blue, so that is the only pod that can tolerate the taint on that node, it can be scheduled there

Commands:
```kubectl taint``

How to create a toleration:
  Scenario: new pod being created is part of the app tier, we need it to be scheduled on the node that has a taint for the app tier 

  we just ran the follow command 
  ```kubectl taint nodes node1 tier=app:NoSchedule```

  ```
  apiVersion: v1
  kind: Pod
  metadata:
    name: tolerant-pod
    labels:
      tier: app
  
  spec:
    containers: 
      - name: tolerant-pod
        image: app-image:latest

    tolerations:
      - key: "tier"
        operator: "Equal"
        value: "app"
        effect: "NoSchedule"
  ```


# Node Selectors and Node Affinity
- simple and easiest method for assigning pods to a specific node 
- we can use labels like "size: Large" 

But how does k8s know what node to put that on?
- we must add labels to our k8s nodes before we use nodeSelectors

How do we label nodes?
``` kubectl label nodes node1 size=Large```

What are the limitations with nodeSelectors?
- you cannot do anything with advanced expressions
for example: 
- if we wanted to place a pod on any node that is NOT small
- we want to place a pod on a node with labels for STAGE or DEV 

```
spec:
  containers:

  nodeSelector:
    size: Large 
```


## Node Affinity 
- ensure pods are hosted on particular nodes, just like Node Selectors but, you cannot use advanced expressions like OR and NOT 

How to use advanced expressions?
- this is where the operator comes into play, the value can be "In", "NotIn", "Exists"
in this example, the pod will be placed on a node that has a label of size that equals Large or Medium
```
operator: In
values: 
  - Large 
  - Medium
```
in this example, the pod will be placed on a node that has a label of size and any node that doesn't equal small 
```
operator: NotIn
values:
  - Small
```

in this example, the pod will be placed on any node that the label "size" is set
```
- key: size
  operator: Exists
```

```
spec:
  containers:

  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
          - matchExpressions:
              - key: size
                operator: In
                values:
                  - Large
                  - Medium
```

What if there are no matches for your affinity?
- This is where the node affinity type comes into effect
Node affinity type is that long value right after the nodeAffinity attribute 
There are two types of node affinity: 
  - requiredDuringSchedulingIgnoredDuringExecution: scheduler cannot schedule the pod unless the rule is met. use this when placement of the pod is crucial
  - preferredDuringSchedulingIgnoredDuringExecution: scheduler tries to find a node that meets the rule, if a match is not available, still schedules the pod 


  what does this mean?
    - there are two states in the lifecycle of a pod 
      - duringScheduling: pod doesnt exist, is created for the first time
      - duringExecution: state where the pod is running, and a change is made to the environment that impacts affinity, such as a label being changed on a node
          - currently, changes after the pod has been scheduled will be ignored but that is to be changed in the future

  
