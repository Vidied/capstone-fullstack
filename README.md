# Capstone Project - Full-Stack Menu Management App

Gestione di menu, magazzino e ordini per pizzeria/ristorante. Backend Spring Boot + PostgreSQL, frontend React + Vite.

**Stack:** Java 25, Spring Boot 4.1, Spring Security (JWT), Spring Data JPA, PostgreSQL, Maven · React + TypeScript, Vite, Redux Toolkit, React-Bootstrap, Axios

---

## Backend

1. Crea il database:

   ```sql
   CREATE DATABASE capstone;
   ```

2. In `backend/src/main/resources/application.properties`, imposta `spring.datasource.username`/`password` per il tuo PostgreSQL. Le altre credenziali nel file (JWT secret, account admin, porte stampanti) sono valori di test già pronti — nessun `.env` richiesto.

3. Avvia:

   ```bash
   cd backend
   mvn spring-boot:run
   ```

   Su Linux/macOS: `./mvnw spring-boot:run`. `mvnw.cmd` non è incluso: su Windows serve Maven globale, oppure apri il progetto in IntelliJ ed esegui `CapstoneApplication`.

   → `http://localhost:8080`

Al primo avvio i seeder popolano ruoli, account admin, menu demo e un ordine di esempio.

**Login admin:** `admin@restaurant.com` / `AdminPassword123!`

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

→ `http://localhost:5173` (porte 5173-5175 già abilitate nel CORS)

Build di produzione: `npm run build`
