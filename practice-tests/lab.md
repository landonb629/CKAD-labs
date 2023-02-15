# Lightning Lab 1
- create a pv called log-volume using the storageClass manual, using storage class manual, use ReadWriteMany, have a size of 1Gi, should use the hostPath of /opt/volume/nginx
- create a pvc called log-claim requesting a minimum of 200Mi, should bind to log-volume
- mount this PVC into a pod called logger at the location /var/www/nginx





apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deploy

spec:
  replicas: 4
  selector:
    matchLabels:
      app: nginx
  strategy:
    type: RollingUpdate
      maxUnavailable: 2
      maxSurge: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      container:
        - name: nginx
          image: nginx:1.16