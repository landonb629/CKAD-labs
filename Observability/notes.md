# Observability

POD status 


POD conditions 


- By default, as soon as a container is created, k8s assumes that it is ready to serve user traffic
    - if the application in the container takes a minute to warm up, then users will be served with a "site cannot be reached", we solve this with readiness probes

## Readiness probes 
- ways to tell if our application is actually ready to serve traffic    
    - HTTP Test - send a request to a certain path 
    - TCP test - send a connection request to a specific port 
    - Exec command - running a custom script to make sure that the app is ready for traffic

What happens when you add a readiness probe?
- k8s will use your readiness probe before setting the POD condition to a ready state 

Probe configurations
    Https request 
        ```
            readinessProbe:
              httpGet:
                path:
                port 
        ```
    Port test 
        ```
            readinessProbe:
              tcpSocket:
                port: 3306
        ```
    Exec Command 
        ```
            readinessProbe:
              exec:
                command:
                  - cat
                  - /app/is/ready
        ```

How to configure readiness probes?
```
spec:
  containers:
    - name: webapp
      image: simple-webapp
      ports:
        - containerPort: 8000
      readinessProbe:
        httpGet:
          path: /api/ready
          port: 8000
```

Other options 
  - if you know your app will take a specific amount of time, add the initialDelaySeconds: 10
  - you can tell k8s to probe every 5 seconds with, periodSeconds: 5 
  - the probe will stop after 3 attempts if it fails, to extend that use, failureThreshold: 10

  Example 
    ```
        spec:
          containers:
            - name: nginx
              image: nginx
              readinessProbe:
                httpGet:
                  path: /healthcheck
                  port: 8080
                initialDelaySeconds: 10
                periodSeconds: 5        
                failureThreshold: 10
    ```

## Liveness probes 
- can help with restarting containers if they are encountering an error or bug in their code
- test whether the application in the container is actually healthy 

you have the same options as the readiness probes except, the way to declare is livenessProbe


## Logging 
- Most simple logging functionality for k8s 
How to view the logs running inside a pod 
```
kubectl logs -f $podname
```

How to view logs if you have a multi container pod 
```
kubectl logs -f $podname $containername
```

## Monitoring a k8s cluster

How to monitor resource consumption? node level metrics? pod level metrics?
- k8s does not come with a fully featured monitoring solutions 
- k8s has many solutions available for monitoring 
    - metrics server
    - prometheus 
    - elastic stack 
    - data dog 
    - dynatrace

you can have one metric server per k8s cluster 
- in memory so you can't get historical data 

How are metrics generated
- kubelet 
    - contains a subcomponent called cAdvisor
    - cAdvisor is responsible for retrieving performance metrics from pods and exposing them through kubelet API 

once metric server is deployed 
- kubectl top node - view node metrics
- kubectl top pod - view pod metrics


