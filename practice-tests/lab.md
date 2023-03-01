# Lightning Lab 1
- create a pv called log-volume using the storageClass manual, using storage class manual, use ReadWriteMany, have a size of 1Gi, should use the hostPath of /opt/volume/nginx
- create a pvc called log-claim requesting a minimum of 200Mi, should bind to log-volume
- mount this PVC into a pod called logger at the location /var/www/nginx



# Mock exam 2 
- create a deployment that is exposed with a service of type nodeport SERVICES + DEPLOYMENTS
- add a taint to a node in the cluster, create a pod with that toleration TAINTS AND TOLERATIONS
- apply a label to a node, create a deployment with nodeaffinity for that NODE AFFINITY
- create an ingress resource, to for host "foo.bar.com" on port 30092 INGRESS 
- create a job that has a backofflimit, completion amount, restart policy set to never JOBS
- create a readiness probe for a pod that checks an HTTP path of /path with the port of 8080 READINESS PROBE
- create a liveness probe that checks for a file at /var/www/html/live and restarts after 60 seconds LIVENESS PROBE
- create a multicontainer pod where two contianers take in environment variable values MULTI-CONTAINER PODS AND ENVIRONMENT VARIABLES