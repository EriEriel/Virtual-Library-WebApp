---
id: implement-authentication
aliases: []
tags:
  - #project
  - #authentication
---

# implement-authentication
2026-03-25

## goal
- [x] 2026-03-25 Implememt Authentication with stateless JWT strategy
  - [x] 16:22 Update prisma schema to support new Authentication feature

## approach
  **Make sure that Client and Prisma DB is actually in sync:**
```
    npx prisma migrate dev --name init
    npx prisma generate
```

1. First install NextAuth.js dependency with `npm install next-auth@beta @auth/prisma-adapter`
2. Now to sign the JWT (Secret for Auth.js) `npx auth secret` 
3. Create `auth.js` as second adapter latyer to interact with adapter-pg
4. Create `route.ts` for auth to handling `GET` and `POST` method for authentication
5. We app `AUTH_SECRET` to `.env` for signs JWT cookies to use as verifucation key
  - Create key by run `npx auth secret` if this not generate `AUTH_SECRET` at `.env` than run `openssl rand -base64 32` to get the key
6. Add `user.id` to the token so we can use it with server action to link user with entries

### GitHub OAuth
For the GiHub OAuth go to [Github](https://github.com/) than setting -> developer setting -> OAuth Apps -> New OAuth App and fill the form to get `GITHUB_CLIENT_ID` and github `GITHUB_CLIENT_SECRET` and put them in `.env`

### Google OAuth
For the Google OAuth go to [Google cloud](https://console.cloud.google.com/) than APIs & Services -> OAuth consent -> Choose External(unless Using a one company) -> Fill the form

### Email and Password
1. Install `bcryptjs` for password hashing
```
  npm install bcryptjs
  npm install --save-dev @types/bcryptjs
```

2. Encrypt the user password when they register:
```tsx
  const hashedPassword = await bcrypt.hash(password, 12)
```

## code snippets
### src/auth.js
```ts
// For OAuth providers
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [],
})

// For email and password credentials check
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null

      const user = await prisma.user.findUnique({
        where: { email: credentials.email as string },
      })

      if (!user || !user.password) return null

      const isValid = await bcrypt.compare(
        credentials.password as string,
        user.password
      )

      if (!isValid) return null

      return user
    },
  })
```


### src/app/api/auth/[...nextauth]/route.ts
```ts
// Method to handle authentications
import { handlers } from "@/auth"

export const { GET, POST } = handlers
```

## blockers
2026-03-25
**Solved** 16:29 If schema is updated we can't migrate to new schema if there is any relation in DB that not null need to exist on new schema. 
  To solve in development environment just reset the DB `npx prisma migrate reset`
2026-03-26
**Flagged** 11:46 Prisma7 has compatibility issue with Auth.js when try to authenticate with PrismaAdapter and connect to adapter-pg
  **Solved** 12:13 The fix is to migrate DB to ensure that `user` and `account` exist in new client

## links
[[nextauthjs]]
[[virtaul-shelf]]
