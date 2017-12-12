var LobbyJoined = new Vue({
    el: '#DivLobbyJoined',
    data: {
      PlayerLobbyData: {
          LobbyName: undefined,
          NumberofPlayer: undefined,
          MapName: undefined,
          RaceID: undefined,
          TypeRace:undefined,
          LobbyID: undefined,
          PlayerListName:undefined
        },
      imhost: true
    },
    methods: {
      //admin commands
      selectRace: function(raceid, name) {
        jcmp.CallEvent('Client/NewMapSelected',raceid,name);
        console.log("MapSelect");
      },
      selectType: function(typeid) {
        jcmp.CallEvent('Client/NewTypeSelected',typeid);
        console.log("TypeSelect");
      },
      lobbyKick: function(name) { // need to be replace by networkid
          // Event to kick the player
          //jcmp.CallEvent('Client/KickPlayer',networkId);
      },
      // end admin commands
      leaveLobby: function() {
        LobbyJoined.PlayerLobbyData = [];
        jcmp.CallEvent('Client/Player_Remove_Lobby_Test');
        console.log("PlayerLeave");
      },
      ready: function() { // not working yet
        jcmp.CallEvent('Client/Ready_Player_Server_Test');
      }
    }
});


jcmp.AddEvent('CEF/PlayerJoinLobby',function(id,obj){ // Player joining the lobby
  let data = JSON.parse(obj);
  let NewLobby = {
    LobbyName: data.LobbyNameReceived,
    NumberofPlayer: data.PlayerListName.length,
    MapName: data.MapName,
    RaceID: data.RaceID,
    TypeRace:data.TypeRace,
    LobbyID: id,
    PlayerListName:data.PlayerListName
  }
  console.log("CEF/PlayerJoinLobby NewLobby" + NewLobby );
  LobbyJoined.PlayerLobbyData = NewLobby;
  if (data.PlayerListName.length >= 1){
      LobbyJoined.imhost = false;
    for (let i = 0; i <   data.PlayerListName.length; i++) {
      let playername = data.PlayerListName[i];
      // Add all the player was before you on the UI lobby
      console.log("CEF/PlayerJoinLobby player" + playername);
    }
  }
  else{
    console.log("CEF/PlayerJoinLobby playeralone" + data.PlayerListName[0]);
    LobbyJoined.imhost = true; // Show the admin UI to can select the map and type and launch the race

    // show the data.PlayerListName[0]

  }

// Show the lobby UI with the map name etc...

});

jcmp.AddEvent('CEF/AddPlayerOnLobbyMenu',function(id,playername){ // Player already on the lobby to see the new guy
  for (let i = 0; i <   LobbyMain.LobbyServerList.length; i++) {
    let lobby = LobbyMain.LobbyServerList[i];
    if(lobby.LobbyID == id){
      LobbyJoined.PlayerLobbyData.PlayerListName.push(playername);
      // show to everyone that are on the lobby the new guy
      console.log("CEF/AddPlayerOnLobbyMenu newplayer" + playername + "PlayerListName" + lobby.PlayerListName);
    }
  }
});


jcmp.AddEvent('CEF/PlayerRemoveLobby',function(id,playername){
  for (let i = 0; i <   LobbyMain.LobbyServerList.length; i++) {
    let lobby = LobbyMain.LobbyServerList[i];
    if(lobby.LobbyID == id){
      for (let i = 0; i <   PlayerListName.length; i++) {
        let player = PlayerListName[i];
        if (player == playername){
          delete player;
          //Remove player to everyone on the lobby
          console.log("CEF/PlayerRemoveLobby" +playername + "NewArray" + lobby.PlayerListName);
        }

      }

    }
  }
});


jcmp.AddEvent('CEF/PlayerReady_Lobby',function(id,playername){ // need to do it

});


jcmp.AddEvent('CEF/TypeOfRace',function(type){ // update for the player on the lobby menu
LobbyJoined.PlayerLobbyData.TypeRace = type;
console.log("CEF/TypeOfRace for player in the lobby that change" + LobbyJoined.PlayerLobbyData.TypeRace);
});


jcmp.AddEvent('CEF/MapOfRace',function(map){ // update for the player on the lobby menu
LobbyJoined.PlayerLobbyData.MapName = map;
console.log("CEF/MapOfRace for player in the lobby that change" + LobbyJoined.PlayerLobbyData.MapName );
});
