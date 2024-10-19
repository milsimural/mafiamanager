const { Router } = require('express');

const { Message } = require('../../db/models');

const messagesRouter = Router();

messagesRouter.get('', async (req, res) => {
  try {
    const messages = await Message.findAll();
    res.json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Ошибка при получении всех сообщений ${error.message}` });
  }
});

module.exports = messagesRouter;
