# CKAD-labs
this repo has all the labs that I created while completing the Certified Kubernetes Application Developer exam topics.

the labs built in this repository will be using the demo application that is built in this repo.

## What does the CKAD consist of 
25% - Application Environment, Configuration, and Security

        - Discover and use resources that extend K8s 
        - Understand authentication, authorization and admission control
        - Understanding and defining resource requirements, limits, and quotas 
        - understand ConfigMaps
        - Create and consume secrets 
        - understand ServiceAccounts  
        - understand SecurityContexts 

20% - Application Design and Build 

        - Define, build and modify container images 
        - Understand jobs and CronJobs 
        - Understand multi-container Pod design patters 
        - Utilize persistent and ephemeral volumes

20% - Application Deployment 

        - Use Kubernetes primitives to implement common deployment strategies 
        - understand deployments and how to perform rolling updates
        - use the help package manager to deploy existing packages 

20% - Services and Networking 

        - Demonstrate basic understanding of NetworkPolicies 
        - Provide and troubleshoot access to applications via services
        - Use Ingress rules to expose applications

15% - Application observability and maintenance 

        - Undersand API deprecations 
        - Implement probes and heath checks
        - use provided tools to monitor Kubernetes applications 
        - Utilized container logs 
        - Debugging in Kubernetes

## How to use the labs
the labs in this repo assume that you already have some kubernetes knowledge gained through your studies. 

In order to do these labs, you will need to have a local kubernetes cluster running (can be accomplished with minikube or kind). 

The lab folder contains all the labs, they are separated into each section of the test. each section will have a readme that states what the lab objectives are. There is another folder, called "lab-answers" that will show you the answers that I came up with.

Good luck!