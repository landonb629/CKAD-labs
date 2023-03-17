# CKAD area - Application Environment, Configuration, and Security 

## Understand authentication, authorization and admission control
- authorization: what actions is the identity permitted to perform?
- authentication: who is this identity? are they allowed to access this resource?

Roles and ClusterRoles 
- contain the information about what permissions are permitted 
- Roles are namespaced 
- ClusterRoles are not namespaced

RBAC: role based access control

RoleBinding and ClusterRoleBinding
- bindings are how you tell k8s that a role is to be connected to a set of users of service accounts 

kubeconfig and context 
- kubeconfig file is stored at $HOME/.kube
- this file stores information about your connection to the k8s cluster

this file holds the following information:
- cluster information
- authentication information (username/password, certifications, or tokens, and contexts)

what is a context?
- stores acces info under a name 
  - this would be the cluster, user, and namespace

What is an admission controller?
- code that intercepts requests to the kube api server before the creation of the object, but after the request is authenticated 
- two types of admission controllers: validating or mutating 

Mutating: modify objects related to request
Validating: do not modify, they make sure the request is aligned with policy

Control phases:
1. mutating controllers are run
2. validating controllers are run 

enabling admission controllers

``` kube-apiserver --enable-admission-plugins=ONE,TWO,THREE ``` 

How to view the controllers enabled by default 

``` kube-apiserver -h | grep enable-admission-plugins ``` 


#### Authentication in Kubernetes 

Users in k8s 
- two categories: service accounts and users
    - there is no user API in kubernetes 

How does k8s handle normal users?
- private keys
- user store like google accounts
- file with a list of usernames / passwords

- Any user that presents a valid certificate signed by the clusters CA is considered authenticated

Service accounts: 
- are managed by the k8s API 
- bound to namespaces and tied to credentials stored in secrets 
- These get mounted to pods allowing the processes to talk to the K8s API 

Authentication methods 

- Client Certificates:
    - enabled by passing --client-ca-file=FILE to API server
    - the common name of the subject is used as the username for the request 

- Static Token File 
    - API server takes the bearer token from a file with --token-auth-file=FILE

  
## Authorization in Kubernetes 
- authentication comes before authorization 

Authorization modes 
- node: grants permissions to kubelets based on the pods they are scheduled to run
- ABAC: attribute based access control, rights granted through policies that combine attributes of users, the environment, and resources
- RBAC: permissions granted based on roles an individual possesses. 
- Webhook: an HTTP callback 

How to check api access 
- auth can-i sub command 
  - this subcommand queries the authorization layer 

``` kubect auth can-i creat pods ``` 

you can impersonate users or service accounts 

``` kubectl auth can-i list pods --as system:serviceaccount:pod-reader ``` 

## How to add a user to kubernetes cluster using certificates 
- k8s has a certificates API object that allows you to send a certificate signing request and approve it with kubernetes 

Request process
- create a CertificateSigningRequest 
- approve the request, this can be done manually or automatically by a controller 
- the certificate for the user becomes available in the certificateSigningRequest object at the json path .status.certificate 
- that certificate must then be decoded from base64 and stored in a username.crt file 
- create a role and rolebinding for the new user 
- add the user to kubeconfig 
  - config set-credentials 
  - config set-context
  - config use-context

## How to generate a certificate for a user? 

- generate a cert
``` openssl genrsa -out myuser.key 2048 ```
- generate a signing request 
``` openssl req -new -key myuser.key -out myuser.csr ```
- encode the csr in base64 
``` cat myuser.csr | base64 ``` 


## What does a CertificateSigningRequest API object need? 
- usage: this has to be 'client auth'
- expirationSeconds: how long in seconds before the request will expire 
- request: the base64 encoded certificate signing request 

```
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: user-csr
spec:
  request: ##base64encodedvalue
  expirationSeconds: 86400
  usages:
    - client auth
```

https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests/
https://thenewstack.io/a-practical-approach-to-understanding-kubernetes-authentication/


## Understand defining resource requirements, limits, and quotas
- k8s does not enforce any quotas for compute resources, so unlimited resources can be used until the max available is reached 

K8s measures CPU in millicores and memory in bytes

quotas 
- ResourceQuotas will limit the usable resources for each namespace
- the kubernetes scheduler takes care of those rules 

The following limits can be defined: 
- object count quotas: total number of a certain object
- compute resource quotas: limits the total sum of compute resources for a requested namespace 
  - limits.cpu
  - limits.memory
  - requests.cpu
  - requests.memory 

## Understand ConfigMaps 
- used for storing non-confidential configuration data in key-value pairs. 
- can be consumed as env variables, command line args, or as config files in a volume 

- not designed for large chunks of data. if you are storing configs larger than 1Mi, use a volume mount 

using a configmap for configuration data

```
data:
  nginx.config: | 
    server { 
        listen 80;
    }
```


basic config map to pass in environment variables 

```
apiVersion: v1
kind: ConfigMap
metadata:
  name: demoConfigmap

data:
  NODE_ENV: "development"
  MONGODB_URL: "http://localhost:27017"
```


## Understanding secrets 
- configMaps are good for configuration data 
- Secrets are used for passwords, tokens, and other types of private keys 
- secrets are exposed to pods via explicit declaration in pod manifests and the k8s api 

Secrets are not encrypted, they are stored in etcd as plaintext

#### Creating secrets 
- secrets are a collection of data elements (key / value pairs)

#### Consuming secrets 
- you can expose secrets to a pod through a volume mount 
- you can expose secrets to a pod through environment varibles 

the easiest way to create secrets is with the kubectl command 

``` kubectl create secret generic testsecret --from-file=file.txt ``` 
``` kubectl create secret generic testsecret --from-literal=test=data ```

#### Private container registries 
- you can use secrets to store credentials for private container registries 
- these are called image pull secrets 


## Understand ServiceAccounts
- pods use service accounts to communicate with the kubernetes API server with an authentication token
- if you don't specify a service account, the pod gets "default" which has the same permissions as a use with no auth

Manuall creating an API token for a service account 

``` kubectl create token sa-name ```

automatically generate an API token for a service account
- use an annotation with the service account account name as a secret

```
apiVersion: v1
kind: Secret
metadata:
  name: secret-sa
  annotations:
    kubernetes.io/service-account.name: secret-account
```


querying service accounts?
``` kubectl get serviceaccounts ```
``` kubectl get sa ```

High level steps to using service accounts
- create the service account object in k8s 
- grant the service account permissions 
- assign the serviec account object to pods during creation

granting permissions 
- permissions can be granted from built-in RBAC by creating a role, and roleBinding


## understand SecurityContexts 
- defines the privileges for a pod or container 
- you have the ability to grant pods / containers the ability to run in privileged mode, and more 

securityContext
- settings defined on the pod level apply to all containers running in the pod 
- container level settings take precedence 

example use case for securityContexts:
- you don't want any containers in a pod to run as the root user

```
spec:
  securityContext:
    runAsNonRoot: true
```
