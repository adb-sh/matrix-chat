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
    currentRoom: undefined
};

console.log(document.cookie)

if (getCookie("accessToken") && getCookie("userId")){
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
            }
            matrix_cli = matrix.createClient("https://adb.sh");
            matrix_cli.login("m.login.password", {
                user: session.user,
                password: session.password,
                initial_device_display_name: "matrix chat",
            }).then((response) => {
                document.cookie = `accessToken=${response.access_token}`;
                document.cookie = `userId=${session.user}`;
                session = {
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
        }
    }
}

function getCookie(key) {
   let cookie = document.cookie.replace(/ /g, '').split(';')
        .find(cookie => cookie.split('=')[0] === key);
   if (cookie) return cookie.split('=')[1];
   return false;
}

matrix_cli.on("event", event => {
    console.log(event.getType());
    console.log(event);
    matrix_cli.getRooms().forEach(newRoom => {
        let room = session.rooms.find(room => room.roomId === newRoom.roomId)
        if (!room){
            session.rooms.push({name: newRoom.name, roomId: newRoom.roomId, messages: []})
            console.log(`new room => ${newRoom.name}`)
        }
        else if (room.name !== newRoom.name){
            console.log(`roomname changed from ${room.name} to ${newRoom.name}`)
            room.name = newRoom.name
        }
    })
    console.log(session)
})

matrix_cli.on("Room.timeline", event => {
    if (event.getType() !== "m.room.message") return;
    console.log(`new message => ${event.event.content.body}`);
    let room = session.rooms.find(room => room.roomId === event.event.room_id)
    if (!room){
        session.rooms.push({name: "undefined", roomId: event.event.room_id, messages: [event.event]})
        console.log(`undefined room name for => ${event.event.room_id}`)
    }
    else room.messages.push(event.event)
});
