

jcmp.events.AddRemoteCallable('Player_Create_Lobby',function(player){
   race.game.lobbys["lobby" + race.game.lobbycount] = [];
   race.game.lobbys["lobby" + race.game.lobbycount].push(player);
   player.race.lobbyid = race.game.lobbycount;
   jcmp.events.CallRemote('NewLobby',null,JSON.stringify("lobby" + race.game.lobbycount),JSON.stringify(player.name)); // id of the lobby and name of the creator of the lobby
   race.game.lobbycount ++;
   console.log(race.game.lobbys);
   jcmp.events.CallRemote('Lobby_Update_state_Server',null,player.name,JSON.stringify("OnLobby"));
   race.chat.send(player,"[SERVER] You Create the lobby with the id" + player.race.lobbyid);

});
jcmp.events.AddRemoteCallable('Player_Join_Lobby',function(player,id){
  if (race.game.lobbys["lobby" + id]){
    race.game.lobbys["lobby" + id].push(player);
    player.race.lobbyid = id;
    race.chat.send(player,"[SERVER] You Just join the lobby" + id);
    jcmp.events.CallRemote('Lobby_Update_state_Server',null,player.name,JSON.stringify("OnLobby"));
  }
  else{
    race.chat.send(player,"[SERVER] ID not correct");
    jcmp.events.CallRemote('JoinLobby_show_button',player);
  }


});

jcmp.events.AddRemoteCallable('Player_Remove_Lobby',function(player){
    race.game.lobbys["lobby" +  player.race.lobbyid].removePlayer(player);
    race.chat.send(player,"[SERVER] You Removed from the lobby" + player.race.lobbyid);
    // if lobby is empty remove it
    player.race.lobbyid = 0;
    jcmp.events.CallRemote('Lobby_Update_state_Server',null,player.name,JSON.stringify("Waiting"));


});
