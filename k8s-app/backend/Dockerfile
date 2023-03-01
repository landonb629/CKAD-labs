FROM node 

WORKDIR /usr/src/app 
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm install 
COPY . /usr/src/app/
EXPOSE 3031 
ENTRYPOINT [ "npm", "start" ]


