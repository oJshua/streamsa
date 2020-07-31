FROM node

RUN npm install -g nodemon

WORKDIR /app
COPY ./package.json .
COPY ./package-lock.json .
COPY ./tsconfig.json .
RUN npm install

CMD ["npm", "run-script", "dev"]
