FROM nginx:alpine
RUN apk add --no-cache curl

RUN printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
    return 301 https://app.midos.dev$request_uri;\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
