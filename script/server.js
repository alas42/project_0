const express = require("express");
const Ably = require("ably");
const app = express();
const ABLY_API_KEY = "m9LXbg.ebIsdg:tstVGTyoZ214UP0a";

/* const CANVAS_HEIGHT = 750;
const CANVAS_WIDTH = 1400; */
const MIN_PLAYERS_TO_START_GAME = 2;
const MAX_PLAYERS_TO_START_GAME = 5;
const GAME_TICKER_MS = 100;

let peopleAccessingTheWebsite = 0;
let players = {};
let playerChannels = {};
let gameOn = false;
let alivePlayers = 0;
let totalPlayers = 0;
let gameRoom;
let deadPlayerCh;
let gameTickerOn = false;
let path = require('path');
var PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Your app is listening on port " + PORT);
});

const realtime = Ably.Realtime({
    key: ABLY_API_KEY,
    echoMessages: false
  });
  
  //create a uniqueId to assign to clients on auth
  const uniqueId = function () {
    return "id-" + totalPlayers + Math.random().toString(36).substr(2, 16);
  };
  
  app.use(express.static("public"));
  
  app.get("/auth", (request, response) => {
    const tokenParams = { clientId: uniqueId() };
    realtime.auth.createTokenRequest(tokenParams, function (err, tokenRequest) {
      if (err) {
        response
          .status(500)
          .send("Error requesting token: " + JSON.stringify(err));
      } else {
        response.setHeader("Content-Type", "application/json");
        response.send(JSON.stringify(tokenRequest));
      }
    });
  });
  
  app.get("/", (request, response) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    if (++peopleAccessingTheWebsite > MAX_PLAYERS_TO_START_GAME) {
      response.sendFile(path.join(__dirname, '..', 'views', 'gameRoomFull.html'));
    } else {
      response.sendFile(path.join(__dirname, '..', 'views', 'intro.html'));
    }
  });
  
  app.get("/game-room", (request, response) => {
    response.sendFile(path.join(__dirname, '..', 'views','index.html'));
  });

  realtime.connection.once("connected", () => {
    console.log("connected");
    gameRoom = realtime.channels.get("game-room");
    deadPlayerCh = realtime.channels.get("dead-player");
    gameRoom.presence.subscribe("enter", (player) => {
        let newPlayerId;
        alivePlayers++;
        totalPlayers++;
        console.log(totalPlayers);
        if (totalPlayers === 1) {
          gameTickerOn = true;
          startGameDataTicker();
        }
        newPlayerId = player.clientId;
        playerChannels[newPlayerId] = realtime.channels.get(
          "clientChannel-" + player.clientId
        );
        newPlayerObject = {
          id: newPlayerId,
          score: 0,
          nickname: player.data,
          isAlive: true,
        };
        players[newPlayerId] = newPlayerObject;
        console.log(players[newPlayerId]);
        if (totalPlayers === MIN_PLAYERS_TO_START_GAME) {
          startGame();
        }
        subscribeToPlayerInput(playerChannels[newPlayerId], newPlayerId);
      });
      gameRoom.presence.subscribe("leave", (player) => {
        let leavingPlayer = player.clientId;
        alivePlayers--;
        totalPlayers--;
        delete players[leavingPlayer];
        if (totalPlayers <= 0) {
          resetServerState();
        }
      });
      deadPlayerCh.subscribe("dead-notif", (msg) => {
        players[msg.data.deadPlayerId].isAlive = false;
        alivePlayers--;
        if (alivePlayers == 0) {
          setTimeout(() => {
            finishGame("");
          }, 1000);
        }
      });
  });

  function startGameDataTicker() {
    let tickInterval = setInterval(() => {
      if (!gameTickerOn) {
        clearInterval(tickInterval);
      } else {
        gameRoom.publish("game-state", {
          players: players,
          playerCount: totalPlayers,
          gameOn: gameOn
        });
      }
    }, GAME_TICKER_MS);
  }

  function subscribeToPlayerInput(channelInstance, playerId) {
    channelInstance.subscribe("pos", (msg) => {
    });
  }

  function finishGame(playerId) {
    let firstRunnerUpName = "";
    let secondRunnerUpName = "";
    let winnerName = "Nobody";
    let leftoverPlayers = new Array();
    for (let item in players) {
      leftoverPlayers.push({
        nickname: players[item].nickname,
        score: players[item].score,
      });
    }
  
    leftoverPlayers.sort((a, b) => {
      return b.score - a.score;
    });
    if (playerId == "") {
      if (leftoverPlayers.length >= 3) {
        firstRunnerUpName = leftoverPlayers[0].nickname;
        secondRunnerUpName = leftoverPlayers[1].nickname;
      } else if (leftoverPlayers == 2) {
        firstRunnerUp = leftoverPlayers[0].nickname;
      }
    } else {
      winnerName = players[playerId].nickname;
      if (leftoverPlayers.length >= 3) {
        firstRunnerUpName = leftoverPlayers[1].nickname;
        secondRunnerUpName = leftoverPlayers[2].nickname;
      } else if (leftoverPlayers.length == 2) {
        firstRunnerUpName = leftoverPlayers[1].nickname;
      }
    }
  
    gameRoom.publish("game-over", {
      winner: winnerName,
      firstRunnerUp: firstRunnerUpName,
      secondRunnerUp: secondRunnerUpName,
      totalPlayers: totalPlayers,
    });
  
    resetServerState();
  }

  function resetServerState() {
    peopleAccessingTheWebsite = 0;
    gameOn = false;
    gameTickerOn = false;
    totalPlayers = 0;
    alivePlayers = 0;
    for (let item in playerChannels) {
       playerChannels[item].unsubscribe();
    }
  }

  function startGame() {
    gameOn = true;
    console.log(gameOn);
  }

