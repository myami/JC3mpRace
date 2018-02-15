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
        if (this.imhost){
          // delete the lobby
          jcmp.CallEvent('DeleteLobby');
          this.imhost = false;
        }
        console.log("PlayerLeave");
        this.PlayerLobbyData.LobbyName = undefined ;
        this.PlayerLobbyData.NumberofPlayer = undefined ;
        this.PlayerLobbyData.MapName = undefined ;
        this.PlayerLobbyData.RaceID = undefined ;
        this.PlayerLobbyData.TypeRace = undefined ;
        this.PlayerLobbyData.LobbyID = undefined ;
        this.PlayerLobbyData.PlayerListName = [] ;

        $("#DivLobbyJoined").hide();
        jcmp.CallEvent('ShowServerList');

        jcmp.CallEvent('Client/Player_Remove_Lobby_Test');




      },

      ready: function() { // not working yet
        jcmp.CallEvent('Client/Ready_Player_Server_Test');
      },
      StartRace : function(){
          jcmp.CallEvent('LaunchRace');
          console.log("Start Race");
          $("#TypeSelect").hide();
          $("#MapSelectdiv").hide();
          $("#DivLobbyJoined").hide();



      },
      ShowMapList: function(){
        $("#MapSelectdiv").show();
        jcmp.CallEvent('ShowMapSelectDiv',true);

      },
      ShowTypeList: function(){
        $("#TypeSelect").show();
        jcmp.CallEvent('ShowTypeSelectDiv',true);


      },
        generateThumbUrl: generateThumbUrl
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



});

jcmp.AddEvent('CEF/AddPlayerOnLobbyMenu',function(id,playername){
  if (LobbyJoined.PlayerLobbyData.LobbyID == id){
    for (let i = 0; i <   LobbyJoined.PlayerLobbyData.PlayerListName.length; i++) {
      let player = LobbyJoined.PlayerLobbyData.PlayerListName[i];
      if(player == playername){
        return;

      }
    }
    LobbyJoined.PlayerLobbyData.PlayerListName.push(playername);
    // show to everyone that are on the lobby the new guy
    console.log("CEF/AddPlayerOnLobbyMenu newplayer" + playername + "PlayerListName" + lobby.PlayerListName);

  }



});



jcmp.AddEvent('CEF/PlayerRemoveLobby',function(playername){
  for (let i = 0; i < LobbyJoined.PlayerLobbyData.PlayerListName.length; i++) {
    let playerlist = LobbyJoined.PlayerLobbyData.PlayerListName[i];
    if (playerlist == playername){
      LobbyJoined.PlayerLobbyData.PlayerListName.splice(i,1);
    }
  }

});


jcmp.AddEvent('CEF/PlayerReady_Lobby',function(id,playername){ // need to do it

});


jcmp.AddEvent('CEF/TypeOfRace',function(type){ // update for the player on the lobby menu
LobbyJoined.PlayerLobbyData.TypeRace = type;
console.log("CEF/TypeOfRace for player in the lobby that change" + LobbyJoined.PlayerLobbyData.TypeRace);
});


jcmp.AddEvent('CEF/MapOfRace',function(map,id){ // update for the player on the lobby menu
LobbyJoined.PlayerLobbyData.MapName = map;
LobbyJoined.PlayerLobbyData.RaceID = id;
console.log("CEF/MapOfRace for player in the lobby that change" + LobbyJoined.PlayerLobbyData.MapName );
});

jcmp.AddEvent('CEF/ShowLobbyMenu',function(){
    $("#DivLobbyJoined").show();
});
jcmp.AddEvent('CEF/HideLobbyMenu',function(id){

  if (id == LobbyJoined.PlayerLobbyData.LobbyID){
    $("#DivLobbyJoined").hide();
    jcmp.CallEvent('Client/Player_Remove_Lobby_Test');
    console.log("PlayerLeave");
    LobbyJoined.PlayerLobbyData.LobbyName = undefined ;
    LobbyJoined.PlayerLobbyData.NumberofPlayer = undefined ;
    LobbyJoined.PlayerLobbyData.MapName = undefined ;
    LobbyJoined.PlayerLobbyData.RaceID = undefined ;
    LobbyJoined.PlayerLobbyData.TypeRace = undefined ;
    LobbyJoined.PlayerLobbyData.LobbyID = undefined ;
    LobbyJoined.PlayerLobbyData.PlayerListName = [] ;
      jcmp.CallEvent('ShowServerList');
      jcmp.CallEvent('LobbyIsRemovedP');
  }

});

jcmp.AddEvent('CEF/ImHost',function(bool){
  LobbyJoined.imhost = bool;
});
