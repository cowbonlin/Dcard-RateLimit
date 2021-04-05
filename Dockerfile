FROM node:14
ENV TZ=Asia/Taipei

WORKDIR /src
COPY package*.json ./
RUN npm install

EXPOSE 3000