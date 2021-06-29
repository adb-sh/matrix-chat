# [chat]
a simple matrix webapp for mobile and desktop

<a href="https://liberapay.com/adb.sh/donate"><img alt="Donate using Liberapay" src="https://liberapay.com/assets/widgets/donate.svg"></a> 

<img src="https://chat.adb.sh/media/screenshot-desktop.png" alt="screenshot-desktop">

`matrix-chat` or in short `[chat]` is a simple matrix webclient designed for mobile and desktop use with a clean UI.
It's written with Vue in JavaScript. The webapp is still under development and more features will be added gradually.
To stay tuned or give some input just join the matrix room. [#matrix-chat-public:adb.sh](https://matrix.to/#/#matrix-chat-public:adb.sh)

### setup
```
npm install
```

### run for development
```
npm run serve
```

### compile for production
```
npm run build
```

## native
### copy build files
```
npx cap copy
```
### start android studio
```
npx cap open android
```
### start electron app
```
npx cap open electron
```

## links and references
some docs and repos that helped me out a lot
* https://matrix-org.github.io/matrix-js-sdk/10.0.0
* https://matrix.org/docs/spec/client_server/latest
* https://matrix.org/docs/api/client-server/
* https://git.pixie.town/neo/neo
* https://github.com/matrix-org/matrix-react-sdk
