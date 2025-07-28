const { create } = require('venom-bot');

let client = null;
let qrBase64 = null;
let isConnected = false;

async function initBot() {
  client = await create(
    'bot-whatsapp',
    (base64Qr, asciiQR, attempts, urlCode) => {
      qrBase64 = base64Qr;
      isConnected = false;
    },
    (statusSession, session) => {
      if (statusSession === 'successChat' || statusSession === 'chatsAvailable') {
        isConnected = true;
        qrBase64 = null;
      } else if (
        statusSession === 'DISCONNECTED' ||
        statusSession === 'UNPAIRED' ||
        statusSession === 'TIMEOUT'
      ) {
        isConnected = false;
        console.log('Bot desconectado');
      }
    },
    {
      multidevice: true,
      logQR: false,
      headless: true,
      executablePath: '/usr/bin/chromium-browser', // usamos Chromium del sistema
      puppeteerOptions: {
        headless: 'new', // 👈 Forzamos el nuevo Headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Opciones extra para servidores VPS
      }
    }
  );
  console.log('Venom bot iniciado');
}

function getClient() {
  if (!client) throw new Error('Cliente de WhatsApp no disponible todavía');
  return client;
}

function getQrCode() {
  return qrBase64;
}

function getIsConnected() {
  return isConnected;
}

module.exports = {
  initBot,
  getClient,
  getQrCode,
  getIsConnected,
};
