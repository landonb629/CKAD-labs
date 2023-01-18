# Services 
- enable communication between components within and outside the application
- helps us connect apps together, and users with apps 
- services enable communication between different pods 

How do we access pods externally?
setup
- k8s node: 192.168.1.2
- laptop: 192.168.1.10
- internal pod network: 10.244.0.0
- pod: 10.244.0.2

we cannot curl the pod directly from our laptop

How can we access the pod?
- ssh into the node and curl the pod url (not optimal)
- we need to map the pod to the node IP (k8s service does this)

type of services
- NodePort: 
    - select a port on the node, listen for requests and forward them to the pod 
- ClusterIp:
    - creates a virtual IP address inside the cluster that allows communication between pods
    - ex: frontend servers talking to backend servers
- LoadBalancer: 
    - distribute load across webservers in the frontend tier

### NodePort 
- maps a port on the node to a port on the pod 

3 ports involved 
TargetPort - port on the pod to map to
Port - the port on the service
NodePort - the port on the node that is listening 
    - ports in a range of 30,000 - 32,767

configuration notes
- the only required field is "port"
    - if you don't provide a target port, it is assumed to be the same as port
    - if you don't provide a nodePort, one is randomly assigned within the valid range

How to create a service mapped to a single pod
```
apiVersion: apps/v1
kind: Service
metadata:
  name: myService

spec: # configure the service itself
  type: NodePort
  ports:
    - targetPort: 80
      port: 80
      nodePort: 30008
  selector:
      app: myapp
      type: frontend
```

what happens when pods are distributed across multiple nodes?
- creating a service will span across all the nodes in the cluster


## clusterIP

in a tiered application architecture, we would have a frontend, backend, and potentially a layer like redis

we may have a service for each the frontend, backend, and caching layer, but how would we connect all this together? 
    - the pods IP addresses are dynamic so they would not be able to communicate with each other reliably by IP

a service can help up group together pods and provide a single interface for pods to access this service: ClusterIP version 

how to create a definition file for this?

```
apiVersion: v1
kind: Service
metadata:
  name: backend

spec:
  type: ClusterIP # default type 
  ports:
    - targetPort: 80 # port where the backend is exposed
      port: 80 # where the service is exposed
  selector: # this is how we are linking our pods to our service
    app: myapp
    type: backend
```


## Network Policies 
- object in kubernetes that specifies how a pod is allowed to communicate with various network entities 
    - by default, when you allow inbound traffic, the return traffic is allowed also, you do not need to create an egress rule for that 

solutions that support network policies:
- kube router
- calico 
- Romana
- weave-net


first lets talk about all the network connections (north to south || ingress to egress ) required for a 3 tiered application

web
- ingress: 80
- egress 5000

api 
- ingress 5000
- egress 3306

database
- ingress 3306
- egress 5000


Network Security
- we have different nodes with pods running on each of them

k8s is configured by default with an all allow rule that allows traffic from any pod other pod or services within the cluster

example of when you would implement a network policy
- you have allowed communication to flow between all three tiers of a deployment but your security team says that you need to block traffic from the web server to the database server
- this is when you would implement a network policy


How to link network policies to pods?
- labels and selectors 


```
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-policy

spec:
  podSelector:
    matchLabels:
      role: db
  policyTypes:
  - Ingress 
  ingress:
  - from:
    - podSelector:
        matchLabels:
          name: api-pod 
    ports:
    - protocol: TCP
      port: 3306

```

## Developing Network Policies 

the different pieces of a network policy 
- policyTypes: tell the direction of traffic that the policy applies to 
    options:
      - ingress
      - egress 
- ingress: if the policyType is ingress, this field will specify the configuration of the ingress rule 
    - has a subfield of from:
        options:
          - podSelector
          - namespaceSelector
          - ipBlock 
- ports: tells what ports to allow through the network policy
    options:
     - 
Architecture:
    - web tier pods
    - api tier pods
    - db tier pods 

goal: DB pod can only allow traffic form the API pods 
    1st step: deny all traffic to the DB pod 

```
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-policy
  namespace: prod # this is in the prod namespace
spec:
  podSelector:
    matchLabels:
      role: db 
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          name: api-pod 
      namespaceSelector: # this allows ingress traffic from the staging api-pod 
        matchLabels:
          name: staging 
    ports:
    - protocol: TCP
      port: 3306
```

### What if you have multiple api-pods running in different namespaces
- add the namespaceSelector field 

```
ingress:
- from:
  - podSelector:
      name: api-pod 
    namespaceSelector:
      matchLabels:
        name: staging 
  ports:
  - protocol: TCP
    port: 3306
```

 ### What if you need to allow traffic that is not in the k8s cluster?
