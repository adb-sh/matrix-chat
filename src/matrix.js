import matrix from 'matrix-js-sdk';
import main from '@/main.js';
const matrix_cli = matrix.createClient("https://adb.sh");

let session = {
    user: "",
    password: "",
    access_token: "",
    rooms: [],
    currentRoom: undefined
};

export default {
    data(){
        return {
            session: session
        }
    },
    methods: {
        login(){
            matrix_cli.login("m.login.password", {
                user: session.user,
                password: session.password,
                initial_device_display_name: "matrix chat",
            }).then((response) => {
                console.log(`access token => ${response.access_token}`);
                session.access_token = response.access_token
                document.cookie = `access_token=${session.access_token}; user=${session.user};`;
                if (response.error){
                    main.methods.error(response.error)
                    console.log(`login error => ${response.error}`)
                }
                main.methods.router({path: "rooms/"})
                matrix_cli.startClient();
                matrix_cli.once('sync', function (state){
                    console.log(state)
                })
            });
        }
    }
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
/*
if (getCookie("access_token")){

    main.methods.router({path: "rooms/"})
}
else main.methods.router({path: "login"})
*/
/*function getCookie(key){
    let cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
        if (cookie.split('=')[0] === key)
            return cookie.split('=')[1];
    })
    return false;
}*/