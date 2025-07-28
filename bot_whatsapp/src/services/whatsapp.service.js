const { getClient } = require('../config/bot');

// 🔹 Obtener grupos
async function getWhatsAppGroups() {
  const client = getClient();
  const chats = await client.getAllChats();

  console.log('🔥 Chats encontrados:', chats.length);

  // Filtrar solo grupos (server = g.us)
  return chats
    .filter(chat => chat.id.server === 'g.us' || chat.isGroup)
    .map(group => ({
      name: group.name,
      id: group.id._serialized
    }));
}


// 🔹 Enviar mensaje a un grupo
async function sendMessageToGroup(groupId , message) {
    const client = getClient();
    const chatId = groupId.endsWith('@g.us') ? groupId : `${groupId}@g.us`;
    return await client.sendText(chatId, message);
}

// 🔹 Enviar PDF/imagen a un grupo con mensaje opcional
async function sendFileToGroup(groupId, fileUrl, caption = '') {
    const client = getClient();
    const chatId = groupId.endsWith('@g.us') ? groupId : `${groupId}@g.us`;

    return await client.sendFile(chatId, fileUrl, 'Archivo', caption);
}

module.exports = {
    getWhatsAppGroups,
    sendMessageToGroup,
    sendFileToGroup
};
