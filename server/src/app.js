const express = require('express');
const morgan = require('morgan');

const tournamentRouter = require('./routes/tournamentRouter');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/tournaments', tournamentRouter);

module.exports = app;
