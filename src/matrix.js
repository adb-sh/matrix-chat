import matrix from 'matrix-js-sdk';
import main from '@/main.js';
// import Vue from 'vue';

const client = matrix.createClient({
  baseUrl: 'https://adb.sh',
  accessToken: getCookie('accessToken'),
  userId: getCookie('userId'),
});
let session = {
  user: '',
  password: '',
  accessToken: '',
  rooms: [],
  currentRoom: undefined,
  login: {
    user: '',
    password: '',
  },
};

console.log(document.cookie);

if (getCookie('accessToken') && getCookie('userId')) {
  document.cookie = `expires=${new Date(Date.now() + 86400 * 10 * 1000)}`;
  session = {
    user: getCookie('userId'),
    password: '',
    accessToken: getCookie('accessToken'),
    rooms: [],
    currentRoom: undefined,
  };
  // Vue.$router.push("/rooms/")
  window.location.href = '/#/rooms/';
  client.startClient();
  client.once('sync', (state) => {
    console.log(state);
  });
} else window.location.href = '/#/login';

export default {
  data() {
    return {
      session,
    };
  },
  methods: {
    login() {
      if (session.accessToken !== '') {
        main.methods.error('you are already logged in');
        return;
      } if (session.login.user === '') {
        main.methods.error('username is empty');
        return;
      } if (session.login.password === '') {
        main.methods.error('password is empty');
        return;
      } if (!(session.login.user.includes('@') && session.login.user.includes(':'))) {
        main.methods.error('username is in wrong style');
        return;
      }
      client.login('m.login.password', {
        user: session.login.user,
        password: session.login.password,
        initial_device_display_name: 'matrix chat',
      }).then((response) => {
        document.cookie = `accessToken=${response.access_token}`;
        document.cookie = `userId=${session.login.user}`;
        document.cookie = `max-expires=${new Date(Date.now() + 86400 * 10 * 1000)}`;
        session = {
          user: session.login.user,
          password: '',
          accessToken: response.access_token,
          rooms: [],
          currentRoom: undefined,
        };
        console.log(`access token => ${response.access_token}`);
        if (response.error) {
          main.methods.error(response.error);
          console.log(`login error => ${response.error}`);
        }
        window.location.href = '/#/rooms/';
        client.startClient();
        client.once('sync', (state) => {
          console.log(state);
        });
      });
    },
    sendMessage(msg) {
      const msgSend = {
        type: msg.type,
        content: {
          body: msg.content.body,
          msgtype: msg.content.msgtype,
        },
      };
      client.sendEvent(session.currentRoom.roomId, msgSend.type, msgSend.content, '').then(() => {
        console.log('message sent successfully');
      }).catch((err) => {
        console.log(`error while sending message => ${err}`);
        main.methods.error('message could not be sent');
      });
    },
  },
};

function getCookie(key) {
  const cookie = document.cookie.replace(/ /g, '').split(';')
    .find((cookie) => cookie.split('=')[0] === key);
  return cookie ? cookie.split('=')[1] : false;
}

client.on('event', (event) => {
  console.log(event.getType());
  console.log(event);
  if (event.getType() === 'm.room.name') {
    client.getRooms().forEach((newRoom) => {
      const room = session.rooms.find((room) => room.roomId === newRoom.roomId);
      if (!room) {
        session.rooms.push({
          name: newRoom.name, roomId: newRoom.roomId, messages: [], members: [],
        });
        console.log(`new room => ${newRoom.name}`);
      } else if (room.name !== newRoom.name) {
        console.log(`roomname changed from ${room.name} to ${newRoom.name}`);
        room.name = newRoom.name;
      }
    });
  } else if (event.getType() === 'm.room.member') {
    const room = session.rooms.find((room) => room.roomId === event.event.room_id);
    if (!room) {
      session.rooms.push({
        name: 'undefined', roomId: event.event.room_id, messages: [], members: [],
      });
      console.log(`new user => ${event.event.sender}`);
    } else {
      room.members.push({ sender: event.event.sender, content: event.event.content });
    }
  }
  console.log(session);
});

client.on('Room.timeline', (event, room) => {
  if (event.getType() === 'm.room.message') {
    console.log(`message => ${event.event.content.body}`);
    const thisRoom = session.rooms.find((thisRoom) => thisRoom.roomId === room.roomId);
    if (!thisRoom) {
      session.rooms.push({
        name: room.name, roomId: event.event.room_id, messages: [event.event], members: [],
      });
    } else {
      thisRoom.messages.push(event.event);
      if (thisRoom.name === 'undefined') thisRoom.name = room.name;
    }

    const msgContainer = document.getElementById('messagesContainer');
    if (session.currentRoom && session.currentRoom.roomId === room.roomId) {
      if (event.event.sender === session.user || msgContainer.scrollHeight < msgContainer.scrollTop + 1000) {
        setTimeout(() => {
          msgContainer.scrollTo(0, msgContainer.scrollHeight);
        }, 10);
      } else document.getElementById('scrollDown').style.display = 'block';
    }
  }
});

client.on('Room.member', (member) => {
  console.log('this is a member');
  console.log(member);
});
