Experience PocketTab here: [https://pockettab.vercel.app/](https://pockettab.vercel.app/)

# PocketTab

PocketTab is a web-based expense sharing app that makes it easy to track what you owe and are owed. I wanted to differentiate PocketTab from other similar apps such as Splitwise or Tab by focusing on ease of use and personalized views, reflecting the way I actually manage expenses in a shared living situation.

- **Web-based deployment:** Being fully web-based means there’s no app to download — anyone in your group can access it instantly via a URL, lowering the barrier to adoption.
- **Email OTP login:** Signup and login are consolidated into a single flow using email-based one-time passwords. This eliminates the need for remembering or managing passwords while still keeping access secure.
- **Personalized views:** Instead of a cluttered group-level interface, PocketTab shows only what you personally owe and are owed. This design reflects real-life usage in a shared house, where not everyone keeps their expenses up to date and what matters most is your own balance rather than tracking everyone else’s activity.

The goal behind these decisions was to create an app that is frictionless to use, intuitive, and tailored to individual users’ needs, rather than forcing everyone to engage with a complex group interface.

## Key Features

- **Group Management:** Create groups for any shared expenses, invite members, and track everything in one place.
- **Expense Tracking:** Log expenses quickly and split costs evenly or customize who pays what.
- **Recurring Expenses:** Automatically keeps daily, weekly, or monthly expenses updated with no manual input.
- **Personalized View:** See only what you owe and what you're owed, without unnecessary group-level noise.
- **Responsive Design:** Interfaces that adapt seamlessly across desktop, tablet, and mobile devices.
- **Secure & Effortless:** No passwords required—secure email-based verification simplifies access.

## Tech Stack

- **Frontend:** React, Next.js, TypeScript, Tailwind CSS, shadcn/ui
- **Backend / API:** Next.js API Routes, Supabase Authentication
- **Database:** PostgreSQL with Prisma ORM
- **Deployment:** Vercel
