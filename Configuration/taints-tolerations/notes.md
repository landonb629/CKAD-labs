Create a taint on the nodes with a key of app and a value of bigMemory, with an effect of NoSchedule 
```kubectl taint nodes node01 app=bigMemory:NoSchedule```


How to setup this lab if you are running on minikube 
- minikube delete -f minikube 
- minikube start --nodes 2 
This is how you can replicate having multiple nodes with minikube

LAB
- taint the second node in your minikube cluster with the key of "color" and the value of "blue" and an effect of NoSchedule
- create an pod using the nginx image called "blue" with the tolerations "color=blue"
- create an pod using the nginx image called "red" with no tolerations 

Note: make sure that you are 


answer:
- taint the node 
``` kubectl taint node $name color=blue:NoSchedule```
- create a pod called blue 
- create a pod called red


run the follow command on the pods and see where they were placed 
``` kubectl describe pod blue | grep Node ```
- you will see that the blue pod is running on the node that we tainted