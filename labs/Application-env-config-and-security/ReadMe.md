a. create a configmap with a key of index.html, and a value of "hello from config map". mount the config map in a deployment with 3 replicas using the nginx image, mount the config map to the path /usr/share/nginx/html, create a nodeport service for the deployment and view the html page in your browser

NOTE: to view the service on minikube you can use "minikube service --url $name"

b. create a secret called secret1 with these values, "user=test" "pass=word". create another secret called secret2 with the value "second=secret". create a deployment with two environment variables called SECRET_USER and SECRET_PASS, these variables should map to the values from secret1. mount secret2 to the /tmp/secret/ as a volume in the deployment

c. create a namespace called limited, create a resource quota in that namespace that limits to 500M CPU, 500Mi memory, and 8 pods. create a deployment with 5 replicas that requests half of the namespaces CPU and memory limits, and has a limit of 500Mi and 500M cpu. add a security context to the containers that sets privileged to false and allowPrivilegeEscalation to false.


d. create a new private key, create a certificate signing request, add the new user to the kubeconfig, create a role that allows this user to get pods a namespace called development, switch contexts to this user and list the pods

    NOTE: make sure that your CN matches the name of your new user

    steps to create a private key, and certificate signing request
    
    ```
    openssl genrsa -out newkey.key 2048 
    ```

    ``` 
    openssl req -new -key newkey.key -out newkey.csr -subj "CN=nameofuser"
    ```





