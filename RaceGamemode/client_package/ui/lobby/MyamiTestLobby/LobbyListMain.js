var LobbyMain = new Vue({
    el: '#lobbyList',
    data: function() {
      return{
        LobbyServerList : [],
        currentSelected: null,
        oldSelected: null
    };

    },
    methods: {
      selectLobby: function(raceid) {
          this.currentSelected = raceid;
          $("#btnJoin").removeAttr("disabled");
          console.log("RaceId: "+raceid);
      },
      logtest: function (raceid){
        console.log(raceid);
      },
      generateThumbUrl: generateThumbUrl

    }
});
$("#btnCreate").click(function(){
  let name = "TestLobby";
  jcmp.CallEvent('Client/Player_Created_Lobby_Test',name);
  console.log("Lobby created with the name : " + name);
});
$("#btnJoin").click(function(){
  jcmp.CallEvent('Client/Player_Join_Lobby_Test',LobbyMain.currentSelected);
  console.log("PlayerJoinLobby" + LobbyMain.currentSelected);
});


//{LobbyName:"test1",NumberofPlayer:0,MapName:"Yolo",TypeRace:"Classic",LobbyID:0,PlayerCreated:"Myami"},{LobbyName:"test2",NumberofPlayer:0,MapName:"Yolo",TypeRace:"Classic",LobbyID:1,PlayerCreated:"Myami"}

jcmp.AddEvent('CEF/LobbyCreated',function(Obj){ // show the lobby on the server list
  let data = JSON.parse(Obj);
  let NewLobby = {
    LobbyName: data.LobbyName,
    NumberofPlayer: data.NumberofPlayer,
    MapName: "RaceIsland",
    TypeRace:"Classic",
    LobbyID: data.LobbyID,
    RaceID:data.RaceID,
    PlayerCreated: data.PlayerCreated,
  }
  console.log("CEF/LobbyCreated NewLobby" + NewLobby);
  LobbyMain.LobbyServerList.push(NewLobby);
  console.log("LobbyServerList " + JSON.stringify(LobbyMain.LobbyServerList));
//LobbyServerList is an array with all the lobby create on the server
});


jcmp.AddEvent('CEF/UpdateLengthLobby',function(id,newlength){
  for (let i = 0; i <   LobbyMain.LobbyServerList.length; i++) {
    let lobby = LobbyMain.LobbyServerList[i];
    if(lobby.LobbyID == id){
      lobby.NumberofPlayer = newlength;
      console.log("CEF/UpdateLengthLobby" +  lobby.NumberofPlayer);
      // show to everyone that are on the main menu the new lenght
    }
  }
});




jcmp.AddEvent('CEF/ShowLobbyList',function(boolean){
  // show the LobbyServerList to the player or not
});


jcmp.AddEvent('CEF/TypeOfRaceSelected',function(id,type){    // update the UI on server list
  for (let i = 0; i <   LobbyMain.LobbyServerList.length; i++) { // maybe can remove this
    let lobby = LobbyMain.LobbyServerList[i];
    if(lobby.LobbyID == id){
      lobby.TypeRace = type;
      // change on the LobbyServerList the type
      console.log("CEF/TypeOfRaceSelected NewType for serverlists" + lobby.TypeRace);
    }
  }
});


jcmp.AddEvent('CEF/MapOfRaceSelected',function(id,map){      // update the UI on server list
  for (let i = 0; i <   LobbyMain.LobbyServerList.length; i++) {   // maybe can remove this event
    let lobby = LobbyMain.LobbyServerList[i];
    if(lobby.LobbyID == id){
      lobby.MapName = map;
      // change on the LobbyServerList the map
      console.log("CEF/MapOfRaceSelected Newmap for the serverlists" + lobby.MapName);
    }
  }
});
