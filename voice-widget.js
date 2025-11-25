
/**
 * FortuneOne Voice-First Receptionist Widget
 * - Voice only by default (no need to type or press Send)
 * - User taps button, speaks, AI listens and replies with voice
 * - Text is optional and mostly hidden from the user
 */
(function () {
  const API_URL = window.FORTUNEONE_API_URL || '/ai-chat';

  function createWidget() {
    const container = document.createElement('div');
    container.id = 'fortuneone-voice-widget';

    container.innerHTML = `
      <div class="f1-voice-launcher" id="f1-voice-launcher">
        🎧
      </div>
      <div class="f1-voice-panel" id="f1-voice-panel">
        <div class="f1-voice-header">
          <div class="f1-voice-title">FortuneOne AI Receptionist</div>
          <button class="f1-voice-close" id="f1-voice-close">×</button>
        </div>
        <div class="f1-voice-status" id="f1-voice-status">
          Tap the button and speak. I will listen and reply with voice.
        </div>
        <div class="f1-voice-controls">
          <button class="f1-voice-talk-btn" id="f1-voice-talk-btn">
            🎤 Tap to Talk
          </button>
        </div>
        <div class="f1-voice-log" id="f1-voice-log"></div>
      </div>
    `;

    document.body.appendChild(container);

    const launcher = document.getElementById('f1-voice-launcher');
    const panel = document.getElementById('f1-voice-panel');
    const closeBtn = document.getElementById('f1-voice-close');
    const talkBtn = document.getElementById('f1-voice-talk-btn');
    const statusEl = document.getElementById('f1-voice-status');
    const logEl = document.getElementById('f1-voice-log');

    let recognizing = false;
    let recognition = null;

    function log(msg) {
      if (!logEl) return;
      const div = document.createElement('div');
      div.className = 'f1-voice-log-line';
      div.textContent = msg;
      logEl.appendChild(div);
      logEl.scrollTop = logEl.scrollHeight;
    }

    function speak(text) {
      if (!('speechSynthesis' in window)) {
        log('Your browser cannot play voice responses (no speechSynthesis).');
        return;
      }
      const utter = new SpeechSynthesisUtterance(text);
      // Detect Thai characters to set language
      utter.lang = /[ก-๙]/.test(text) ? 'th-TH' : 'en-US';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }

    function ensureRecognition() {
      if (recognition) return recognition;
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRec) {
        statusEl.textContent = 'Voice is not supported in this browser. Please try on Chrome.';
        talkBtn.disabled = true;
        return null;
      }
      recognition = new SpeechRec();
      recognition.lang = 'th-TH'; // can detect Thai/English automatically later
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = function () {
        recognizing = true;
        talkBtn.classList.add('f1-voice-active');
        statusEl.textContent = 'Listening... please speak.';
      };

      recognition.onerror = function (event) {
        recognizing = false;
        talkBtn.classList.remove('f1-voice-active');
        statusEl.textContent = 'Voice error: ' + (event.error || 'unknown');
        log('Voice error: ' + (event.error || 'unknown'));
      };

      recognition.onend = function () {
        recognizing = false;
        talkBtn.classList.remove('f1-voice-active');
        if (!statusEl.textContent.startsWith('Replying')) {
          statusEl.textContent = 'Tap the button and speak again.';
        }
      };

      recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        log('You: ' + transcript);
        sendToAI(transcript);
      };

      return recognition;
    }

    async function sendToAI(text) {
      statusEl.textContent = 'Replying...';
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text })
        });
        const data = await res.json();
        if (data && data.reply) {
          log('AI: ' + data.reply);
          statusEl.textContent = 'Tap the button and speak again.';
          speak(data.reply);
        } else {
          statusEl.textContent = 'Sorry, something went wrong. Please try again.';
          log('AI error: invalid response');
        }
      } catch (e) {
        console.error('sendToAI error', e);
        statusEl.textContent = 'Sorry, network error. Please try again.';
        log('Network error: ' + e.message);
      }
    }

    launcher.addEventListener('click', () => {
      panel.classList.toggle('f1-voice-open');
    });

    closeBtn.addEventListener('click', () => {
      panel.classList.remove('f1-voice-open');
    });

    talkBtn.addEventListener('click', () => {
      const rec = ensureRecognition();
      if (!rec) return;

      if (recognizing) {
        rec.stop();
        return;
      }
      try {
        rec.start();
      } catch (e) {
        console.error('rec.start error', e);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
