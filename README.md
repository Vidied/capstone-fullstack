# Capstone Project - Full-Stack Menu Management App

Applicazione web full-stack sviluppata per la gestione completa di un menu e magazzino (ristorazione), realizzata con architettura client-server.

## Tecnologie Utilizzate

### Backend

- **Java 17+** / **Spring Boot**
- **Spring Security** (Autenticazione JWT stateless)
- **Spring Data JPA / Hibernate**
- **PostgreSQL**
- **Maven**

### Frontend

- **React** (con TypeScript)
- **Vite**
- **React-Bootstrap** / **Bootstrap**
- **Redux Toolkit**
- **React Router**

---

## Prerequisiti

Prima di avviare il progetto, assicurati di avere installato sul tuo sistema:

- Java JDK (versione 17 o superiore)
- Node.js (versione 18 o superiore)
- Maven
- Un database PostgreSQL attivo

---

## Configurazione e Avvio

### 1. Configurazione del Backend

1. Spostati nella cartella `backend/`.
2. Configura le credenziali del tuo database all'interno del file `application.properties`.
   > **Nota sulla configurazione (Niente file `.env`? Nessuna dimenticanza!):**
   > Si è scelto deliberatamente di non utilizzare file `.env` o configurazioni a variabili d'ambiente esterne, ma di centralizzare i parametri in `application.properties`. Questa scelta è pensata appositamente per i contesti di valutazione e code review: in questo modo chi corregge il progetto può avviare il backend _subito_, senza il rischio di inciampare in errori dovuti a file di environment mancanti, variabili di sistema non mappate o configurazioni locali errate.
3. Avvia il server Spring Boot eseguendo da terminale:
   ```bash
   mvn spring-boot:run
   ```
