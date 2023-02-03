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


 steps to creating a new user for your k8s cluster
 1. generate private key with openssl
 ``` openssl genrsa -out dev.key 2048 ``` 
 2. generate a certificate signing request with openssl 
 ``` openssl req -new -key dev.key -out dev.csr -subj "/CN=dev" ```
3. sign the certificate with the keys from your minikube cluster
``` sudo openssl x509 -req -in dev.csr -CA ~/.minikube/profiles/minikube/client.crt -CAkey ~/.minikube/profiles/minikube/client.key -CAcreateserial -out dev.crt -days 500 ```
4. create a role for the namespace of your choosing 
5. create a role binding 
6. k config set-credentials 
7. k config set-context 
8. k config use-context 
9. using the auth can-i command, check if the user has the expected permissions 