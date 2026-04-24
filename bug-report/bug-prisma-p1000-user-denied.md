---
id: bug-prisma-p1000-user-denied
aliases: []
tags: []
---

# bug: bug-prisma-p1000-user-denied
2026-03-18

## symptom
Can't connect and migrate database to Supabase, Even with correct password Supabase throw P1000 Authentication error. 

## reproduce
1. run `npx prisma migrate dev --name init` while connect to IPv4 wifi with freetier.
 
## suspected cause
- Supabase freetier is incompatible with with IPv4 wifi

## tried
- [x] Transection Pooler and Session Pooler URL not work.
- [ ] Upgrade to Supabase 4$ paid tier.

## fix

## links
[Supabase](https://supabase.com/dashboard/project/xgjrlrgarjtgnitvxkvo)
[[virtaul-shelf]]
