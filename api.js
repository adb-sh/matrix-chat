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
let user = [];
wss.on('connection', (ws, req) => {
    let thisuser = ""
    console.log(`${req.socket.remoteAddress} connected`)
    ws.on('message', msgJSON => {
        let msg = JSON.parse(msgJSON)
        console.log(`${req.socket.remoteAddress} (${thisuser}) => ${msgJSON}`)
        if (msg.type === 'message')
            if (thisuser === ""){
                ws.send(JSON.stringify({type: "error", content: "please login before writing"}))
                ws.send('{"type":"route","path":"/login"}')
            }else if (msg.content.text === "")
                ws.send(JSON.stringify({type: "error", content: "your message was empty"}))
            else if (msg.content.text.length >= 1000)
                ws.send(JSON.stringify({type: "error", content: "your message is too long"}))
            else{
                msg.content.user = thisuser
                //msg.content.text = msg.content.text.replace(/</g, "&lt").replace(/>/g, "&gt").replace(/\n/g, "<br>")
                wss.clients.forEach(client => client.send(JSON.stringify(msg)))
            }
        else if (msg.type === 'login' && msg.content.user !== ""){
            if (thisuser !== ""){
                ws.send(JSON.stringify({type: "error", content: "you are already logged in"}))
                ws.send('{"type":"route","path":"/chat"}')
            }
            else if (msg.content.user.length >= 20) ws.send(JSON.stringify({type: "error", content: "username is too long"}))
            else if (msg.content.user === "you" || user.indexOf(msg.content.user) !== -1)
                ws.send(JSON.stringify({type: "error", content: "username already exist"}))
            else{
                thisuser = msg.content.user
                user.push(msg.content.user)
                ws.send('{"type":"route","path":"/chat"}')
                ws.send(JSON.stringify({type: "info", username: thisuser}))
                wss.clients.forEach(client =>
                    client.send(JSON.stringify({type: "room", name: "open chat", user: user})))
            }
        }
    })
    ws.on('close', () => {
        user.splice(user.indexOf(thisuser), 1);
        console.log(`${req.socket.remoteAddress} (${thisuser}) closed`)
        wss.clients.forEach(client =>
            client.send(JSON.stringify({type: "room", name: "open chat", user: user})))
    })

    ws.send(JSON.stringify({type: "info", time: Date.now(), content: "connected"}))
})