# ---- Base image - order important ----
FROM hmcts/ccd-definition-processor:latest as base

# ----        Runtime image         ----
FROM hmcts/ccd-definition-importer:latest as runtime

RUN apk add --no-cache curl jq zip unzip git
COPY --from=base . .
COPY ./definitions /
COPY ./definitions/ccd-template.xlsx /opt/ccd-definition-processor/data

# ----        To pass through Jenkins pipeline         ----
COPY package.json yarn.lock ./
COPY /definitions /
ADD ./config "/config"
RUN yarn install --production && yarn cache clean
COPY index.js ./
ENV NODE_CONFIG_DIR="/config"
CMD ["yarn", "start"]
EXPOSE 3000
