# Api Versions and Api deprecations 

Version Name:
    - alpha: not enabled by default, may have bugs, no commitment to support, mostly for expert users
    - beta: ex: v1beta1, enabled by default, commitment to complete the feature and move to GA 
    - GA (stable): moves to just v1, has conformance tests, highly reliable, supported in the future

Preferred Version: this is the api that is going to be used when you run a command to query the cluster
Storage version: version in which the object is stored in ETCD 


## Api deprecations 
api Group lifecycle 
1. API elements may only be removed by incrementing the API group
2. API objects must be able to round trip between API version in a given release without information loss 
    ex: v1alpha1 has a spec field for type, in v1alpha2 we add a spec field for duration, when we go back to v1alpha1 we must bring the duration field also
3. API version in a given track may not be deprecated until a new API version atleast as stable is released
    - ex: a v2alpha1 version cannot deprecate a v1 version
4a. other than the most recent API versions in each track, older API versions must be supported after their announced deprecation for a duration of:
    - GA: 12 months or 3 releases
    - Beta: 9 months or 3 releases
    - Alpha: 0 releases

## How to view the API group of a resource
- kubectl explain <resource>

## How to view the preferred version of an API group
- start a kubectl proxy session
- curl http://localhost:8001/apis/<resource>

example: curl http://localhost:8001/apis/authorization.k8s.io

## how to add an API version to the kube-api server 
1. take a backup of the kube-api server configuration 
``` cp /etc/kubernetes/manifests/kube-apiserver.yaml /root/kube-apiserver.yaml.backup ```
2. add th configuration to the file under the command section 
``` --runtime-config=rbac.authorization.k8s.io/v1aplha1 ```


## kubectl convert 
when an old api version is removed, we need to update our manifests
- use kubectl convert when you need to update your manifest files
- this is a plugin that you have to install 
``` kubectl convert -f nginx.yaml --output-version apps/v1 ```