FROM mcr.microsoft.com/playwright:v1.44.1-focal

WORKDIR /tests

COPY package.json package-lock.json ./
RUN npm install

COPY . .

CMD ["npx", "playwright", "test", "--project=firefox", "--headed"]
