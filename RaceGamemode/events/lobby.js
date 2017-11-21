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
  for (var i = 0; i < race.game.RaceList.length; i++) { // Create the list of map to select for the admin of the lobby
    jcmp.events.CallRemote('Race_List_Select', player, race.game.RaceList[i].raceid, race.game.RaceList[i].Name);
  }
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
        name: p.name

      }))
    };
    console.log(data.players);
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
});
jcmp.events.AddRemoteCallable('TypeOfRace',function(player,int){ // 0 is classic , 1 MultiCrew , 2 TTS , 3 APO
player.race.typeselect = int;
// then send to everyone
for (var i = 0; i < race.game.lobbys[player.race.lobbyid].length; i++) {
  const playertoupdate = race.game.lobbys[player.race.lobbyid][i];
  jcmp.events.CallRemote('ShowSelectType', playertoupdate, player.race.typeselect);

}

});
jcmp.events.AddRemoteCallable('MapRace',function(player,int){ // 0 is classic , 1 MultiCrew , 2 TTS , 3 APO
player.race.raceselect = int;
console.log(player.race.raceselect);
// then send to everyone

let races ;
for (var i = 0; i < race.game.RaceList.length; i++) {
  let racetofind = race.game.RaceList[i];
  if (racetofind.raceid == player.race.raceselect){
  races = racetofind;
}}
for (var i = 0; i < race.game.lobbys[player.race.lobbyid].length; i++) {
  const playertoupdate = race.game.lobbys[player.race.lobbyid][i];
  jcmp.events.CallRemote('ShowSelectRace', playertoupdate, races.raceid,races.Name);

}

});

jcmp.events.AddRemoteCallable('LaunchRace',function(player){
  if (player.race.typeselect != undefined && player.race.raceselect != undefined){
    jcmp.events.Call('race_start_index',player)
  }
});
