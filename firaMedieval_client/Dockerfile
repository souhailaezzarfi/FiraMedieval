FROM node:22-alpine

# Establir el directori de treball
WORKDIR /app

# Instal·lar dependències
COPY package*.json ./
RUN npm install

# Exposar el port de Vite
EXPOSE 5173

# Executar Vite
CMD ["npm", "run", "dev", "--", "--host"]