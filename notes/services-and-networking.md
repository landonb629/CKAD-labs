# Services and Networking 

# Use Ingress rules to expose applications 

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

# best resource I have found yet to talk about ingress
 - https://medium.com/@Oskarr3/setting-up-ingress-on-minikube-6ae825e98f82#:~:text=In%20order%20for%20the%20Ingress,have%20an%20Ingress%20controller%20running.


Ingress Resource: 
    - configuration object for an ingress controller
    - configures how objects are routed to


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

