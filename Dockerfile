FROM node:22

WORKDIR /app

COPY . .

RUN npm install --ignore-scripts

RUN npm install -g @quasar/cli

EXPOSE 9000

CMD ["quasar", "dev", "--host", "0.0.0.0"]