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