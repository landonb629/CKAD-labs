// create a helm chart that will replicate a practice test scenario
# Practice test 
1. list all the namespaces in the cluster 
 
2. create an nginx pod from the command line with the label of "env=dev,tier=frontend"

3. in the namespace "networked", there are two deployments (frontend, backend) the backend deployment should only be able to send outbound requests to the frontend deployment. create a network policy that allows the backend deployment to send outbound traffic to the frontend deployment only, and allows all DNS traffic (port 53)



1. create a job that runs 3 jobs in parallel and completes 9 times, the job should run the busy box image and echo "job ran", the job should be named q1-echo 