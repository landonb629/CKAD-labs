# Helm 
- when deploying apps, the complexity can quickly rise, example below 
- helm treats your resources as a "package"
- helps us treat our kubernetes apps as actual applicationa and not just a collection of resources 

values.yaml
- these are the values that are supplied to our application files when we run a helm install
- these can be looked at like variable files in terraform

Bringing together multiple k8s resources for a wordpress app 
- deployment for the pods 
- Persistent volume and claim to store the database 
- secrets to hold the admin password 
- a service for exposing


## How to install Helm?
- machines that use snap 
``` snap install helm ```

- apt-based 
    - add the key and repos first then install 

# Helm concepts 
- helm chart: this is a combination of templates for the k8s resources and a values file 
- variables
    - the variables that you are going to pass to your resource declarations will need to be changed 

example: 
- the storage capacity in the persistent volume 

persistent-volumes.yml
```
spec: 
  capacity:
    storage: {{ .Values.storage }}
```

values.yaml 

```
storage: 200Gi
```