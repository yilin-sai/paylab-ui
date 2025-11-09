# PayLab Mock PSP API

A **mock Payment Service Provider (PSP)** for developers.  
Simulate **PaymentIntents**, **Payments**, and **Webhooks** without needing access to a real PSP.  
Great for **testing**, **learning payment flows**, or **demo projects**.

👉 Live Developer Console, free to use: [https://console.paylabo.dev](https://console.paylabo.dev)

> This project is under active development. Feedback and issues welcome via GitHub Issues.

## ✨ Features

- **Payment Intents** – create and track lifecycle.
- **Payments** – simulate `authorised`, `declined`, `captured`, and more.
- **Webhooks** – register endpoints to receive transaction events in real time.
- **API Keys** – free tier, no signup required.
- **Idempotency Key Support** – prevents duplicate PaymentIntents or Payments on retries (just like real PSPs).
- **Configurable Webhooks** — simulates real PSP quirks with per-event webhook settings (custom delay and repeat delivery for each transaction event type).
