import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentuser } from '@cbgetticket/common';

import { createTicketRouter } from './router/new';
import { showTicketRouter } from './router/show';
import { indexTicketRouter } from './router/index';
import { updateTicketRouter } from './router/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'  //makes sure to make https connection, not http
  })                                         //jest changes Node_env to 'test' string
);
app.use(currentuser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };