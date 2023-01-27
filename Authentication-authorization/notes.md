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


# KubeConfig 
kubectl uses kubeconfig files to find the information it needs to choose a cluster to communicate with 
- kubectl will look for a file named config in the $hOME/.kube directory  
- configuration file that provides the credentials that allow you to query the kubernetes apiserver 
- this file has three parts: clusters, users, and contexts 

clusters: this could be development, production, google, etc.
contexts: used for grouping access parameters under a convenient name 
    ``` kubectl config use-context ``` = setting the current context
users: 


KubeConfig file example 

``` 
apiVersion: v1
kind: Config 

clusters:
- name: my-playground
  clusters:
    certificate-authority: ca.crt
    server: https://serverurl:6443

contexts:
- name: kube-admin@my-playground 
  context:
    cluster: my-playground
    user: kube-admin
  
users:
- name: kube-admin
  user:
    client-certificate:
    client-key:
```

view current kubeconfig file 
``` kubectl config view ```

How to update your current context?
``` kubectl config use-context prod-user@production ```

Namespaces:
  - you can create contexts that are different namespaces 

### Certificates in kubeconfig
- you can pass in the certificate authority with the full file path
- you can also pass in the certificate authority with the base64 encoded version of the file 




# API groups
- these are the /paths that you can hit to get different information about your cluster

APIs are categorized into two. the core group and the named group. 
core: all core functions exist ex: pods, rc, pv, pvc, configMaps
named: organized apis ex: apps, authentication, certificates, networking, extenstions

- named groups are what we should pay attention to

here is an example break down of the group

/apps -> this is the API group 
    /v1
        /deployments -> these are the resources
        /replicasets
        /statefulsets -> list, get, create, delete

How to access the kubernetes api?
- curl the master nodes address followed by port 6443

ACCESSING THE API 
- use kubectl proxy : cretaes a proxy between your local and the API server, it will load your credentials from the kubeconfig file

``` kubectl proxy ```


# Authorization 

authorization mechanisms 
- Node: grants permission to kubelets based on the pods they are scheduled to run 
- ABAC: access rights are givent to users through the use of policies which combine attributes togheter 
- RBAC: regulating access based on the roles of individual users within an enterprise 
- Webhook: http callback, POST request that occurs when something happens, a web app implementing web hooks will pOST a message to a URL when certain things happen
- AlwaysAllow: this is the default authorization mode 
- AlwaysDeny:

having multiple authorization modes? 
- you can specify this in the kubeapi configuration 
- they are evaluated based on the order that they are configured, if a check fails, it moves to the next mode


# Role based access controls 

How do we create roles?
- we use a role definition file 

```
apiVersion: rbac.authorization.k8s.io/v1
kind: Role 
metadata:
  name: developer
rules:
- apiGroups: [""] -> if you are referencing the coreAPI group, you dont need to fill out apiGroups field
  resources: ["pods"]
  verbs: ["list", "get", "create"]

```

next step: link the user to a role 
- this is called a role binding 
- we create a role binding with a definition file 

```
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: devuser-developer-binding
subjects:
- kind: User
  name: dev-user
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role   
  name: developer
  apiGroup: rbac.authorization.k8s.io
```

view created role 
- kubectl get roles 

view binding 
- kubectl get rolebindings

describe the role 
- kubectl describe role 

describe role bindings 
- kubectl describe rolebindings


### How to check access 
kubectl auth can-i create deployments
kubectl auth can-i delete nodes 

How to impersonate another user?
- kubectl auth can-i create deployments --as dev-user




# Summary 

Topics 
- users in kubernetes (create a lab)
- kubeconfig (create a lab)
- API groups 
- roles + role bindings (create a lab)

Labs 
1. using static files, create a dev user in kubernetes 
2. adding a user to the kubeconfig and giving access to the development namespace
3. creating a role binding for a user only allowing them to list pods in a namespace
