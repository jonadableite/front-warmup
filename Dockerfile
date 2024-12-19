# Use uma imagem base do Node.js com a versão 20
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos package.json e yarn.lock para o container
COPY package*.json yarn.lock ./

# Instala as dependências do projeto usando yarn
RUN yarn install --frozen-lockfile

# Copia o restante dos arquivos do projeto para o container
COPY . .

# Constrói a aplicação para produção
RUN yarn build

# Define uma nova imagem para a execução da aplicação
FROM node:20-alpine AS runner

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos construídos da imagem builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Expõe a porta que a aplicação irá rodar
EXPOSE 5173

# Define o comando para iniciar a aplicação
CMD ["node", "dist/server.js"]
