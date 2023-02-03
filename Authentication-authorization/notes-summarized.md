# useful commands 
- Creating a user entry in the kubeconfig 
``` kubectl config set-credentials dev --client-certificate=dev.crt --client-key=dev.key ``` 

- set a context entry in kubeconfig 
``` kubectl config set-context dev-context --cluster=minikube --user=dev ```

- switching to the created user 
``` kubectl config use-context dev-context ```

- listing all the kubernetes api resources 
``` kubectl api-resources ```
- querying the kube-api server 
``` kubectl -n kube-system describe po kube-apiserver ```


## Resource templates 

outline of a cluster role 

```
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole 
metadata:

rules:
- apiGroup: []
  resources: []
  verbs: []
```

outline of cluster role binding 

```
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:

subjects:
- kind:
  name:
  apiGroup: rbac.authorization.k8s.io
roleRef:
   kind: ClusterRole
   name: 
   apiGroup: rbac.authorization.k8s.io
```