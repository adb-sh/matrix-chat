import matrix from 'matrix-js-sdk';
//import Vue from 'vue'
import main from '@/main.js';
const matrix_cli = matrix.createClient("https://adb.sh");

let session = {
    user: "",
    password: "",
    access_token: "",
    rooms: [],
    currentRoom: undefined
};
let rooms = [];

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
            /*let i=0;
            let checkRooms = setInterval(()=>{
                rooms = matrix_cli.getRooms()
                console.log("asdasd"+rooms.length)
                if (rooms.length !== 0 || i>10) clearInterval(checkRooms)
                i++;
            },500)*/
        },
        getRooms(){
            rooms.push(matrix_cli.getRooms())
            return rooms
        }
    }
}

/*new Vue({
    el: '#roomList',
    refs:{
        rooms: [{name: "lol"},{name: "lol123"}]
    },
    data() {
        return {
            rooms: [{name: "lol"},{name: "lol123"}],
        }
    }
})*/

matrix_cli.on("event", event => {
    console.log(event.getType());
    console.log(event);
    session.rooms = []
    matrix_cli.getRooms().forEach(room => {
        session.rooms.push({name: room.name, roomId: room.roomId})
    })
    console.log(matrix_cli.getRooms())
})

matrix_cli.on("Room.timeline", event => {
    if (event.getType() !== "m.room.message") return;
    console.log(event.event.content.body);
});