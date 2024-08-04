// Se establece una conexión con el servidor utilizando Socket.io y se asigna a la variable 'socket'
const socket = io()


//EMIT→ para enviar   ON→ para recibir


// Se emite un evento 'movimiento' al servidor con el mensaje "Ca7", indicando un movimiento realizado por el cliente
socket.emit('movimiento', "Ca7")

// Se emite un evento 'rendirse' al servidor con el mensaje "Me he rendido", indicando que el cliente se ha rendido
socket.emit('rendirse', "Me he rendido")

// Se establece un listener en el cliente para el evento 'mensaje-jugador'  Viene de app.js
socket.on('mensaje-jugador', info => {
    // Cuando se recibe este evento desde el servidor, se ejecuta la función proporcionada,
    // que imprime en la consola del cliente la información recibida desde el servidor
    console.log(info)
})

// Se establece otro listener en el cliente para el evento 'rendicion'
socket.on('rendicion', info => {
    // Cuando se recibe este evento desde el servidor, se ejecuta la función proporcionada,
    // que imprime en la consola del cliente la información recibida desde el servidor
    console.log(info)
})

/*RESUMEN
public/js/main.js(emit): Voy a enviar dos mensajes: movimiento y rendirse. En app.js (on): Mi servidor va a estar esperando dos mensajes: movimiento y rendirse. Cuando me rindo envio desde el servidor 2 mensajes: mensaje jugador y rendicion. Entonces e mi frontEnd, en lo que seria mi cliente espero, main.js espero mensaje jugador y rendicion.
SIEMPRE VOY A TENER EL IDA Y VUELTA: ENVIO INFO, ME TRAE INFO
*/