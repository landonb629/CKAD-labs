1. create a configMap, then create a script to echo the config map to a location on an ephemeral volume 

2. map a configMap to a volume on a pod, exec into the pod and access the data

3. create a configMap with the following as data, using an nginx container, map the config map to /usr/share/nginx/html, expose the pod with a service and view the custom html 

```
index.html: | 
    <h1>Hello from configMap</h1>
```