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







# finished the course 
25% - Application Environment, Configuration, and Security
        - [] Discover and use resources that extend K8s 
        - [] Understand authentication, authorization and admission control 
        - [] Understanding and defining resource requirements, limits, and quotas - DOING THIS TODAY
        - [x] understand ConfigMaps
        - [x] Create and consume secrets 
        - [x] understand ServiceAccounts
        - [x] understand SecurityContexts

20% - Application Design and Build 
        - [x] Define, build and modify container images 
        - [x] Understand jobs and CronJobs 
        - [x] Understand multi-container Pod design patterns 
        - [x] Utilize persistent and ephemeral volumes

20% - Application Deployment 
        - [] Use Kubernetes primitives to implement common deployment strategies 
        - [] understand deployments and how to perform rolling updates
        - [] use the helm package manager to deploy existing packages 

20% - Services and Networking 
        - [] Demonstrate basic understanding of NetworkPolicies 
        - [] Provide and troubleshoot access to applications via services
        - [] Use Ingress rules to expose applications

15% - Application observability and maintenance 
        - [] Undersand API deprecations 
        - [] Implement probes and heath checks
        - [] use provided tools to monitor Kubernetes applications 
        - [] Utilized container logs 
        - [] Debugging in Kubernetes


lightning lab 2 
- create a cronjob that only runs once, it is considered failed after 20 seconds
- create a pod that maps a secret as a volume, make sure that is it only scheduled on the control plan (node affinity)
- configuring ingress routing for different hosts, each path should take you to a different service 
- outputting a log file that matches specific criteria to a different 