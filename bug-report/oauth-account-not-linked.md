---
id: oauth-account-not-linked
aliases: []
tags: []
---

# bug: oauth-account-not-linked
2026-04-02

## OAuthAccountNotLinked — Auth.js Provider Conflict

## Problem
When a user signed in with Google using email `user@gmail.com`, 
then tried to sign in with GitHub using the same email, Auth.js 
threw an `OAuthAccountNotLinked` error and blocked the sign in.

Auth.js does this by default as a security measure — it won't 
automatically link two OAuth providers to the same account without 
explicit confirmation.

## Investigation
Traced the error to Auth.js's default behavior of treating each 
provider as a separate identity even when emails match. The error 
surfaces as a redirect to `/api/auth/error?error=OAuthAccountNotLinked`.

## Fix
Added `allowDangerousEmailAccountLinking: true` to each OAuth 
provider config in `auth.ts`:
```ts
providers: [
  GitHub({
    allowDangerousEmailAccountLinking: true,
  }),
  Google({
    allowDangerousEmailAccountLinking: true,
  }),
]
```

## Tradeoff
The `Dangerous` in the name is intentional — this assumes you trust 
that the email provider has verified ownership. Acceptable for a 
personal project, but production apps should implement a manual 
account linking flow instead.
