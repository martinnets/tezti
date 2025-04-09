# Usa la imagen oficial de Node.js
FROM node:22-bullseye

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de la aplicación
COPY package.json package-lock.json ./
RUN npm install

# Copia el resto del código fuente
COPY . .

# Construir la app Next.js
RUN NEXT_API_SERVICE_URL=https://evaluacion.tezti.com \
    NEXT_PUBLIC_SITE_URL=https://app.tezti.com \
    AUTH_SECRET=$AUTH_SECRET npm run build

# Expone el puerto en el que Next.js corre (usualmente 3000)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
