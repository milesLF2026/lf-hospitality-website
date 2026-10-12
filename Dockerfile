FROM nginx:1.30-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*

# Non-site files are kept out by .dockerignore; nginx.conf is needed above, so drop its copy here.
COPY . /usr/share/nginx/html/
RUN rm /usr/share/nginx/html/nginx.conf && nginx -t

EXPOSE 8080
