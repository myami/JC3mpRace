jcmp.events.AddRemoteCallable('Player_Create_Lobby', function(player) {
  let id = Object.keys(race.game.lobbys).length;
  console.log(id);
  race.game.lobbys[id] = [];
  race.game.lobbys[id].push(player);
  player.race.lobbyid = id;
  jcmp.events.CallRemote('NewLobby', null,player.race.lobbyid, player.name); // id of the lobby and name of the creator of the lobby
  jcmp.events.CallRemote('AddPlayerLobbyArray', player, player.race.lobbyid, player.name);
  jcmp.events.CallRemote('Lobby_Update_state',null,player.name,JSON.stringify('In the Lobby : ' + player.race.lobbyid));

  race.chat.send(player, "[SERVER] You Create the lobby with the id" + player.race.lobbyid);
});

jcmp.events.AddRemoteCallable('Player_Join_Lobby', function(player, id) {
  console.log(id);
  if (id == undefined){
    return;
  }
  if (race.game.lobbys[id]) {
    player.race.lobbyid = id;
    const data = {
      players:  race.game.lobbys[id].map(p => ({
        name: p.escapedNametagName
      }))
    };
    jcmp.events.CallRemote('AddPlayerLobbyArray_All', player, id, JSON.stringify(data));
    for (var i = 0; i <race.game.lobbys[id].length; i++) {
      const playertoupdate =   race.game.lobbys[id][i];
      console.log(playertoupdate.name);
      jcmp.events.CallRemote('AddPlayerLobbyArray', playertoupdate,id, player.name); // remove the player to everyone on is lobby
    }
    race.game.lobbys[id].push(player);
    race.chat.send(player, "[SERVER] You Just join the lobby" + id);
    jcmp.events.CallRemote('Lobby_Update_Player', null, id, race.game.lobbys[id].length);
    jcmp.events.CallRemote('Lobby_Update_state',null,player.name,JSON.stringify('In the Lobby : ' + player.race.lobbyid));

  } else {
    race.chat.send(player, "[SERVER] ID not correct");
  }


});

jcmp.events.AddRemoteCallable('Player_Remove_Lobby', function(player) {
  race.game.lobbys[player.race.lobbyid].removePlayer(player);
  jcmp.events.CallRemote('Lobby_Update_Player', null, player.race.lobbyid, race.game.lobbys[player.race.lobbyid].length); // update to everyone the length of the lobby
  for (var i = 0; i < race.game.lobbys[player.race.lobbyid].length; i++) {
    const playertoupdate = race.game.lobbys[player.race.lobbyid][i];
    jcmp.events.CallRemote('Lobby_remove_player', playertoupdate, player.name); // remove the player to everyone on is lobby

  }
  race.chat.send(player, "[SERVER] You Removed from the lobby" + player.race.lobbyid);
  // if lobby is empty remove it
  if (race.game.lobbys[player.race.lobbyid].length == 0) {
    delete race.game.lobbys[player.race.lobbyid] ;
    jcmp.events.CallRemote("DeleteLobby", null, player.race.lobbyid);
    console.log("ArrayEmpty");
  }
  player.race.lobbyid = 0;
  player.race.ready = false;
  jcmp.events.CallRemote('Lobby_Update_state',null,player.name,JSON.stringify('LobbySelectMenu'));
});
jcmp.events.AddRemoteCallable('Ready_Player_Server', function(player) {
  player.race.ready = true;
  for (var i = 0; i < race.game.lobbys[player.race.lobbyid].length; i++) {
    const playertoupdate = race.game.lobbys[player.race.lobbyid][i];
    console.log(playertoupdate.name);
    jcmp.events.CallRemote('Lobby_Player_Ready', playertoupdate, player.name);

  }
})
