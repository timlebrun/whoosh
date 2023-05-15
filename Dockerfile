FROM node:lts-alpine as builder

ARG PORT=80

COPY . .

RUN yarn install
RUN yarn run build

RUN rm -rf ./node_modules
RUN yarn install --production

EXPOSE $PORT

CMD [ "yarn", "run", "start:prod" ]