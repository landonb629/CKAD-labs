FROM node

WORKDIR /usr/src/app 

COPY package.json . 

COPY package-lock.json .

RUN npm install 

COPY . /usr/src/app/

EXPOSE 3031

ENTRYPOINT ["npm", "start"]
