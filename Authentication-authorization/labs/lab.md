# Lab 

- use the kubectl proxy command 
- query the core api Group
    ``` curl http://localhost:8001/api/v1 ```
- query the named groups, find the deployment api information
    ``` curl http://localhost:8001/api/apps/v1 ```


1. create a new namespace called developer namespace
2. add a user to your minikube cluster using certificates called dev-user
3. create a new role called developer role, this role should be able to get, create, list, and delete pods
4. create a role binding for the developer role, and bind to the dev-user


How to generate a certificate?

 ``` mkdir certs && cd certs ```
 ``` openssl genrsa -out dev.key 2048 ``` 
 ``` openssl req -new -key dev.key -out dev.csr -subj "/CN=dev/O=group1" ```
 ``` openssl x509 -req -in dev.csr -CA ~/.minikube/ca.crt -CAkey ~/.minikube/ca.key -CAcreateserial -out dev.crt -days 500 ```
 