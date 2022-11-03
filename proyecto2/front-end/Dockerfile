FROM node:17-alpine3.14 AS builder
ENV NODE_ENV production
WORKDIR /app
COPY package* .
RUN npm i --production
COPY . .

FROM nginx:1.21.6-alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
