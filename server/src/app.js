const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const tournamentRouter = require('./routes/tournamentRouter');
const authRouter = require('./routes/authRouter');
const tokensRouter = require('./routes/tokensRouter');
const adminRouter = require('./routes/adminRouter');
const minicupRouter = require('./routes/minicupRouter');
const playersRouter = require('./routes/playersRouter');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/players', playersRouter);
app.use('/api/tournaments', tournamentRouter);
app.use('/api/auth', authRouter);
app.use('/api/tokens', tokensRouter);
app.use('/api/admin', adminRouter);
app.use('/api/minicup', minicupRouter);

module.exports = app;
