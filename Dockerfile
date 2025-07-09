FROM --platform=linux/arm64 node:18

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force

RUN npm install

COPY . .

ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

RUN npm run build

EXPOSE 3000

CMD ["/wait-for-it.sh", "db:3306", "--", "npm", "run", "dev"]
