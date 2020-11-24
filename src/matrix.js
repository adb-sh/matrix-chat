import matrix from 'matrix-js-sdk';
import main from '@/main.js';
//import Vue from 'vue';

var matrix_cli = matrix.createClient({
    baseUrl: "https://adb.sh",
    accessToken: getCookie("accessToken"),
    userId: getCookie("userId")
})
let session = {
    user: "",
    password: "",
    accessToken: "",
    rooms: [],
    currentRoom: undefined,
    login:{
        user: "",
        password: ""
    }
};

console.log(document.cookie)

if (getCookie("accessToken") && getCookie("userId")){
    document.cookie = `expires=${ new Date(Date.now()+86400*10*1000)}`;
    session = {
        user: getCookie("userId"),
        password: "",
        accessToken: getCookie("accessToken"),
        rooms: [],
        currentRoom: undefined
    };
    //Vue.$router.push("/rooms/")
    window.location.href = '/#/rooms/';
    matrix_cli.startClient();
    matrix_cli.once('sync', function (state){
        console.log(state)
    })
}
else window.location.href = '/#/login';

export default {
    data(){
        return {
            session: session
        }
    },
    methods: {
        login(){
            if (session.accessToken !== ""){
                main.methods.error("you are already logged in")
                return;
            } else if (session.login.user === ""){
                main.methods.error('username is empty')
                return;
            } else if (session.login.password === ""){
                main.methods.error('password is empty')
                return;
            } else if (!(session.login.user.includes("@") && session.login.user.includes(":"))){
                main.methods.error('username is in wrong style')
                return;
            }
            matrix_cli.login("m.login.password", {
                user: session.login.user,
                password: session.login.password,
                initial_device_display_name: "matrix chat",
            }).then((response) => {
                document.cookie = `accessToken=${response.access_token}`;
                document.cookie = `userId=${session.login.user}`;
                document.cookie = `max-expires=${ new Date(Date.now()+86400*10*1000)}`;
                session = {
                    user: session.login.user,
                    password: "",
                    accessToken: response.access_token,
                    rooms: [],
                    currentRoom: undefined
                };
                console.log(`access token => ${response.access_token}`);
                if (response.error){
                    main.methods.error(response.error)
                    console.log(`login error => ${response.error}`)
                }
                window.location.href = '/#/rooms/';
                matrix_cli.startClient();
                matrix_cli.once('sync', function (state){
                    console.log(state)
                })
            });
        },
        sendMessage(msg){
            let msgSend = {
                type: msg.type,
                content: {
                    body: msg.content.body,
                    msgtype: msg.content.msgtype
                }
            }
            matrix_cli.sendEvent(session.currentRoom.roomId, msgSend.type, msgSend.content, "").then(()=>{
                console.log("message sent successfully")
            }).catch(err => {
                console.log(`error while sending message => ${err}`)
                main.methods.error("message could not be sent")
            })
        }
    }
}

function getCookie(key) {
   let cookie = document.cookie.replace(/ /g, '').split(';')
       .find(cookie => cookie.split('=')[0] === key);
   return cookie?cookie.split('=')[1]:false;
}

matrix_cli.on("event", event => {
    console.log(event.getType());
    console.log(event);
    if (event.getType() === "m.room.name") {
        matrix_cli.getRooms().forEach(newRoom => {
            let room = session.rooms.find(room => room.roomId === newRoom.roomId)
            if (!room) {
                session.rooms.push({name: newRoom.name, roomId: newRoom.roomId, messages: [], members: []})
                console.log(`new room => ${newRoom.name}`)
            } else if (room.name !== newRoom.name) {
                console.log(`roomname changed from ${room.name} to ${newRoom.name}`)
                room.name = newRoom.name
            }
        })
    }
    else if (event.getType() === "m.room.member"){
        let room = session.rooms.find(room => room.roomId === event.event.room_id)
        if (!room) {
            session.rooms.push({name: "undefined", roomId: event.event.room_id, messages: [], members: []})
            console.log(`new user => ${event.event.sender}`)
        } else {
            room.members.push({sender: event.event.sender, content: event.event.content})
        }
    }
    console.log(session)
})

matrix_cli.on("Room.timeline", event => {
    if (event.getType() === "m.room.message") {
        console.log(`new message => ${event.event.content.body}`);
        let room = session.rooms.find(room => room.roomId === event.event.room_id)
        if (!room) {
            session.rooms.push({name: "undefined", roomId: event.event.room_id, messages: [event.event], members: []})
            console.log(`undefined room name for => ${event.event.room_id}`)
        } else room.messages.push(event.event)

        let msgContainer = document.getElementById("messagesContainer")
        if (session.currentRoom && session.currentRoom.roomId === event.event.room_id) {
            if (event.event.sender === session.user || msgContainer.scrollHeight < msgContainer.scrollTop + 1000)
                setTimeout(() => {
                    msgContainer.scrollTo(0, msgContainer.scrollHeight)
                }, 10)
            else document.getElementById("scrollDown").style.display = "block"
        }
    }
});
