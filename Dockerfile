# Imagen base oficial de Node
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install --production

# Copiamos todo el código
COPY . .

# Cloud Run usa la variable PORT
ENV PORT=8080

# Exponemos el puerto
EXPOSE 8080

# Comando para iniciar el servidor
CMD ["npm", "start"]
