# Fira Medieval d'Hostalric

Aquest repositori conté la plataforma web de la Fira Medieval d'Hostalric, integrada amb un backend en **Laravel** i un frontend en **React (Vite)**.

## Estructura del projecte

- `/firaMedieval_server`: backend API (Laravel, PHP)
- `/firaMedieval_client`: frontend SPA (React, Tailwind CSS i Zod)
- `docker-compose.yml`: configuració de l'entorn virtualitzat.

## Requisits previs

Abans de començar, assegureu-vos de tenir instal·lat:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) o Docker Engine + Docker Compose.
- Git

## Com desplegar el projecte (localment)

El desplegament està automatizat mitjançant Docker. Caldrà que executeu les comandes següents:

### 1. Clonar el repositori

```bash
git clone [https://github.com/souhailaezzarfi/FiraMedieval.git](https://github.com/souhailaezzarfi/FiraMedieval.git)
cd FiraMedieval
```

### 2. Aixecar l'entorn

```bash
docker compose up -d --build
```

Executant aquesta comanda, es crearà el fitxer `.env` del backend (si no existeix), s'instal·laran les dependències de Composer, la clau de Laravel, i quan la base de dades estigui a punt, executarà les migracions i s'aixecaran els servidors de React i Laravel.

## Accés a l'aplicació

Espereu uns 30 segons a que iniciï la aplicació i accediu a:

- **Frontend (React):** [http://localhost:5173](http://localhost:5173)
- **Backend API (Laravel):** [http://localhost:8000](http://localhost:8000)
- **Base de dades (MySQL):** Accessible des del port 3306 (Usuari: fira_user, Pass: fira_pass).

## Gestió de l'entorn

**Veure els logs del backend i frontend (en temps real):**

```bash
docker compose logs -f
```

**Aturar els contenidors temporalment:**

```bash
docker compose stop
```

**Destruir els contenidors:**

```bash
docker compose down
```

**Destruir l'entorn complet i esborrar la base de dades:**

```bash
docker compose down -v
```
