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

El desplegament està automatitzat mitjançant Docker. Caldrà que executeu les comandes següents:

### 1. Clonar el repositori

```bash
git clone [https://github.com/souhailaezzarfi/FiraMedieval.git](https://github.com/souhailaezzarfi/FiraMedieval.git)
cd FiraMedieval
```

### 2. Configuració de variables d'entorn (.env)

Docker inicialitza automàticament els fitxers `.env` del backend i del frontend a partir dels fitxers `.env.example` respectius durant la primera execució.

Tot i això, caldrà modificar les variables necessàries per a que funcioni l'aplicació correctament, especialment si es voldrà accedir-hi remotament:

**Frontend (`/firaMedieval_client/.env`)**

- **`VITE_API_URL`**: defineix l'endpoint de l'API. Per defecte és `http://localhost:8000/api`. Si s'accedeix des d'un altre host a la xarxa, cal substituir `localhost` per la IP dinàmica/estàtica del servidor.

**Backend (`/firaMedieval_server/.env`)**
conté la configuració base de Laravel. Les variables estructurals que permeten el funcionament del Docker i les polítiques CORS són:

- **`FRONTEND_URL`**: URL de l'aplicació React (`http://localhost:5173`). És necessària per a les polítiques CORS i l'autenticació de Sanctum.
- **`APP_URL`**: URL base on s'exposa l'API (`http://localhost:8000`).

### 3. Aixecar l'entorn

```bash
docker compose up -d --build
```

Executant aquesta comanda, s'instal·laran les dependències de Composer, la clau de Laravel, i quan la base de dades estigui a punt, executarà les migracions i s'aixecaran els servidors de React i Laravel.

### 4. Omplir la base de dades (seeders)

Per defecte, l'entorn automatitzat crea les taules (migracions) però no insereix cap dada per protegir la informació en cas de reinici. Per carregar les dades inicials de prova (usuaris administradors, llistat d'activitats, etc.), executeu la següent comanda un cop l'entorn estigui encès:

```bash
docker compose exec server php artisan db:seed
```

Si en algun moment durant el desenvolupament voleu esborrar tota la base de dades i tornar a generar-la de zero amb les dades dels seeders, utilitzeu:

```bash
docker compose exec server php artisan migrate:fresh --seed
```

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
