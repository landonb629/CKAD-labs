# Custom Resource Definition
Resource - something like a deployment, pod, or stateful set. kube deploys resources
Controller - these are builtin to k8s, they basically watch over your resources and make sure they are in the desired state

- Custom resource definition allows you to define custom resources
    - creating a CRD object creates a new custom resource with a name and schema that you specify
    - kube-apiserver will handle the storage of your custom resource

Custom resource 
```
apiVersion: flights.com/v1
kind: FlightTicket
metadata:
  name: my-flight-ticket
spec:
  from: mumbai
  to: London
  number: 2
```

Custom resource definition 
```
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: flighttickets.flights.com
spec:
  scope: Namespaced
  groups: flights.com 
  names:
    kind: FlightTicket
    singular: flightTickets
    plural: flighttickets
    shortNames: 
      - ft
  versions:
    - name: v1
      served: true
      storage: true
schema: // schema is where we are actually stating what we allow to supply as inputs
  openAPIV3Schema:
    type: object
    properties:
      spec:
        type: object
        properties:
          from:
            type: string
          to: 
            type: string
          number: 
            type: integer
            minimum: 1
            maximum: 10
```

- after you create your custom resource definition, you will be able to store in ETCD
- this resource wont be able to do anything without a custom controller to go along with it 

## Custom Controllers
- should probably be written in GO 
- you declare the desired state of your resource. the kubernetes controller keeps the current state of kubernetes objects in sync with your declared state 


## Operator framework 
