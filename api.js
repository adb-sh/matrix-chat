const ws = require('ws')

//WS server
const wss = new ws.Server({
    port: 8081,
    perMessageDeflate: {
        zlibDeflateOptions: {
            // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024 // Size (in bytes) below which messages
        // should not be compressed.
    }
});

//WS handler
wss.on('connection', ws => {
    ws.on('message', message => {
        if (message.split(';', 2)[0] === 'message') wss.clients.forEach(clients => clients.send(message))
    })
    ws.send('websocket connected')
})