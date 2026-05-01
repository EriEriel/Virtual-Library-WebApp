---
id: "learn: Deployment"
aliases: []
tags:
  - learn
  - deployment
  - vps
---

2026-05-01 Init 21:23

## what is it
Deployment of **Terminal_Shelf** on Hetzner VPS via docker, live URL at [Terminal_Shelf](https://195.201.149.64.sslip.io/)

## how it works
1. **Supabase** Set up data base by connection string on `.env` file, use direct URL (Port 5432) for DB migration and Transection Pooler (Port 6543) for runtime:
   - Since Supabase need baseline for migration and Terminal_Shelf old DB doesn't have any data on it so this will be clean to just wipe out all schema and table then migrate from 0
   Supabase SQL Editor:
```sql
    DROP SCHEMA public CASCADE; 
    CREATE SCHEMA public;
```
  Then run migration:
```bash
  export DATABASE_URL="project-supabase-connection-string"
  npx prisma migrate deploy 
```

2. **OAuth Github and Google** For the domain name I use `https://195.201.149.64.sslip.io/`, `sslip.io` is free DNS domain working by just putting IP on it, Zero set up, work perfectly with SSL and https certification via Caddy, so for the OAuth just set new callback URL to: `https://195.201.149.64.sslip.io/api/auth/callback/github` and `https://195.201.149.64.sslip.io/api/auth/callback/google`

3. **VPS setup (Hetzber)** Set up server Ubuntu 24.04 (CX23), Nuremberg Germany for the best price, Copy both IPv4 and IPv6 of the server.
    - Setup firewalls for server with port 22(SSH), 80(http), 443(https), TCP protocol on both IPv4 and IPv6 
    - Setup SSH key for Hetzner VPS
    ```bash
      ssh-keygen -t ed25519 -C "my@email.com"
    ```
      * Separate SSH key name cleanly at `/home/eri/.ssh/id_ed25519_hetzner`, Then getting the key and fill SSH key on Hetzner console:
      ```bash
        cat ~/.ssh/id_ed25519_hetzner.pub
      ```
    - Login to VPS server with:
    ```bash
      ssh -i ~/.ssh/id_ed25519_hetzner root@195.201.149.64
    ```
      `195.201.149.64` is a IPv4 of the VPS server
    - Install docker on VPS server
      ```bash
      curl -fsSL https://get.docker.com | sh
      ```
    - **(Optional)** Install neovim for text editing instead of using nano:
      ```bash
      sudo apt install neovim -y
      ```

4. **Deployment** 
    - Clone project repo from Github to to VPS server:
    ```bash
    git clone https://github.com/EriEriel/Terminal_Shelf-WebApp && cd Terminal_Shelf-WebApp 
    ```
    - Create `.env` file and fill it with environment variable from project source code on local PC:
    ```bash
    nvim .env
    ```
    - Create `Caddyfile` and set it up for free SSL certificate via Let's Encrypt:
    ```bash
    nvim Caddyfile
    ```

    In `Caddyfile` file:
    ```
    https://195.201.149.64.sslip.io/ {
        reverse_proxy localhost:3000
    }
    ```

    - Lunch the App:
    ```bash
    docker compose up -d --build
    ```

5. **Verification**
    - Check the live URL [Terminal_Shelf](https://195.201.149.64.sslip.io/)
    - Test authentication
    - Test core CRUD feature

## gotchas
- At first I was used DuckDNS for free sub-domain but it has issue reliable issue with Let's Encrypt so I switch to `sslip.io` 

## links
[Terminal_Shelf](https://195.201.149.64.sslip.io/)
[[virtaul-shelf]]
