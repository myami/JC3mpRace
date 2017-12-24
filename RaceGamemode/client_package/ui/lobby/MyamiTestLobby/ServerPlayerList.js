var PlayerTotal = new Vue({
    el: '#ListOfPlayerOnServer',
    data: {
AllPlayerOnTheServer : []
    }

});

jcmp.AddEvent('CEF/AddPlayerOnTheList',function(obj){ // for people already on the server to see the new guy
let data = JSON.parse(obj);
let newplayer = {
  PlayerName: data.PlayerName,
  PlayerNetworkid: data.PlayerNetworkid,
  IsinLobby: data.IsinLobby,
  LobbyID: data.LobbyID
}
console.log("CEF/AddPlayerOnTheList new player join : " + newplayer);
for (let i = 0; i < PlayerTotal.AllPlayerOnTheServer.length; i++) {
  let player = PlayerTotal.AllPlayerOnTheServer[i];
  if (player.PlayerName == newplayer.PlayerName){
    return;
  }
}
PlayerTotal.AllPlayerOnTheServer.push(newplayer);
// Add the new player on the UI


});
jcmp.AddEvent('CEF/AddPlayerOnTheListJoin',function(obj){ // list of all player
let data = JSON.parse(obj);
/*data.forEach(function(p) {
  let newplayer = {
    PlayerName: p.PlayerName,
    PlayerNetworkid: p.PlayerNetworkid,
    IsinLobby: p.IsinLobby,
    LobbyID: p.LobbyID
  }*/
//  console.log("NewPlayerAdd : " + p.PlayerName);
//  PlayerTotal.AllPlayerOnTheServer.push(newplayer);
PlayerTotal.AllPlayerOnTheServer = data;
console.log("CEF/AddPlayerOnTheListJoin All player on the server : " + PlayerTotal.AllPlayerOnTheServer);
// when all the player are push show the list of player

});

jcmp.AddEvent('CEF/UpdatePlayerOnTheServer',function(networkid,isinlobby,idlobby){
  for (let i = 0; i < PlayerTotal.AllPlayerOnTheServer.length; i++) {
    let player = PlayerTotal.AllPlayerOnTheServer[i];
    if(player.PlayerNetworkid == networkid){
      player.IsinLobby = isinlobby;
      if (idlobby != 500){
        player.LobbyID = idlobby ;

      }
      else{
        player.LobbyID = undefined;
      }
      // update the ui
      console.log("CEF/UpdatePlayerOnTheServer Player Update Lobby: " + player.IsinLobby + "lobbyId: " + player.LobbyID);
    }
  }
});

jcmp.AddEvent('CEF/RemovePlayer',function(networkid){
  for (let i = 0; i < PlayerTotal.AllPlayerOnTheServer.length; i++) {
    let lobby = PlayerTotal.AllPlayerOnTheServer[i];
    if(lobby.PlayerNetworkid == networkid){
      PlayerTotal.AllPlayerOnTheServer.splice(i,1);
      console.log("CEF/RemovePlayer networkId" + networkid);
    }
  }
});
