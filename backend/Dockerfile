FROM node:12

# Create app directory
WORKDIR /usr/src/app

# RUN mkdir /var/www/planner-api-v0.1/src


COPY ./ /usr/src/app


# Bundle app source

RUN npm install

RUN npm run build

COPY . .

EXPOSE 443

CMD [ "node", "dist/server.js" ]


