# Stage 1
FROM node:14 as build-step
RUN mkdir -p /app/src
WORKDIR /app/src

COPY package.json /app/src
RUN npm install
COPY . /app/src
RUN npm run build

FROM node:14
RUN mkdir -p /app/edumeapi_gateway
WORKDIR /app/edumeapi_gateway
COPY --from=build-step /app/src/build /app/edumeapi_gateway
COPY package*.json /app/edumeapi_gateway
RUN npm install && npm i -g nodemon 

CMD [ "npm", "run", "run-build" ]
EXPOSE 33001
