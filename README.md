# Capstone Project - Full-Stack Menu Management App

Applicazione web full-stack per la gestione completa di menu, magazzino e ordini di una pizzeria/ristorante, realizzata con architettura client-server.

---

## Tecnologie Utilizzate

### Backend

- **Java 25**
- **Spring Boot 4.1**
- **Spring Security** (autenticazione JWT stateless)
- **Spring Data JPA / Hibernate**
- **PostgreSQL**
- **Maven**

### Frontend

- **React** (con TypeScript)
- **Vite**
- **React-Bootstrap** / **Bootstrap**
- **Redux Toolkit**
- **React Router**
- **Axios**

---

## Prerequisiti

Prima di avviare il progetto, assicurati di avere installato:

- **Java JDK 25** (o superiore)
- **Node.js 18** (o superiore) e **npm**
- **Maven 3.9+** (vedi nota sul wrapper Maven più avanti)
- **PostgreSQL** attivo in locale, con un database chiamato `capstone` già creato

---

## 1. Configurazione del Backend

### 1.1 Crea il database

Il database deve esistere **prima** di avviare il backend (l'app non lo genera da zero). Crealo con `psql` o pgAdmin:

```sql
CREATE DATABASE capstone;
```

Le tabelle verranno create/aggiornate automaticamente da Hibernate all'avvio (`ddl-auto=update`).

### 1.2 Configura le credenziali

Apri il file `backend/src/main/resources/application.properties` e imposta i parametri del tuo PostgreSQL (URL, `username`, `password`):

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/capstone
spring.datasource.username=postgres
spring.datasource.password=YOUR_DB_PASSWORD
```

> **Valori di prova:** i valori presenti nel file (password, `jwt.secret`, account admin e porte delle stampanti) sono credenziali di esempio pensate per l'avvio immediato del progetto, senza bisogno di file `.env`. Vanno cambiate in un contesto reale.

> **Nota sulla configurazione (niente file `.env`? nessuna dimenticanza!):** si è scelto deliberatamente di non utilizzare file `.env` o variabili d'ambiente esterne, ma di centralizzare i parametri in `application.properties`. Questa scelta è pensata per i contesti di valutazione e code review: chi corregge il progetto può avviare il backend _subito_, senza il rischio di inciampare in errori dovuti a file di environment mancanti, variabili di sistema non mappate o configurazioni locali errate.

### 1.3 Avvia il server

Dalla cartella `backend/`:

```bash
mvn spring-boot:run
```

Il backend sarà attivo su **http://localhost:8080**.

> **Nota sul wrapper Maven:** nel repository è presente lo script `mvnw` (Unix/Linux/macOS), utilizzabile con `./mvnw spring-boot:run`. **Su Windows lo script `mvnw.cmd` non è incluso**, quindi in quel caso è necessario avere **Maven installato globalmente** e usare `mvn spring-boot:run`. In alternativa, se si ha Maven a disposizione, si può rigenerare lo script Windows con:
>
> ```bash
> mvn -N wrapper:wrapper -Dtype=only-script
> ```

### 1.4 Dati di seed e account amministratore

Al primo avvio l'applicazione popola automaticamente il database tramite i seeder:

- i ruoli di base (`ROLE_USER`, `ROLE_ADMIN`);
- un utente amministratore;
- un menu dimostrativo (categorie, ingredienti, prodotti) e un ordine di esempio.

Account amministratore creato automaticamente:

| Campo    | Valore                 |
| -------- | ---------------------- |
| Email    | `admin@restaurant.com` |
| Password | `AdminPassword123!`    |

Usa queste credenziali per accedere alle funzionalità di gestione (creazione/modifica di prodotti, categorie, ingredienti e ordini).

---

## 2. Configurazione e Avvio del Frontend

Dalla cartella `frontend/`:

### 2.1 Installa le dipendenze

```bash
npm install
```

### 2.2 Verifica l'URL del backend (opzionale)

L'URL di base delle chiamate HTTP al backend è definito in `frontend/src/api/axiosConfig.ts` ed è impostato di default a `http://localhost:8080`. Se il backend gira su una porta diversa, aggiornalo qui.

### 2.3 Avvia il server di sviluppo

```bash
npm run dev
```

L'applicazione sarà accessibile all'indirizzo mostrato da Vite nel terminale (solitamente **http://localhost:5173**).

> Le porte `5173`, `5174` e `5175` sono già abilitate nel CORS del backend, quindi non serve ulteriore configurazione.

### 2.4 Build di produzione (opzionale)

```bash
npm run build
```

---

## Riepilogo avvio rapido

```bash
# 1) Database
#    Crea il DB "capstone" su PostgreSQL

# 2) Backend
cd backend
mvn spring-boot:run        # su Windows (Maven globale)
# ./mvnw spring-boot:run   # su Linux/macOS
# => http://localhost:8080

# 3) Frontend (in un secondo terminale)
cd frontend
npm install
npm run dev
# => http://localhost:5173
```

Login di prova come amministratore: `admin@restaurant.com` / `AdminPassword123!`
