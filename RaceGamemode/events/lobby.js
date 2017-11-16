

jcmp.events.AddRemoteCallable('Player_Create_Lobby',function(player){
   race.game.lobbys["lobby" + race.game.lobbycount] = [];
   race.game.lobbys["lobby" + race.game.lobbycount].push(player);
   player.race.lobbyid = race.game.lobbycount;
   jcmp.events.CallRemote('NewLobby',null,race.game.lobbycount,JSON.stringify(player.name)); // id of the lobby and name of the creator of the lobby
   race.game.lobbycount ++;
   console.log(race.game.lobbys);
   jcmp.events.CallRemote('Lobby_Update_state_Server',null,player.name,JSON.stringify("OnLobby id: " + player.race.lobbyid));
   race.chat.send(player,"[SERVER] You Create the lobby with the id" + player.race.lobbyid);

});
jcmp.events.AddRemoteCallable('Player_Join_Lobby',function(player,id){
  if (race.game.lobbys["lobby" + id]){
    race.game.lobbys["lobby" + id].push(player);
    player.race.lobbyid = id;
    race.chat.send(player,"[SERVER] You Just join the lobby" + id);
    jcmp.events.CallRemote('Lobby_Update_state_Server',null,player.name,JSON.stringify("OnLobby id: " + id));
    jcmp.events.CallRemote('Lobby_Update_Player',null,id,race.game.lobbys["lobby" + id].length);
  }
  else{
    race.chat.send(player,"[SERVER] ID not correct");
    jcmp.events.CallRemote('JoinLobby_show_button',player);
  }


});

jcmp.events.AddRemoteCallable('Player_Remove_Lobby',function(player){
    race.game.lobbys["lobby" +  player.race.lobbyid].removePlayer(player);
    jcmp.events.CallRemote('Lobby_Update_Player',null,player.race.lobbyid,race.game.lobbys["lobby" + player.race.lobbyid].length);
    race.chat.send(player,"[SERVER] You Removed from the lobby" + player.race.lobbyid);
    // if lobby is empty remove it
    if (  race.game.lobbys["lobby" +  player.race.lobbyid].length == 0){
        race.game.lobbys["lobby" +  player.race.lobbyid] = undefined;
        jcmp.events.CallRemote("DeleteLobby",null,player.race.lobbyid);
        console.log("ArrayEmpty");
    }
    player.race.lobbyid = 0;
    jcmp.events.CallRemote('Lobby_Update_state_Server',null,player.name,JSON.stringify("MainMenu"));


});
