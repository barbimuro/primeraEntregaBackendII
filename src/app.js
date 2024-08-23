import express from "express";
import passport from "passport";
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import cookieParser from "cookie-parser";

import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import viewsRouter from './routes/views.router.js';
import sessionsRouter from './routes/sessions.router.js';
import initializePassportConfig from './config/passport.config.js';
import config from "./config/config.js";

const app = express();

const PORT = config.app.PORT;

app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');

const server = app.listen(PORT, () => console.log(`listening on port ${PORT}`));
const connectDB = async () => {
  try {
      await mongoose.connect(config.mongo.URL);
      console.log('MongoDB connected');
  } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
  }
};

connectDB();


app.use(express.json());
app.use(express.static('./src/public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
initializePassportConfig();
app.use(passport.initialize());

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/sessions', sessionsRouter);

const socketServer = new Server(server);
socketServer.on('connection', (socketClient) => {
    console.log("Cliente Conectado");
    socketServer.emit('productAdded');

    socketClient.on('addProduct', data => {
        console.log(`Se agrego el producto con el id ${data}`);
        socketServer.emit('productAdded');
    });
});
