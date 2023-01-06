# Multi-Container Pods 

Monolith vs microservices

    Monolith: 
        - built as a single unit that is self-contained and independent from other applications 
        - one code base that couples all the business concerns together 

    Microservices: 
        - each piece of the application is it's own entity


## What is a multi-container Pod 
you should be using multi-container Pods when the containers share the same lifecycle.
- share the same network, can refer to each other with localhost 
- share the same storage volumes 


## How to create a multicontainer pod 
- when could you use a multi-container pod?
    - running a container that will handle background jobs in a rails application
        - sidekiq is used to run background jobs, if you ran sidekiq in another container, it would be able to use localhost 

```
spec:
  containers:
    - name: simple-web-app
      image: simgple-web-app
      ports:
        - containerPort: 8080
    - name: log-agent
      image: log-agent
```

## 3 common patters 
- sidecar
    - ex: creating a logging container that lives next to an application and sends its logs somewhere
    - the sidecar is crucial to help your web application function, but is not necessarily part of the application itself
- adapter
    - used for normalizing application output, used for monitoring and data aggregation 
- ambassador 
    - allows the container to connect to the outside world 
    - proxy that allows other containers to connect to a port on localhost while the ambassador can proxy the connections to other environments



# Init containers 
- running a process that runs to completion. ex: process that pulls a code or binary from a repo that will be used by the web application 
- process that waits for an external service or database to be up before the actual application starts 

How do initContainers work?
- when the pod is created, the process in the initContainer must run to a completion before the real container hosting the application starts
- with multiple initContainers, they run once, in sequential order 
- on failure, k8s restarts the pod repeatedly until the init container succeeds

configured similar to other containers in a pod but, initContainers is the section name 
```
spec:
  containers:
    - name: busybox
      image: busybox
  initContainers:
    - name: oneRun
      image: oneRUn 
```