var PlayerTotal = new Vue({
    el: '#ListOfPlayerOnServer',
    data: {
AllPlayerOnTheServer = [],
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
PlayerTotal.AllPlayerOnTheServer.push(newplayer);
// Add the new player on the UI

});
jcmp.AddEvent('CEF/AddPlayerOnTheListJoin',function(obj){ // list of all player
let data = JSON.parse(obj);
data.forEach(function(p) {
  let newplayer = {
    PlayerName: p.PlayerName,
    PlayerNetworkid: p.PlayerNetworkid,
    IsinLobby: p.IsinLobby,
    LobbyID: p.LobbyID
  }
  console.log("NewPlayerAdd : " + newplayer.PlayerName);
  PlayerTotal.AllPlayerOnTheServer.push(newplayer);

});
  console.log("CEF/AddPlayerOnTheListJoin All player on the server : " + PlayerTotal.AllPlayerOnTheServer);
// when all the player are push show the list of player

});
jcmp.AddEvent('CEF/UpdatePlayerOnTheServer',function(networkid,isinlobby,idlobby){
  for (let i = 0; i < PlayerTotal.AllPlayerOnTheServer.length; i++) {
    let player = PlayerTotal.AllPlayerOnTheServer[i];
    if(player.PlayerNetworkid == networkid){
      player.IsinLobby = isinlobby;
      player.LobbyID = idlobby ;
      // update the ui
      console.log("CEF/UpdatePlayerOnTheServer Player Update Lobby: " + player.IsinLobby + "lobbyId: " + player.LobbyID);
    }
  }
});

jcmp.AddEvent('CEF/RemovePlayer',function(networkid){
  for (let i = 0; i < PlayerTotal.AllPlayerOnTheServer.length; i++) {
    let lobby = PlayerTotal.AllPlayerOnTheServer[i];
    if(player.PlayerNetworkid == networkid){
      delete player;
      console.log("CEF/RemovePlayer networkId" + networkid);
    }
  }
});
