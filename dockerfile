FROM mcr.microsoft.com/playwright:v1.52.0

WORKDIR /tests

COPY package.json package-lock.json ./
RUN npm install

COPY . .

CMD ["npx", "playwright", "test", "--project=firefox"]
