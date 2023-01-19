1. create an ingress controller
2. create an ingress resource
3. create a config map 
4. create a service account 
5. create a service for your ingress controller to route to 



walkthrough on creating an ingress controller

- the ingress controller is going to need a config map 
``` kubectl create configmap nginx-configuration ```
    - this config map is where you will put any configurations for the customization of nginx
    - this can be blank at first 

- a service account is required for an ingress controller
``` kubectl create serviceaccount ingress-serviceaccount ```

- roles will need to be created for the service account 
    - IDK how to do that yet

- now we are going to deploy the ingress controller
    - ingress controller is in the form of a deployment resource

- now lets create a service that will make the ingress available to external users

Breaking down the configuration needed to create an ingress controller 

- first piece of the configuration
    - stating that this will be a deployment
    - stating that we want one pod to be deployed 
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-ingress-controller

spec:
  replicas: 1
  selector:
    matchLabels:
      name: nginx-ingress
```
- configuring the template for the ingress controller
    - creating the ingress controller out of the correct image 

```
  template:
    metadata:
      labels:
        name: nginx-ingress
    spec:
      containers:
        - name: nginx-ingress-controller
          image: quay.io/kubernetes-ingress-controller/nginx-ingress-controller:0.21.0
```
- here we are passing along the arguments for the configuration map to be added to the ingress controller
```
       args:
         - /nginx-ingress-controller
         - --configmap=${POD_NAMESPACE}/nginx-configuration 
```
- nginx service will use these environment variables to read data about the pod from within the pod, specifically the namespace and the pod name 
```
       env:
         - name: POD_NAME
           valueFrom:
             fieldRef:
               fieldPath: metadata.name
         - name: POD_NAMESPACE
           valueFrom:
             fieldRef:
               fieldPath: metadata.namespace
```
- specify the ports that the ingress needs to expose 
```
      ports:
        - name: http
          containerPort: 80
        - name: https:
          containerPort: 443
```
           