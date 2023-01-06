# lab instructions 
1. deploy the starter configuration 
2. add 2 init containers with the busy box image 

export the existing configuration to a new file called init.yml and redeploy with the new containers

lab solution
1. output the current configuration
```
 kubectl apply -f starter.yml
 kubectl get pod initlab -o yaml > init.yml
```

2. add the new configuration above the "containers" instruction
```
initContainers:
  - name: busy1
    image: busybox
    command:
      - sleep
      - "5"
  - name: busy2
    image: busybox
    command: 
      - sleep 
      - "5"
```