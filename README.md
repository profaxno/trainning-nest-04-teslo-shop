<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo
1. Clonar el proyecto
2. Ejecutar ```npm install```
3. Tener Nest CLI instalado ```npm i -g @nestjs/cli```
4. Levantar db ```docker-compose up -d```
5. Clonar el archivo __.env.template__ y renombrar la copia a ```.env```
6. LLenar las variables de entornos definidas en el ```.env```
7. Ejecutar la app en dev: ```npm run start:dev```
8. Reconstruir la base de datos ```localhost:3000/api/seed```