
# FortuneOne Voice-First AI Receptionist

This project gives Watty a **voice-first** spa receptionist:

- Customer taps a floating 🎧 button.
- Customer speaks.
- AI listens and replies with voice.
- No need to type or press Send.
- Uses a simple /ai-chat text endpoint under the hood.

## 1. Backend Setup (Render or local)

```bash
cd backend
npm install
cp .env.example .env
# then edit .env to put your real OpenAI key
npm start
```

The backend exposes:

- `GET /health` → basic health check
- `POST /ai-chat` → { message } → { reply }

It also serves frontend files under `/voice-widget`.

## 2. Frontend Embed (WordPress / Elementor)

After deploying the backend (for example on Render):

```html
<link rel="stylesheet" href="https://YOUR_BACKEND_URL/voice-widget/voice-widget.css">
<script>
  window.FORTUNEONE_API_URL = "https://YOUR_BACKEND_URL/ai-chat";
</script>
<script src="https://YOUR_BACKEND_URL/voice-widget/voice-widget.js"></script>
```

This will show:

- A floating 🎧 button at the bottom-right
- Click → opens voice panel
- Tap "🎤 Tap to Talk" → speak → AI replies with voice

## 3. Notes

- This version focuses on stable VOICE UX first.
- No Square / LINE integration yet — it is pure receptionist conversation.
- Once this is stable, you can add Square APIs on the backend and adjust the system prompt to talk about "booking is confirmed" only when Square says so.
