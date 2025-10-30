import 'reflect-metadata';
import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { container } from 'tsyringe';
import { LogicGateSocketController } from './modules/logic_gate/socket/LogicGateSocketController.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Logic Gate WebSocket Server is running!' });
});

let logicGateController: LogicGateSocketController;
try {
  logicGateController = container.resolve(LogicGateSocketController);
  console.log('LogicGateSocketController resolved successfully.');
} catch (error) {
  console.error("Failed to resolve LogicGateSocketController:", error);
  process.exit(1);
}

logicGateController.registerHandlers(io);

server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`WebSocket server initialized and waiting for connections...`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});