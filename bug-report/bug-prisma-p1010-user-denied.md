# bug: Prisma P1010 — user denied access on migration
2026-03-13  #bug #prisma #postgresql #arch

## symptom
```
Error: P1010: User was denied access on the database `(not available)`
```
Appears when running `npx prisma migrate dev --name init`. Connection fails at the authentication or existence level.

## reproduce
1. Set `DATABASE_URL` in `.env` referencing a PostgreSQL user that doesn't exist
2. Run `npx prisma migrate dev --name init`

## suspected cause
The `DATABASE_URL` referenced a user (`johndoe`) that had never been created in PostgreSQL. The server rejected the connection because it had no record of that user.

> Note: SQLite (used in tutorials) requires zero config. PostgreSQL requires the user, database, and permissions to all exist before a connection can succeed.

## tried
- Checked `pg_isready` — service was running fine
- Checked `pg_hba.conf` — auth method was `trust` (passwords ignored; only username + DB need to exist)

## fix

### 1. confirm PostgreSQL is running
```bash
pg_isready
sudo systemctl status postgresql
```

### 2. check existing users and databases
```bash
sudo -u postgres psql -c "\du"    # list users
sudo -u postgres psql -c "\l"     # list databases
```

### 3. create the missing user and database
```sql
CREATE USER johndoe WITH PASSWORD 'yourpassword';
CREATE DATABASE mydb OWNER johndoe;
GRANT ALL PRIVILEGES ON DATABASE mydb TO johndoe;
```

### 4. retry migration
```bash
npx prisma migrate dev --name init
```

---

### bonus: reset a forgotten postgres superuser password
```bash
# 1. Edit pg_hba.conf — change 'peer' to 'trust' for postgres user
# On Arch: sudo nvim /var/lib/postgres/data/pg_hba.conf

# 2. Restart
sudo systemctl restart postgresql

# 3. Login without password and reset
sudo -u postgres psql
ALTER USER postgres WITH PASSWORD 'your_new_password';

# 4. Revert pg_hba.conf back to 'peer', restart again
```

## links
- [[postgresql-cli-cheatsheet]]
- [[prisma]]
- [[nextjs-postgres-prisma-setup-workflow]]
