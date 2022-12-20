How to inject secrets into your pods 
1. create a new secret with an encoded value 
2. create a pod that uses your secret 
3. exec into your pod 
``` kubect exec --stdin --tty ubuntu-secret /bin/bash ```
4. echo out the name of your secret variable and you will see it 


