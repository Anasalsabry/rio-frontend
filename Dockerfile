FROM node:16-alpine

WORKDIR /app/frontend

COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile --non-interactive --production=false

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
