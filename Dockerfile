FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV ADMIN_USERNAME=default_admin
ENV ADMIN_PASSWORD=default_pass
EXPOSE 3000
CMD ["node", "app.js"]
