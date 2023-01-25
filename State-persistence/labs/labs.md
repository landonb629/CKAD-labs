1. create an ubuntu container with a volume mounted to the /opt directory, create a file in that directory, destroy the pod, recreate the pod , attach the volume and see if your file persisted

2. create a Persistent volume and inspect the volume, create a persistent volume claim, create two two different pods that use the same PVC, exec into one of the contianers and create a file, go into the other container and see if the file was created for that container also 

3. create a stateful set for an nginx container, with a headless service, that has a persistent volume claim for each pod 