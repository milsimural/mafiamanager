const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

const tournamentRouter = require('./routes/tournamentRouter');
const authRouter = require('./routes/authRouter');
const tokensRouter = require('./routes/tokensRouter');
const adminRouter = require('./routes/adminRouter');
const minicupRouter = require('./routes/minicupRouter');
const playersRouter = require('./routes/playersRouter');
const constractRouter = require('./routes/constractRouter');
const itemRouter = require('./routes/itemRouter');
const item = require('../db/models/item');
const seasonRouter = require('./routes/seasonRouter');

const app = express();

app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use('/api/players', playersRouter);
app.use('/api/tournaments', tournamentRouter);
app.use('/api/auth', authRouter);
app.use('/api/tokens', tokensRouter);
app.use('/api/admin', adminRouter);
app.use('/api/minicup', minicupRouter);
app.use('/api/constract', constractRouter);
app.use('/api/itemInstance', itemRouter);
app.use('/api/seasons', seasonRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });
}

module.exports = app;
