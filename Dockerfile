FROM node:18 AS build
WORKDIR /app

#copy package.json and package-lock.json
COPY package.json package-lock.json ./

#install dependencies
RUN npm install

#copy the rest of the files
COPY . .

#build the app
RUN npm run build

#stage 2: serve the built application with NGINX
FROM nginx:alpine
# Copy the build output from the first stage to NGINX's default HTML location
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default NGINX port
EXPOSE 80

#start NGINX
CMD ["nginx", "-g", "daemon off;"]