const {
  getWhatsAppGroups,
  sendMessageToGroup,
  sendFileToGroup
} = require('../services/whatsapp.service');

// 🔹 Listar grupos
async function handleGetGroups(req, res) {
  try {
      const groups = await getWhatsAppGroups();
      res.status(200).json(groups);
  } catch (error) {
      console.error('❌ Error al obtener grupos:', error);
      res.status(500).json({ error: 'No se pudieron obtener los grupos' });
  }
}

// 🔹 Enviar mensaje a grupo
async function handleSendMessageGroup(req, res) {
  const groupId = "120363420725142348@g.us"; // grupo fijo
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Falta el mensaje" });
  }

  try {
      await sendMessageToGroup(groupId, message);
      res.status(200).json({ status: 'Mensaje enviado correctamente al grupo' });
  } catch (error) {
      console.error('❌ Error al enviar mensaje al grupo:', error);
      res.status(500).json({ error: 'No se pudo enviar el mensaje' });
  }
}

async function handleSendFileGroup(req, res) {
  const groupId = "120363420725142348@g.us"; 
  const { fileUrl, caption } = req.body;
  console.log('🔹 Enviando archivo al grupo:',fileUrl, caption);
  if (!fileUrl) {
    return res.status(400).json({ error: "Falta la url del archivo" });
  }

  try {
      await sendFileToGroup(groupId, fileUrl, caption || '');
      res.status(200).json({ status: 'Archivo enviado correctamente al grupo' });
  } catch (error) {
      console.error('❌ Error al enviar archivo al grupo:', error);
      res.status(500).json({ error: 'No se pudo enviar el archivo' });
  }
}

module.exports = {
  handleGetGroups,
  handleSendMessageGroup,
  handleSendFileGroup
};
