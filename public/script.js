let gameRoom;
let deadPlayerCh;
let myClientId;
let myChannel;
let gameOn = false;
let players = {};
let totalPlayers = 0;
let amIalive = false;
let game;

const BASE_SERVER_URL = "http://localhost:5000";
const myNickname = localStorage.getItem("nickname");

const realtime = Ably.Realtime({
    authUrl: BASE_SERVER_URL + "/auth",
  });
  
  realtime.connection.once("connected", () => {
    myClientId = realtime.auth.clientId;
    gameRoom = realtime.channels.get("game-room");
    deadPlayerCh = realtime.channels.get("dead-player");
    myChannel = realtime.channels.get("clientChannel-" + myClientId);
    gameRoom.presence.enter(myNickname);
  });

