FROM --platform=linux/x86_64 node:16-alpine 

WORKDIR /usr/src/frontend

COPY package-lock.json package.json /usr/src/frontend/ 

RUN npm install  

COPY . . 

EXPOSE 3000

#NTRYPOINT ["npm", "start"]