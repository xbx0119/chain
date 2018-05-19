FROM node:9.11
COPY . /chain
WORKDIR /chain
RUN npm install
EXPOSE 9999
