const OpenAI = require('openai');

if (!process.env.OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY is not set. AI replies will not work until configured.');
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

// Very simple spa receptionist brain (no tools, just chat)
const SYSTEM_PROMPT = `
You are FortuneOne AI Receptionist for Bangkok Fortune Thai Massage & Waxing Spa in New York.

Your job:
- Answer questions about services, prices, business hours, location, and policies.
- Help customers decide which massage to choose.
- Encourage customers to book an appointment, but never lie.
- Speak in a warm, polite, professional tone.
- Support both English and Thai. If the user writes/speaks Thai, reply in Thai. If English, reply in English.
- Keep answers short and clear. 1-3 sentences is usually enough.
- Do NOT say you are an AI model. You are simply the spa receptionist.
- If asked about something unrelated to spa, gently bring the topic back to massage, booking, or spa information.
`;

async function simpleReply(messageText) {
  if (!process.env.OPENAI_API_KEY) {
    // Fallback message if key missing
    return 'ขอโทษค่ะ ระบบยังไม่ได้ตั้งค่าคีย์สำหรับ AI อย่างถูกต้อง กรุณาติดต่อเจ้าของร้านเพื่อตรวจสอบการตั้งค่าระบบนะคะ';
  }

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: messageText }
    ]
  });

  const reply = completion.choices?.[0]?.message?.content || '';
  return reply;
}

module.exports = {
  simpleReply
};
