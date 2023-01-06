# lab 
1. Create a service account 
2. generate a token for that servie account 
3. create an ubuntu image that uses that service account


## how to 
```kubectl create serviceaccount testing-sa```

```kubectl create token testing-sa```

```kubectl apply -f ubuntu-pod.yml```

## check 
```kubectl describe pod ubuntu | grep Service ```