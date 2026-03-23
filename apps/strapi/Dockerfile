FROM node:18-slim

ENV NODE_ENV=production

WORKDIR /opt/
COPY package.json ./
RUN npm install
ENV PATH=/opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY . .
RUN chown -R node:node /opt/app
USER node
RUN ["npm", "run", "build"]
EXPOSE 1337
CMD ["npm", "run", "start"]
