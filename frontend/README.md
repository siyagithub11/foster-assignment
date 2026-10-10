# Fastor Frontend (React + TypeScript + Vite + Tailwind)

Mobile-first implementation of the 4 Figma screens: **Sign Up**, **OTP**, **Home** and **Product detail**.

## Run

```bash
npm install
cp .env.example .env     # optional, defaults to https://staging.fastor.ai
npm run dev              # http://localhost:5173
npm run build            # type-check + production build
```

Open it in a phone-sized viewport (about 375-430px wide) to match the design.

## Flow

1. **Sign Up** (`/signup`): enter a 10 digit number, `POST /v1/pwa/user/register` sends the OTP.
2. **OTP** (`/otp`): 6 boxes (auto-advance, backspace, paste), 30s resend timer, `POST /v1/pwa/user/login`. The staging API accepts the default OTP **123456**. The JWT from `response.data.token` is stored in `localStorage`.
3. **Home** (`/home`): Best Seller strip, 30% off banner and Popular Items from `GET /v1/m/restaurant?city_id=118` (sent with `Authorization: Bearer <token>`).
4. **Product detail** (`/product/:id`): quantity stepper, portion options, Add to cart (cart is kept in context + `localStorage`).

Both auth endpoints use `application/x-www-form-urlencoded` bodies (`phone`, `dial_code`, and `otp` on login).

## Structure

```
src/
  api/         axios client (Bearer interceptor), auth + restaurants calls
  components/  Screen shell, FoodImage (placeholder fallback), icons, route guards
  context/     AuthContext (token), CartContext
  data/        static demo data (best sellers, pizza, portions)
  pages/       SignUp, Otp, Home, ProductDetail
```

- Protected routes redirect to `/signup` without a token; a `401` clears the token.
- The restaurant response is normalised defensively (name, image, rating, cuisines) because its shape isn't documented. If the real field names differ, adjust `src/api/restaurants.ts`.
- Best Seller, banner and product detail use static data (`src/data/demo.ts`) since the provided Postman collection has no API for them. Popular Items come from the restaurant API.
- Some restaurant images returned by the staging API give a 404, so a placeholder is shown for those.

## Images

Photos are loaded from `public/images/` and fall back to an emoji placeholder when missing:

`pizza.png`, `sushi.png`, `curry.png`, `lasagna.png`, `cupcake.png`

Restaurant images come from the API.