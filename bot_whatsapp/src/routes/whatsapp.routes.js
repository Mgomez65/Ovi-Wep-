const express = require('express');
const router = express.Router();
const { getQrCode,getIsConnected} =require('../config/bot');;
const {
  handleGetGroups,
  handleSendMessageGroup, 
  handleSendFileGroup, 
} = require('../controllers/whatsapp.controller');


router.get('/qr', (req, res) => {
  const qr = getQrCode();
  const connected = getIsConnected();
  res.json({ qr, connected });
});

router.get('/', (req, res) => {
  const qr = getQrCode();
  const connected = getIsConnected();
  res.render('index', { qr, connected });
});




router.get('/groups', handleGetGroups); // Obtener lista de grupos
router.post('/groups/message', handleSendMessageGroup); // Enviar mensaje
router.post('/groups/file', handleSendFileGroup); // Enviar archivo + mensaje

  
module.exports = router;
