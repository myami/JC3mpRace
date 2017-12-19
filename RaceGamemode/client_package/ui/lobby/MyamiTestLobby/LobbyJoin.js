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
          PlayerListName:[]
        },
      imhost: false
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
        jcmp.CallEvent('Client/Player_Remove_Lobby_Test');
        console.log("PlayerLeave");
        this.PlayerLobbyData.LobbyName = undefined ;
        this.PlayerLobbyData.NumberofPlayer = undefined ;
        this.PlayerLobbyData.MapName = undefined ;
        this.PlayerLobbyData.RaceID = undefined ;
        this.PlayerLobbyData.TypeRace = undefined ;
        this.PlayerLobbyData.LobbyID = undefined ;
        this.PlayerLobbyData.PlayerListName = [] ;

      },

      ready: function() { // not working yet
        jcmp.CallEvent('Client/Ready_Player_Server_Test');
      },
      StartRace : function(){
          jcmp.CallEvent('LaunchRace');
          console.log("Start Race");
      }
    }

});


jcmp.AddEvent('CEF/PlayerJoinLobby',function(id,obj){ // Player joining the lobby

  let data = JSON.parse(obj);

    LobbyJoined.PlayerLobbyData.LobbyName = data.LobbyName;
    LobbyJoined.PlayerLobbyData.NumberofPlayer = data.NumberofPlayer;
    LobbyJoined.PlayerLobbyData.MapName = data.MapName;
    LobbyJoined.PlayerLobbyData.RaceID = data.RaceID;
    LobbyJoined.PlayerLobbyData.TypeRace = data.TypeRace;
    LobbyJoined.PlayerLobbyData.LobbyID = id;
      console.log("playerlist" + data.PlayerListName);

    for (let i = 0; i < data.PlayerListName.length; i++) {
      let playername = data.PlayerListName[i];
      LobbyJoined.PlayerLobbyData.PlayerListName.push(playername)
      console.log("CEF/PlayerJoinLobby player" + playername);
    }


  if (LobbyJoined.PlayerLobbyData.PlayerListName.length > 1){
      LobbyJoined.imhost = false;
  }
  else{
    console.log("CEF/PlayerJoinLobby playeralone" +   LobbyJoined.PlayerLobbyData.PlayerListName[0]);
    LobbyJoined.imhost = true; // Show the admin UI to can select the map and type and launch the race
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



jcmp.AddEvent('CEF/PlayerRemoveLobby',function(playername){
  console.log("EVENT IS CALL LOL YOU SEE ME ");
  console.log(LobbyJoined.PlayerLobbyData.PlayerListName);
  for (let i = 0; i < LobbyJoined.PlayerLobbyData.PlayerListName.length; i++) {
    console.log("HOW YEAH I AM CALL " + i);
    let playerlist = LobbyJoined.PlayerLobbyData.PlayerListName[i];
    console.log("AND MY FUCKING NAME IS" + playerlist);
    console.log(playerlist);
    if (playerlist == playername){
      console.log("PlayerFindLOLILOL");
      LobbyJoined.PlayerLobbyData.PlayerListName.splice(i,1);
    }
  }
  console.log("AND I AM DEAD ");
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
