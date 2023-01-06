# lab excercise 
You need to create an ubuntu Pod, with a resource limit
1. Memory limit: 50Mi
2. Cpu limit: .5 CPU



Check completetion: 

run the following command to make sure your pod is up and running 

```kubectl get pods```

to check if your resource limits were set correctly, run the following 

```kubectl describe pod resourcelimitubuntu | grep -A 2 Limits```