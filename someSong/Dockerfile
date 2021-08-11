FROM node:erbium-alpine3.11
LABEL test="test"
ARG AUTH_TOKEN		
WORKDIR /node/app
COPY package.json .		
COPY src ./src		
COPY tsconfig.json .
USER naor
RUN yarn && yarn run build		
CMD [ "node", "build/index.js"]
