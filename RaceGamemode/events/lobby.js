

jcmp.events.AddRemoteCallable('Player_Join_Lobby',function(player){
  race.game.players.onlobby.push(player);
  race.chat.send(player,"[SERVER] You Just join the lobby");
      jcmp.events.CallRemote('Lobby_Update_state_Server',null,player.name,JSON.stringify("OnLobby"));

});

jcmp.events.AddRemoteCallable('Player_Remove_Lobby',function(player){
    race.game.players.onlobby.removePlayer(player);
    race.chat.send(player,"[SERVER] You Removed from the lobby");
    jcmp.events.CallRemote('Lobby_Update_state_Server',null,player.name,JSON.stringify("Waiting"));

});


jcmp.events.AddRemoteCallable('TypeofRaceSelected_Admin',function(player,Type){
  for (var i = 0; i < race.game.players.onlobby.length; i++) {
    const playerlobby = race.game.players.onlobby[i];
    jcmp.events.CallRemote('TypeSelect_All_Server',playerlobby,Type);

  }

})
