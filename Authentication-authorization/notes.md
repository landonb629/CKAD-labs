# Authentication, Authorization and admission control

Secure Hosts
- if a host becomes compromised, usually all becomes compromised 


## Secure Kubernetes 
- securing the kube-apiserver is important because it can make most of the calls to anything in k8s 
    - Authentication: who can access the apiserver 
    - Authorization: what can they do 
         - RBAC, ABAC, node authorization

## Authentication 

Accounts 
- Two types:
    - User accounts: k8s doesnt manage
    - Service accounts: k8s manages 

Auth Mechanisms
- the kubeAPI server is the gatekeeper for all requests

- Static password file 
    - This would be a csv that has password, usernames, userIDs, and group details 
    - you would pass the csv to the kubeapi server with ``` --basic-auth-file=$filename ``` 
    - you would then need to restart the kubeAPI server 
- Static token file 
    - samething as above but with tokens 
- Certificates 
- Identity services 