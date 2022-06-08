FROM node:16-alpine
LABEL maintainer="dev@testlio.com"

RUN apk add --update zip

ENV HOME=/home/node

USER node

RUN mkdir -p $HOME/app
WORKDIR $HOME/app

COPY . $HOME/app

RUN npm install && \
    rm -f .npmrc

ENTRYPOINT ["npm"]
CMD ["test"]
