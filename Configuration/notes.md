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

Creating a secret object for a service account that is non expiring 

```
apiVersion: v1
kind: kubernetes.io/service-account-token
metadata:
  name: mysecretname
  
  annotations:
    kubernetes.io/service-account.name: dashboard-sa
```

