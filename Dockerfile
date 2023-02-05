# Step 1
## base image for Step 1: Node 14
FROM node:14 AS builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build


# Step 2
## base image for Step 2: Node 14-alpine(light weight)
FROM node:14-alpine
WORKDIR /app
## Step 1의 builder에서 build된 프로젝트를 가져온다
COPY --from=builder /app ./
## application 실행
EXPOSE 3000

CMD ["yarn", "run", "start:prod"]