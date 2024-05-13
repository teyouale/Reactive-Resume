FROM node:18

# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"


RUN npm install -g pnpm@9.1.0


WORKDIR /app

COPY . /app

RUN pnpm install 

RUN pnpm run build

EXPOSE 3000

ENV NODE_ENV=production

CMD [ "dumb-init", "npm", "run", "start" ]

