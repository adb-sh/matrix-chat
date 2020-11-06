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
    ws.on('message', msgJSON => {
        let msg = JSON.parse(msgJSON)
        console.log(`${req.socket.remoteAddress} => ${msgJSON}`)
        if (msg.type === 'message') wss.clients.forEach(client => client.send(msgJSON))
    })
    let msg = {
        type: "info",
        time: Date.now(),
        content: "connected"
    }
    ws.send(JSON.stringify(msg))
})