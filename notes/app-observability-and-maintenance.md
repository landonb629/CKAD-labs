# Application Observability and Maintenance


## Implement Probes and Healthchecks 
liveness probes: tells k8s when to restart a container 

example: 

```
apiVersion: v1
kind: Pod 
metadata:
  name: testing-liveness
spec:
  containers:
   - name: ping
     image: busybox
     livenessProbe:
       exec:
         command:
       httpGet:
         path:
         port:
         httpHeader:
         - name: CustomHeader
           value: value
       tcpSocket:
         port: 8080
       initialDelaySeconds: 5 
       periodSeconds       
```

Different type of liveness probes?
- command based 
    - runs a command in the container and if the command exits with a 0 code, the pod is considered healthy

- http based 
    - if a success code is returned , pod is considered healthy
    - greater than or equal to 200 and less than 400 indicates a success 
- TCP based 
    - if the probe can establish a connection to the TCP port, the pod is considered healthy
    
readiness probes: tells k8s when a container is ready to start accepting traffic 
    - used to specify when a pod should start serving traffic 
    - readiness probes are configured very similar to the liveness probe, the difference is they are declared with 
    ``` readinessProbe ``` instead of ``` livenessProbe ```

startup probes: tells k8s when a container app has started successfully, these can be used on slow starting containers 
    - if using legacy applications, startup probes are needed to keep from the liveness probe setting the pod as unhealthy 
    - once you setup the startup probe, it will use the probe criteria to check if the application is up yet, if the threshold is reached, then the application will be considered unhealthy
    - your liveness probes will wait for the startup probe to succeed 

Probe Configuration 
``` initialDelaySeconds ```: number of seconds after the container starts before the probe starts 
``` periodSeconds ```: how often to perform the checks 
``` successThreshold ```: minimum consecutive sucesses for the probe to be considered successful 
``` timeoutSeconds ```: number of seconds the probe times out 
``` failureThresholds ```: once a probe fails x amound of times, it is considered unhealthy 