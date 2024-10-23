const express = require('express');
const morgan = require('morgan');

const tournamentRouter = require('./routes/tournamentRouter');
const authRouter = require('./routes/authRouter');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/tournaments', tournamentRouter);
app.use('/api/auth', authRouter);

module.exports = app;
