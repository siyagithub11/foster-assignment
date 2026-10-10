# CRM Backend (Node.js + Express + MongoDB + JWT)

REST API for a simple CRM where counselors can see public enquiries and claim them.

## Business flow

1. Counselors register / log in with their email (JWT based).
2. Prospective clients submit the enquiry form through a **public** endpoint (no auth).
3. Every enquiry starts as **public** (`claimedBy: null`) and is visible to all counselors.
4. A counselor **claims** an enquiry. It becomes **private**: `claimedBy` is set to that counselor and it disappears from everyone else's unclaimed list.

## Tech

Express, Mongoose (MongoDB), jsonwebtoken, bcryptjs, dotenv, cors.

## Setup

```bash
cd backend
npm install
cp .env.example .env     # then edit values (on Windows: copy .env.example .env)
npm start                # or: npm run dev
```

`.env`

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/crm
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=1d
```

`MONGO_URI` can also be a MongoDB Atlas connection string.

## Folder structure

```
src/
  config/db.js
  controllers/   auth.controller.js, enquiry.controller.js
  middleware/    auth.js (JWT), error.js
  models/        Employee.js, Enquiry.js
  routes/        auth.routes.js, public.routes.js, enquiry.routes.js
  app.js
  server.js
```

## API

Base URL: `http://localhost:5000`

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| POST | `/api/auth/register` | No | Register an employee/counselor |
| POST | `/api/auth/login` | No | Login, returns JWT |
| POST | `/api/public/enquiries` | **No** | Public enquiry form submission |
| GET | `/api/enquiries/unclaimed` | Bearer JWT | All unclaimed (public) enquiries |
| PATCH | `/api/enquiries/:id/claim` | Bearer JWT | Claim an enquiry |
| GET | `/api/enquiries/mine` | Bearer JWT | Enquiries claimed by the logged-in user |

Send the token as `Authorization: Bearer <token>`.

### Examples

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Asha","email":"asha@company.com","password":"secret123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"asha@company.com","password":"secret123"}'

# Public enquiry form (no token)
curl -X POST http://localhost:5000/api/public/enquiries \
  -H "Content-Type: application/json" \
  -d '{"name":"Rahul","email":"rahul@gmail.com","phone":"9876543210","courseInterest":"MBA"}'

# Unclaimed leads
curl http://localhost:5000/api/enquiries/unclaimed -H "Authorization: Bearer <token>"

# Claim a lead
curl -X PATCH http://localhost:5000/api/enquiries/<enquiryId>/claim -H "Authorization: Bearer <token>"

# My claimed leads
curl http://localhost:5000/api/enquiries/mine -H "Authorization: Bearer <token>"
```

### Status codes

- `400` validation error / invalid id
- `401` missing, invalid or expired token, or wrong credentials
- `404` enquiry not found
- `409` email already registered, or enquiry already claimed

## Design notes

- **Claim is atomic**: `findOneAndUpdate({ _id, claimedBy: null }, { claimedBy })`. If two counselors click Claim at the same moment, only one update matches; the other gets `409`.
- The public form ignores any `claimedBy` sent in the body, so a lead can't be created pre-claimed.
- Passwords are hashed with bcrypt and never returned (`select: false`).
- Emails are stored lowercase and the Employee email is unique.