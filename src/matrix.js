import matrix from 'matrix-js-sdk';
import main from '@/main.js';
const matrix_cli = matrix.createClient("https://adb.sh");

let session = {
    user: "",
    password: "",
    access_token: ""
};
let rooms = [];

export default {
    data(){
        return {
            session: session,
            rooms: rooms
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
                session = {access_token: response.access_token}
                if (response.error){
                    main.methods.error(response.error)
                    console.log(`login error => ${response.error}`)
                }
                main.methods.router({path: "rooms"})
                matrix_cli.startClient();
                matrix_cli.once('sync', function (state){
                    console.log(state)
                })
                matrix_cli.on("event", function(event){
                    console.log(event.getType());
                    console.log(event);
                })

                setTimeout(()=>{this.getRooms()},5000)
            });
        },
        getRooms(){
            rooms = matrix_cli.getRooms()
            return rooms
        }
    }
}