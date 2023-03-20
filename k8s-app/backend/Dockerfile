FROM node

WORKDIR /usr/src/app 

COPY package.json . 

COPY package-lock.json .

RUN npm install 

COPY . /usr/src/app/

EXPOSE 3032

ENTRYPOINT ["npm", "start"]
