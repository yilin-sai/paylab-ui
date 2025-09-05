# PayLab Mock PSP API

A **mock Payment Service Provider (PSP)** for developers.  
Simulate **PaymentIntents**, **Payments**, and **Webhooks** without needing access to a real PSP.  
Great for **testing**, **learning payment flows**, or **demo projects**.

👉 Live Developer Console, free to use: [https://paylab-ui.vercel.app/](https://paylab-ui.vercel.app/)

> This project is under active development. Feedback and issues welcome via GitHub Issues.

## ✨ Features

- **Payment Intents** – create and track lifecycle.
- **Payments** – simulate `authorised`, `declined`, `captured`, and more.
- **Webhooks** – register endpoints to receive transaction events in real time.
- **API Keys** – free tier, no signup required.
- **Idempotency Key Support** – prevents duplicate PaymentIntents or Payments on retries (just like real PSPs).

## 🚀 Quick Start

### 1. Get an API Key

Go to the [Console](https://paylab-ui.vercel.app/dashboard/apikeys), click **Create API Key**.  
Copy it somewhere safe (you only see it once). You'll need it when making requests to the API.

### 2. Register Webhook

Go to the [Console](https://paylab-ui.vercel.app/dashboard/webhooks), click **Add Webhook** and specify the url and event types you want to subscribe to.

The following steps can also be executed using [PayLab Swagger UI](https://paylab-ui.vercel.app/dashboard/docs).

### 3. Create a PaymentIntent

This will create a Payment Intent, representing your intention to collect 50 USD from your customer.

```bash
curl -X 'POST' \
  'https://paylab-production.up.railway.app/psp/payment-intents/' \
  -H 'accept: application/json' \
  -H 'x-api-key: <api-key>' \
  -H 'Content-Type: application/json' \
  -d '{
  "amount": 5000,
  "currency": "USD"
}'
```

Example Response:

```json
{
  "amount": 5000,
  "currency": "USD",
  "paymentIntentId": "fd26acdc-18aa-4e35-bad4-7eb021cb60c9",
  "status": "requires_payment"
}
```

### 4. Simulate a payment for the payment intent

This will simulate a customer's card payment of 50 USD. The target final payment status is `captured`.

```bash
curl -X 'POST' \
  'https://paylab-production.up.railway.app/psp/payment-intents/<payment-intent-id>/payments' \
  -H 'accept: application/json' \
  -H 'x-api-key: <api-key>' \
  -H 'Content-Type: application/json' \
  -d '{
  "amount": 5000,
  "currency": "USD",
  "method": "card",
  "simulate": {
    "result": "captured"
  }
}'
```

You can simulate any of the following payment results, the API service will transit through all intermediate statuses and send webhook events for each status:
`[ initiated, authorising, authorised, declined, capturing, expired, captured, capture_failed ]`.

### 5. Check Payment Intent Status

```bash
curl -X 'GET' \
  'https://paylab-production.up.railway.app/psp/payment-intents/<payment-intent-id>' \
  -H 'accept: application/json' \
  -H 'x-api-key: <api-key>'
```

Example response:

```json
{
  "amount": 5000,
  "currency": "USD",
  "paymentIntentId": "fd26acdc-18aa-4e35-bad4-7eb021cb60c9",
  "status": "succeeded"
}
```
