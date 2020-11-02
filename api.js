const ws = require('ws')

//WS server
const wss = new ws.Server({
    port: 8090,
    perMessageDeflate: {
        zlibDeflateOptions: {
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 10,
        threshold: 1024
    }
});

//WS handler
wss.on('connection', (ws, req) => {
    console.log(`${req.socket.remoteAddress} connected`)
    ws.on('message', msg => {
        console.log(`${req.socket.remoteAddress} => ${msg}`)
        if (msg.split(';', 2)[0] === 'message') wss.clients.forEach(clients => clients.send(msg))
    })
    ws.send('websocket connected')
})