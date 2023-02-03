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


# ClusterRoles and ClusterRoleBindings
so far, most of our resources have been scoped to a specfic namespace, if you do not create a namespace or specify one, then the resources are created in the default namespace
- ClusterRoles are visible to the entire cluster

cluster scoped resources
- nodes
- PV
- clusterroles
- clusterrolebindings
- certificatesigningrequests
- namespaces

To create a cluster role in kubernetes, change the kind to ClusterRole 
- you then need to link the user to the cluster role, use the kind ClusterRoleBinding


# Admission Controllers
- intercepts requests to the kube API-server 
- evaluated after authentication and authorization has already taken place
- helps to make sure certain criteria is met, ex: pods cannot be created if they are using images from a public registry
- handles validating and mutating 

default admission controllers
- AlwaysPullImages
- DefaultStorageClass
- EventRateLimit
- NamespaceExists

How to view the admission controllers that are enabled 
``` kube-apiserver -h | grep enable-admission-plugins ``` 

How to enable / disable admission controllers
- edit the kubernetes service
- if using kubeadm, edit the kube-apiserver manifest

## Validating and Mutating Admission Controllers
Validating Admission Controllers - validating the request (making sure the request is permitted)
Mutating Admission Controllers - change the api request 
- There are admission controllers can do both 
- usually the mutating controller runs before the validating controller

You can create your own Admission controllers 
These admission controllers are enabled for us to create custom admissions controllers
- MutatingAdmission webHook
- ValidatingAdmission WebHook

Dynamic Admission Control - custom admission controllers 
- admission webhooks: receive admission requests and do something with them

  How to use?
  - verify that MutatingAdmissionWebhook and ValidatingAdmissionWebhook are enabled
  - ensure admissionregistration.k8s.io/v1 API is enabled

  1. deploy an admission webhook server 
  2. configure the admission webhook



example of webhook
```
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
metadata:
  name: "pod-policy.example.com"

webhooks:
- name: "pod-policy.example.com"
  clientConfig:
    service:
      namespace: "webhook-namespace"
      name: "webhook-service"
    caBundle: "skdhfjiuebiue"
  rules:
    - apiGroups: [""]
      apiVersions: ["v1"]
      operations: ["CREATE"]
      resources: ["pods"]
      scope: "Namespaced"
```

## securityContexts 
- defines the privileges and access control settings for a pod or container 
- security contexts can include the following:
  - discretionary access controls
  - SELinux
  - Running as privileged or unprivileged 
  - linux Capabilities 
  - AppArmor

example of using securityContext on a pod 
```
apiVersion: v1
kind: Pod 
metadata:

spec: 
  securityContext:
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
```




# Summary 

Topics 
- users in kubernetes (create a lab)
- kubeconfig (create a lab)
- API groups 
- roles + role bindings (create a lab)
- cluster roles + cluster role bindings 
- admission controllers (validating, and mutating)


Labs 
1. using static files, create a dev user in kubernetes 
2. adding a user to the kubeconfig and giving access to the development namespace
3. creating a role binding for a user only allowing them to list pods in a namespace


1. a new user called test-user is being created, create a cluster role that gives this user the ability to create namespaces, create the cluster role binding for the users to the role also


outline of a cluster role 

```
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole 
metadata:

rules:
- apiGroup: []
  resources: []
  verbs: []
```

outline of cluster role binding 

```
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:

subjects:
- kind:
  name:
  apiGroup: rbac.authorization.k8s.io
roleRef:
   kind: ClusterRole
   name: 
   apiGroup: rbac.authorization.k8s.io
```