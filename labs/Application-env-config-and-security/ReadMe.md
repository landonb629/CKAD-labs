a. create a configMap, then create a script to echo the config map to a location on an ephemeral volume 

b. create a config map with one value, set that value equal to an environment variable in a pod, exec into the pod and view the data

c. create a configMap with the following as data, using an nginx container, map the config map to /usr/share/nginx/html, expose the pod with a service and view the custom html 

```
index.html: | 
    <h1>Hello from configMap</h1>
```


d. create a service account called pod-reader, assign permissions to this pod that allows it to read pods in the cluster. mount this service account to a pod using the nginx image. verify that your service account has access to get pods with the can-i command

f. create a deployment using the nginx image, The pod should have all capabilities dropped, and there should be an added security context that does not allow for running as root, add 3 replicas.