import { Server } from 'socket.io';

export const setupSocket = (httpServer) => {
  // Express server ke upar Socket.IO chalu kiya
  const io = new Server(httpServer);

  // 1. CONNECTION: Jab bhi koi user browser me page kholega, yeh chalega
  io.on('connection', (socket) => {
    console.log('✅ User Connected:', socket.id);

    // 2. socket.emit() -> Sirf IS naye user ko message bhejega
    socket.emit('message', `Welcome! Aapki Socket ID hai: ${socket.id}`);

    // 3. socket.broadcast.emit() -> Mujhe chhodkar BAAKI SABKO message bhejega
    socket.broadcast.emit('message', `🔔 Ek naya user (${socket.id}) chat me aaya!`);

    // 4. io.emit() -> SABHI users ko message bhejega (Sender + Baaki sab)
    socket.on('send-to-all', (text) => {
      io.emit('message', `🌍 [All] ${socket.id}: ${text}`);
    });

    // Broadcast button -> Mujhe chhodkar baaki sabko bhejega
    socket.on('send-broadcast', (text) => {
      socket.broadcast.emit('message', `📢 [Broadcast] ${socket.id}: ${text}`);
    });

    // 5. ROOMS -> Ek specific group/room join karne ke liye
    socket.on('join-room', (roomName) => {
      socket.join(roomName);
      socket.emit('message', `🚪 Aapne "${roomName}" room join kar liya!`);
      // Room ke baaki members ko batao (sender ko chhodkar)
      socket.to(roomName).emit('message', `👋 ${socket.id} ne "${roomName}" room join kiya`);
    });

    // Room chhodne ke liye
    socket.on('leave-room', (roomName) => {
      socket.leave(roomName);
      socket.emit('message', `🚶 Aapne "${roomName}" room chhod diya!`);
    });

    // Sirf us room ke sabhi members ko message bhejne ke liye
    socket.on('send-to-room', ({ roomName, text }) => {
      io.to(roomName).emit('message', `🏠 [Room: ${roomName}] ${socket.id}: ${text}`);
    });

    // 6. DISCONNECT: Jab user browser tab band karega
    socket.on('disconnect', () => {
      console.log('❌ User Disconnected:', socket.id);
      socket.broadcast.emit('message', `🔴 User (${socket.id}) chala gaya`);
    });
  });
};