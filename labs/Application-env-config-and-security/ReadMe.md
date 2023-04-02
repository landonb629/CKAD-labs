a. create a configmap with a key of index.html, and a value of "hello from config map". mount the config map in a deployment with 3 replicas using the nginx image, mount the config map to the path /usr/share/nginx/html, create a nodeport service for the deployment and view the html page in your browser

NOTE: to view the service on minikube you can use "minikube service --url $name"


b. create a secret called secret1 with these values, "user=test" "pass=word". create another secret called secret2 with the value "second=secret". create a deployment with two environment variables called SECRET_USER and SECRET_PASS, these variables should map to the values from secret1. mount secret2 to the /tmp/secret/ as a volume in the deployment

c. create a namespace called limited, create a resource quota in that namespace that limits to 500M CPU, 500Mi memory, and 8 pods. create a deployment with 5 replicas that requests half of the namespaces CPU and memory limits, and has a limit of 500Mi and 500M cpu. add a security context to the containers that sets privileged to false and allowPrivilegeEscalation to false.


c. create a service account called pod-reader, assign permissions to this pod that allows it to read pods in the cluster. mount this service account to a pod using the nginx image. verify that your service account has access to get pods with the can-i command

d. create a deployment using the nginx image, there should be a security context configuration added with the runAsUser = 2000, add 3 replicas.
    - go into one of the pods with
        ``` kubectl exec $podname -i -t -- /bin/bash ```
    - run the following command 
        ``` ps -aux ```
    if you see the processes running as user 2000. you did the lab correctly

e. create a new namespace called limited-dev, create a resource quota where the cpu and memory limits cannot exceed 1 cpu and 1Gi memory, and the cpu and memory requests cannot exceed 1 CPU and 1 memory
    - create a pod with a resource request for 1050Mi memory and 1050 cpu, if this fails, you completed the lab correctly

f. create a new private key, create a certificate signing request, add the new user to the kubeconfig, create a role that allows this user to get pods a namespace called development, switch contexts to this user and list the pods



