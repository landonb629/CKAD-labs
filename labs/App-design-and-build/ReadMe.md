# Lab 1 - utilize persistent and ephemeral volumes 
1. you will need to create a multi container pod. create a volume called html-volume. create a pod called volume-demo. create a container in the pod using the nginx image called html-host and map the html-volume to /usr/share/nginx/html. create another container in the pod using the ubuntu image called html-source map the log volume to /tmp/. use the following command to "echo 'hello from the source' > /tmp/index.html"

2. create a persistent volume called pv0001 of size 200Mi, mapped to the host location /data, create a persistent volume claim of 5Mi, make it RWX, map the PVC to /tmp/test in the pod
  - in order for this to work on minikube, you must first create a storage class called manual

# Lab 2 - Understand multi-container Pod design patterns 
1. create a multi-continer pod, create two containers in the pod, One called data-pod and the other called exposed-pod. the data-pod should be an ubuntu container that puts a custom index.html file in a directory called "pod-data". the exposed pod should be an nginx image that mounts pod-data to "/usr/share/nginx/html"
    - curl localhost:80 and you should see the custom message 
    - this is because containers that run in the same pod can reference eachother by localhost 


2. use the react application in this directory, create a multi container pod, one pod will be the react app listening on port 3000, create another pod that is nginx, that acts as a proxy to the react app and serves the application on port 80. use the nginx configuration file in the directory


# Lab 3 - Understand jobs and CronJobs 
a. create a cronJob that runs every minute. use the busybox image and print the statement "Hello from k8s cronjob"
  - the cronjob should run 2 jobs at the sametime 
  - the job should have a backoff limit of 5

b. create a job that needs to complete successfully 8 times, and runs 2 in parallel, that uses the busybox image to print "Hello from k8s job"
  - the job should remove itself 15 seconds after completion


# Lab 4 - Define, build, and modify container images 

