# CKAD area - Application Environment, Configuration, and Security 

## Understand ConfigMaps 
- used for storing non-confidential configuration data in key-value pairs. 
- can be consumed as env variables, command line args, or as config files in a volume 

- not designed for large chunks of data. if you are storing configs larger than 1Mi, use a volume mount 

using a configmap for configuration data

```
data:
  nginx.config: | 
    server { 
        listen 80;
    }
```


basic config map to pass in environment variables 

```
apiVersion: v1
kind: ConfigMap
metadata:
  name: demoConfigmap

data:
  NODE_ENV: "development"
  MONGODB_URL: "http://localhost:27017"
```


## Understanding secrets 
- configMaps are good for configuration data 
- Secrets are used for passwords, tokens, and other types of private keys 
- secrets are exposed to pods via explicit declaration in pod manifests and the k8s api 

Secrets are not encrypted, they are stored in etcd as plaintext

#### Creating secrets 
- secrets are a collection of data elements (key / value pairs)

#### Consuming secrets 
- you can expose secrets to a pod through a volume mount 
- you can expose secrets to a pod through environment varibles 

the easiest way to create secrets is with the kubectl command 

``` kubectl create secret generic testsecret --from-file=file.txt ``` 
``` kubectl create secret generic testsecret --from-literal=test=data ```

#### Private container registries 
- you can use secrets to store credentials for private container registries 
- these are called image pull secrets 