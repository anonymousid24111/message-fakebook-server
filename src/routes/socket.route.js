const { SEND_MESSAGE, JOIN } = require('../commons/socketEvents');
const socketController = require('../controllers/socket.controller')

const socketRoute = (io, socket) => {
    console.log(`Connected: ${socket.id}`);
    socket.on('disconnect', () => console.log(`Disconnected: ${socket.id}`));
    socket.on(JOIN, data => socketController.join(io, socket, data));
    socket.on(SEND_MESSAGE, data => socketController.sendMessage(io, socket, data));
}
module.exports = socketRoute