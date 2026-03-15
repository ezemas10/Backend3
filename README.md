# Backend 3 - Entrega Final

Proyecto desarrollado para la entrega final del curso Backend.

El proyecto implementa una API REST para la gestion de Users, Pets y Adoptions, con documentacion Swagger, tests automatizados y containerizacion mediante Docker.

---

# Imagen DockerHub

La imagen del proyecto se encuentra publicada en DockerHub:

https://hub.docker.com/r/ezemas10/entregafinal

Tag utilizado:

ezemas10/entregafinal:1.0.0

---

# Construir la imagen Docker

Para construir la imagen localmente ejecutar:

docker build -t entregafinal .

---

# Descargar la imagen desde DockerHub

docker pull ezemas10/entregafinal:1.0.0

---

# Ejecutar el contenedor

docker run -p 8080:8080 -e MONGO_URL="mongodb+srv://cursobackend:cursobackend@cluster0.fpstjym.mongodb.net/" -e DB_NAME="proyectobackend3" ezemas10/entregafinal:1.0.0

El servidor quedara disponible en:

http://localhost:8080

---

# Documentacion Swagger

La documentacion de la API puede visualizarse en:

http://localhost:8080/documentacion

---

# Endpoints principales

## Adoptions

GET /api/adoptions  
GET /api/adoptions/:aid  
POST /api/adoptions/:uid/:pid  

## Users

GET /api/users  
GET /api/users/:uid  
POST /api/users  
PUT /api/users/:uid  
DELETE /api/users/:uid  

## Pets

GET /api/pets  
POST /api/pets  
PUT /api/pets/:pid  
DELETE /api/pets/:pid  

---

# Tests

El proyecto incluye tests automatizados utilizando Mocha y Chai.

Para ejecutarlos:

npm test