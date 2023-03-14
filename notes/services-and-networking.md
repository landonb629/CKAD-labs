# Services and Networking 

# Use Ingress rules to expose applications 

Ingress: exposes services inside the cluster to the outside world over HTTP/S
Ingress Controller: 

Ingress rules: tells ingress how to route requests 

What makes an ingress rule?
- host (optional)
- list of paths 
- backend service: if no rules, all requests are sent to a default backend

Basic setup for ingress rule 

```
apiVersion: networking.k8s.io/v1
kind: Ingress 
metadata:
  name: demo 
spec:
  rules:
  - host: dev.com
    http:
      paths:
        - pathType: Prefix 
          path: "/dev"
          backend:
            service: 
              name: service1
              port:
                number: 80
```

3 Types of Kubernetes Ingress
- NodePort: 
    - maps a container to a port on the host machine 
- LoadBalancer: 
    - load balancer infront of the nodes and app are accessed from the load balancer 
- Ingress Controller: 
    - proxy running in the cluster that is exposed via a nodeport of loadbalancer
    - single configurable entrypoint for all services in the cluster
    - example: nginx, HA proxy, envoy, traefik
- Cluster IP:

Ingress resources cannot work without an ingress controller, ingress controllers act as a load balancer for your ingress resources.

## Types of Ingress

Simple fanout: routes traffic from 1 IP address to more than one service
Name based virtual hosting: routes to multiple hostnames at 1 IP address 



# Demonstrate basic understanding of network policies 

- Network policies work on layer 3 and 4 of the OSI model
- help you specify how pods are allowed to communicate over the network 

- selectors are used to specify which pods the network policy will apply to
- we can also use IP CIDR's when specifying allowed or denied traffic 

Network policies are only effective when using a network plugin
- there must be a controller that is implementing the network policy to have any impact

If you are using minikube, network policies are not supported by default, you can use a simple network policy plugin called calico 

``` minikube start --cni calico ``` 


Ingress vs Egress 
- ingress: traffic incoming to the pod 
- egress: traffic leaving the pod 


pod1 ----> pod2 
     (http)
- pod1 is sending an http request to pod2
    - the request is egress from pod1 
    - the request is ingress to pod2   


By Default:
    - all outbound connections are allowed from a pod
    - all inbound connections are allowed to a pod 
    - network policies are additive, they do not conflict

NOTE: 
 - for connections to be successful, they must be allowed egress from the sender pod, and allowed ingress to the receiver pod
 - if one of the two (ingress or egress) is not permitted, the connection will fail

network policy resource template
 ```
 apiVersion: networking.k8s.io/v1
 kind: NetworkPolicy
 metadata:
   name: 
   namespace:
   labels:
spec:
  podSelector:
    matchLabels:
  policyTypes:
    - Ingress
    - Egress 
  ingress:
    - from:
        - ipBlock:
            cidr:
            except: 
        - namespaceSelector:
            matchLabels:
              project:
        - podSelector:
            matchLabels:
      ports:
        - protocol:
          port:
  egress:
    - to:
        - ipBlock:
            cidr:
      ports:
        - protocol:
          port:
 ```

- podSelector: selects the group of pods where the policy applies 
- policyTypes: Ingress or Egress (or both), tells which type of traffic the policy applies to
- ingress: allows traffic that matches the from and ports section, you can specify an ipBlock, namespaceSelector, or podSelector (or all)
- egress: allows traffic that matches the to and ports section


Default policies 

- ingress deny all 

```
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
spec:
  podSelector: {}
  policyTypes:
  - Ingress
```

- egress deny all 

```
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-egress
spec:
  podSelector: {}
  policyTypes:
  - Egress
```

- ingress allow all 

```
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all-ingress
spec:
  podSelector: {}
  ingress:
  - {}
  policyTypes:
  - Ingress
```

- egress allow all 

```
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all-egress
spec:
  podSelector: {}
  egress:
  - {}
  policyTypes:
  - Egress
```

## Services 
- services allow us to expose our applications to enternal consumers
- services provide load balancer and pod replicas 
- services choose their backend by using label selectors 

Service types: 
- ClusterIp: service is exposed with an internal IP address, cannot be externally routed 
- NodePort: Exposes the service on each nodes IP address on a static port, node port can range from 30000-32767
- LoadBalancer: exposes the service externally using a cloud providers load balancer
- ExternalName: Maps a service to a DNS name

Creating services 

- Imperatively 

- This creates a standalone service
``` kubectl create service clusterip nginx-service --tcp=80:80 ```

- This exposes a specific pod 
``` kubectl expose deployment my-deployment --port=80 --target-port=80 ```

- Declaratively 

```
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
 type: ClusterIp
 selector:
   app: nginx-service
 ports:
 - port: 80
   targetPort: 80
```

Port mapping
- a service defined two different ports:
  - incoming port accepting traffic
  - outgoing port called, target port 

incoming traffic --> port 3000 (service port) --> port 80 (service target port) --> containerPort

port: this is the port that you will direct external clients to
targetPort: this is the backend port that will distribute to your pods

 
