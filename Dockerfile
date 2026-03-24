FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Run build step if necessary or start dev server
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
