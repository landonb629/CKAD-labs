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
    - example: nginx, HA proxy, istio

Ingress resources cannot work without an ingress controller, ingress controllers act as a load balancer for your ingress resources.

# best resource I have found yet to talk about ingress
 - https://medium.com/@Oskarr3/setting-up-ingress-on-minikube-6ae825e98f82#:~:text=In%20order%20for%20the%20Ingress,have%20an%20Ingress%20controller%20running.


Ingress Resource: 
    - configuration object for an ingress controller
    - configures how objects are routed to

