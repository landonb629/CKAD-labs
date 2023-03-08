# CKAD area - Application Environment, Configuration, and Security 

## Discover and use resources that extend k8s 


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
