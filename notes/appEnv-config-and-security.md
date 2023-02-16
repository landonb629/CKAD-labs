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