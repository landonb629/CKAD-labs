1. create the config map 

kubectl apply -f configmap.yml


2. create the k8s pod 

kubectl apply -f usingconfigmap.yml

docker exec -it $podname /bin/bash 

echo $TEST