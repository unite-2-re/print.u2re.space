FROM node:latest
WORKDIR /ADL.U2RE
RUN chown -R node /ADL.U2RE
USER node
COPY package*.json ./
COPY favicon.png ./
COPY vite.config.js ./
COPY tsconfig.json ./
COPY global.d.ts ./
COPY .hintrc ./
COPY .npmrc ./
COPY .eslintrc.json ./
COPY ./index.html ./
COPY ./assets ./assets
#COPY ./externals ./externals
COPY ./https ./https
COPY ./src ./src
COPY ./pwa ./pwa
RUN npm install --include=dev --force
RUN npm ci
RUN npm run build
COPY . ./
COPY ./index ./index
EXPOSE 3000
CMD ["npm", "start"]
