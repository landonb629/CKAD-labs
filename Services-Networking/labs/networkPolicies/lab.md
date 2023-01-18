# Lab 
1. Create a pod that will act as the api layer of the stack. create the application with the ubuntu image
2. create a database layer pod that will be using the postgresql image
3. create a pod that will act as the web layer, ues the nginx image for this pod
3. create a network policy that will allow communications from the api layer to the database layer

confirming that your network policy is correct:
- exec into the web pod and attempt to ping the DB pod 
    - this should not succeed
- exec into the api pod, ping the db pod 
    = this should succeed