- add the ipBlock field 

```
ingress:
- from:
  - podSelector:
      name: api-pod 
    namespaceSelector:
      matchLabels:
        name: staging 
  ports:
  - protocol: TCP
    port: 3306
  
  - ipBlock:
      cidr: 192.168.5.10
```


### How traffic rules are processed?
- the different traffic rules can be looked at with AND / OR logic. lets look at some scenarios 

rule processing:
- pod has label of api 
AND 
- pod is namespace staging
```
- from:
  - podSelector:
      name: api
    namespaceSelector:
      matchLabels:
        name: staging 
```

rule processing:
- pod has label of api 
OR 
- pod is in staging namespace

```
- from:
  - podSelector:
      name: api
  - namespaceSelector:
      matchLabels:
        name: staging 
```

rule processing:
- pod has label api 
AND 
- pod is in staging namespace

OR 
- ip addr is from 10.10.0.0/24
```
- from:
  - podSelector:
      name: api
    namespaceSelector:
      matchLabels:
        name: staging 
  - ipBlock:
      cidr: 10.10.0.0/24
```


### Egress rules 
what if we want to allow the db agent on the pod to reach out to the backup server?
- we can add an egress block under ingress
```
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-policy
  namespace: prod # this is in the prod namespace
spec:
  podSelector:
    matchLabels:
      role: db 
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          name: api-pod 
      namespaceSelector: # this allows ingress traffic from the staging api-pod 
        matchLabels:
          name: staging 
    ports:
    - protocol: TCP
      port: 3306
  egress: # add the egress block
  - to:
    - ipBlock:
        cidr: 192.168.1.0/24
    ports:
    - protocol: TCP
      port: 80

```

### what if you want to add multiple egress or ingress rules?

each new rule begins with another - from: (ingress) or - to: (egress)

ex for ingress 
```
spec:
  podSelector:
    matchLabels:
      name: pod
  policyType: 
  - Ingress
  ingress:
  - from: 
     ...
     ...
     ...
  - from: 
     ...
     ...
     ...

```


# Ingress Controllers + Resources
- k8s clusters don't have an ingress controller by default 
- Ingress: object that manages external access to the services in a cluster
    - provides load balancing, SSL termiantionm and name-based virtual hosting 
    - think of ingress as a layer 7 load balancer (like AWS ALB )
    - you still have to publish ingress to the public (one time configuration)
- gives a single, externally accessible URL that you can configure to route to different services based on the URL path 


supported solutions: nginx, haproxy, traefik

- the solution that you deploy is called the ingress controller
- the configuration of the backend is called the Ingress resources
    - resources are created with definition files 
    

### How to deploy ingress controller 
    - nginx 
    - contour
    - haproxy
    - traefik
    - istio 

### steps for creating an ingress controller
1. create the ingress controller as a deployment type object 
2. create a config map in order to feed the configuration data to your ingress controller
3. create a service to expose the ingress controller to the outside world
4. create a service account that has the correct permissions


### ingress resource 
- set of rules and configurations that is set on the ingress controller
  - allows you to setup routing rules, etc.

ingress resourec is created with a kubernetes yaml file 

```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: ingress-resource
spec:
  backend:
    serviceName: wear-service
    servicePort: 80
```

### Ingress Resource - Rules 
- create the rules when you need to specify where to route your traffic
example:
  - route to myonlinestore.com
  - route to wear.myonlinestore.com
  - route to watch.myonlinestore.com 
  - everything else 

you create different pods that will be different micro services to handle each specific url 
- /returns -> routes you to a set of pods 
- /support -> routes you to a set of pods 
- /login -> routes you to a set of pods


Configuring rules for the ingress resource 

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata: 
  name: ingress-router-rules

spec:
  rules: 
  - http:
      paths:
      - path: /login
        pathType: Prefix
        backend:
          service:
            name: login-service
            port:
              number: 80
      - path: /watch
        pathType: Prefix
        backend:
          service:
            name: watch-service
            port:
              number: 80
```

Configuring rules for multiple domain names

```
apiVersion: 
kind: Ingress
metadata:
  name: ingress-domain-names

spec:
  rules:
  - host: azure.test.com
    http:
      paths:
      - backend:
          serviceName: wear-service
          servicePort: 80
  - host: aws.test.com
    http:
      paths:
      - backend:
          serviceName: aws-service
          servicePort: 80
```

### useful ingress commands 

- search for ingress resources 
``` kubectl get ingress ```

- replace an existing configuration 
``` kubectl get ingress $name -o yaml > config.yml ```
``` kubectl replace -f config.yml ```
