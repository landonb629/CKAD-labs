a. create a configMap, then create a script to echo the config map to a location on an ephemeral volume 

b. create a config map with one value, set that value equal to an environment variable in a pod, exec into the pod and view the data

c. create a configMap with the following as data, using an nginx container, map the config map to /usr/share/nginx/html, expose the pod with a service and view the custom html 

```
index.html: | 
    <h1>Hello from configMap</h1>
```


d. create a service account called pod-reader, assign permissions to this pod that allows it to read pods in the cluster. mount this service account to a pod using the nginx image. verify that your service account has access to get pods with the can-i command

e. create a deployment using the nginx image, there should be a security context configuration added with the runAsUser = 2000, add 3 replicas.
    - go into one of the pods with
        ``` kubectl exec $podname -i -t -- /bin/bash ```
    - run the following command 
        ``` ps -aux ```
    if you see the processes running as user 2000. you did the lab correctly

f. create a new namespace called limited-dev, create a resource quota where the cpu and memory limits cannot exceed 1 cpu and 1Gi memory, and the cpu and memory requests cannot exceed 1 CPU and 1 memory
    - create a pod with a resource request for 1050Mi memory and 1050 cpu, if this fails, you completed the lab correctly

g. create a new private key, create a certificate signing request, add the new user to the kubeconfig, create a role that allows this user to get pods a namespace called development, switch contexts to this user and list the pods

