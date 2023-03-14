FROM node

WORKDIR /usr/src/app

COPY package.json package-lock.json /usr/src/app/

RUN npm install 

COPY . /usr/src/app/

EXPOSE 3000

ENTRYPOINT ["npm", "start"]