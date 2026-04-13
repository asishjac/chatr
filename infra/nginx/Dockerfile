FROM nginx:alpine

RUN apk add --no-cache openssl

# Generate self-signed certificate for *.chatr.local
RUN mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/chatr.key \
    -out /etc/nginx/ssl/chatr.crt \
    -subj "/C=US/ST=State/L=City/O=Chatr/OU=Dev/CN=*.chatr.local"

COPY nginx.conf /etc/nginx/conf.d/default.conf
