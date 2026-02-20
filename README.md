 Requisitos

- Docker
- Docker Compose
- Git

No es necesario instalar Java, Node ni PostgreSQL manualmente.

---

##  Cómo ejecutar el proyecto

### 1️ Clonar el repositorio

```bash
git clone <URL_DEL_REPO>
cd clientes-api


*** Levantar el proyecto
docker compose up --build

Reiniciar

docker compose down -v
docker compose up --build
