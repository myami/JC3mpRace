jcmp.events.AddRemoteCallable('Server/Player_Create_Lobby_Test', function(player) {

  if (!race.utils.isAdmin(player)) {
    return;
  }
  if (player.race.lobbyid == undefined) {
    jcmp.events.CallRemote('Client/isAdmin', player); // send to everyone the new lobby object for the array in cef
    let id = race.game.lobbys.length;

    player.race.lobbyid = id;
    let NewLobbyObject = {
      LobbyName: `Lobby ${player.name}`, //LobbyNameReceived
      NumberofPlayer: 1,
      MapName: "CarRaceBoomIsland",
      RaceID: 50,
      TypeRace: "Classic",
      LobbyID: id,
      PlayerCreated: player.name,
      PlayerList: [player],
      PlayerListName: [player.name]
    };
    race.game.lobbys.push(NewLobbyObject);
    let lobbytosendtoclient = {
      LobbyName: `Lobby ${player.name}`, //LobbyNameReceived
      NumberofPlayer: 1,
      MapName: "Car-BetweenIslands",
      TypeRace: "Classic",
      LobbyID: id,
      RaceID: 12,
      PlayerCreated: player.name,
      PlayerListName: [player.name]
    }
    jcmp.events.CallRemote('Client/LobbyCreated', null, JSON.stringify(lobbytosendtoclient)); // send to everyone the new lobby object for the array in cef
    jcmp.events.CallRemote('Client/PlayerJoinLobby', player, id, JSON.stringify(lobbytosendtoclient)); // Show the UI of the lobby (player on the lobby , map of the lobby etc..)
    // setting the map to the player admin
    let races;
    let havefind = false;
    for (var i = 0; i < race.game.RaceList.length; i++) {
      let racetofind = race.game.RaceList[i];
      if (racetofind.raceid == 12) { // should be 12 . 50 is testing
        races = racetofind;
        havefind = true;
        player.race.raceselect = i;
      }
    }
    player.race.typeselect = 0; // setting the type
    jcmp.events.Call('Server/MapList', player);


  } else {
    console.log("Lobby Already created");
  }

});


jcmp.events.AddRemoteCallable('Server/Player_Join_Lobby_Test', function(player, id) {
  if (player.race.lobbyid == undefined) {

    if (id == undefined) {
      return;
    }
    if (race.game.lobbys[id].NumberofPlayer >= 20) {
      console.log("Lobby Full");
      return;
    }
    if (race.game.lobbys[id]) {
      player.race.lobbyid = id;
      race.game.lobbys[id].PlayerListName.push(player.name);
      race.game.lobbys[id].PlayerList.push(player);
      race.game.lobbys[id].NumberofPlayer = race.game.lobbys[id].PlayerList.length;
      let lobbydata = {
        LobbyName: race.game.lobbys[id].LobbyName,
        NumberofPlayer: race.game.lobbys[id].PlayerListName.length,
        MapName: race.game.lobbys[id].MapName,
        TypeRace: race.game.lobbys[id].TypeRace,
        LobbyID: id,
        RaceID: race.game.lobbys[id].RaceID,
        PlayerCreated: race.game.lobbys[id].PlayerCreated,
        PlayerListName: race.game.lobbys[id].PlayerListName
      }

      jcmp.events.CallRemote('Client/PlayerJoinLobby', player, id, JSON.stringify(lobbydata)); // Show the UI of the lobby (player on the lobby , map of the lobby etc..)
      jcmp.events.CallRemote('Client/UpdateLengthLobby', null, id, race.game.lobbys[id].NumberofPlayer); // Update the length of a lobby

      jcmp.events.CallRemote('Client/AddPlayerOnLobbyMenu', null, player.race.lobbyid, player.name);


    } else {
      race.chat.send(player, "[SERVER] ID not correct");
    }

  } else {
    race.chat.send(player, "[SERVER] Player already on a lobby");
  }


});


jcmp.events.AddRemoteCallable('Server/Player_Remove_Lobby_Test', function(player) { // need to rewrite it a little removed all loop should fix it
  if (player.race.lobbyid != undefined) {

    jcmp.events.CallRemote('Client/PlayerRemoveLobby', null, player.race.lobbyid, player.name);

    if (race.game.lobbys[player.race.lobbyid] != undefined) {
      for (let i = 0; i < race.game.lobbys[player.race.lobbyid].PlayerList.length; i++) { // Delete the player from the serverside array
        let players = race.game.lobbys[player.race.lobbyid].PlayerList[i];
        if (players.networkId == player.networkId) {
          race.game.lobbys[player.race.lobbyid].PlayerList.splice(i, 1);
          race.game.lobbys[player.race.lobbyid].PlayerListName.splice(i, 1);
          console.log(race.game.lobbys[player.race.lobbyid].PlayerList);
          race.game.lobbys[player.race.lobbyid].NumberofPlayer = race.game.lobbys[player.race.lobbyid].PlayerList.length; // update the new length serverside
          jcmp.events.CallRemote('Client/UpdateLengthLobby', null, player.race.lobbyid, race.game.lobbys[player.race.lobbyid].NumberofPlayer); // Update the length of a lobby

        }
      }
      for (let i = 0; i < race.game.lobbys[player.race.lobbyid].PlayerListName.length; i++) { // Delete the player from the serverside array PlayerListName
        let players = race.game.lobbys[player.race.lobbyid].PlayerListName[i];
        if (players.name == player.name) {
          race.game.lobbys[player.race.lobbyid].PlayerListName.splice(i, 1);
          console.log("Remove in PlayerListName" + race.game.lobbys[player.race.lobbyid].PlayerListName);
        }
      }

      if (race.game.lobbys[player.race.lobbyid].PlayerList <= 0) { // delete lobby
        console.log("DeleteLobby");
        LobbyDelete(player);
      }
    }


    player.race.lobbyid = undefined;
    player.race.ready = false;
  } else {
    race.chat.send(player, "[SERVER] Player already out of a lobby")
  }
});



jcmp.events.AddRemoteCallable('Server/TypeOfRace_Test', function(player, int) { // 0 is classic , 1 MultiCrew , 2 TTS , 3 APO , 4 MultiplePath
  player.race.typeselect = int;
  let name;
  // then send to everyone
  if (int == 0) {
    name = "Classic"
  }
  if (int == 2) {
    name = "TTS"
  }

  if (int == 4) {
    name = "MultiplePath"
  }
  race.game.lobbys[player.race.lobbyid].TypeRace = name;

  jcmp.events.CallRemote('Server/TypeOfRaceSelected', null, player.race.lobbyid, name);
  for (let i = 0; i < race.game.lobbys[player.race.lobbyid].PlayerList.length; i++) {
    let players = race.game.lobbys[player.race.lobbyid].PlayerList[i];
    jcmp.events.CallRemote('Client/TypeOfRace', players, name);
  }

});

jcmp.events.AddRemoteCallable('Server/MapRace_Test', function(player, int) { //raceid
  console.log(player.race.raceselect);
  let races;
  let havefind = false;
  let name;
  for (var i = 0; i < race.game.RaceList.length; i++) {
    let racetofind = race.game.RaceList[i];
    if (racetofind.raceid == int) {
      races = racetofind;
      havefind = true;
      name = racetofind.Name;
      player.race.raceselect = i;
      race.game.lobbys[player.race.lobbyid].MapName = name;
      jcmp.events.CallRemote('Client/MapOfRaceSelected', null, player.race.lobbyid, name, int);
      for (let i = 0; i < race.game.lobbys[player.race.lobbyid].PlayerList.length; i++) {
        let players = race.game.lobbys[player.race.lobbyid].PlayerList[i];
        jcmp.events.CallRemote('Client/MapOfRace', players, name, int);
      }
    }
  }

});







jcmp.events.AddRemoteCallable('LaunchRace', function(player) {
  jcmp.events.Call('race_start_index_Beta', player)
});



jcmp.events.Add('Server/MapList', function(player) { // call when a player is a lobby admin to see the list

  for (var i = 0; i < race.game.RaceList.length; i++) {
    let races = race.game.RaceList[i];
    if (races.multiplepath) {
      let map = {
        raceid: races.raceid,
        name: races.Name,
        type: "MultiplePath"
      }
      console.log(races.Name);
      jcmp.events.CallRemote('Client/MapList', player, JSON.stringify(map));

    } else {
      let map = {
        raceid: races.raceid,
        name: races.Name,
        type: "Classic"
      }
      jcmp.events.CallRemote('Client/MapList', player, JSON.stringify(map));
    }

  }


});

jcmp.events.Add('PlayerJoinSeeOldLobby', function(player, serverlist) {
  data = JSON.parse(serverlist);


  let lobbytosendtoclient = {
    LobbyName: data.LobbyName,
    NumberofPlayer: data.NumberofPlayer,
    MapName: data.MapName,
    TypeRace: data.TypeRace,
    LobbyID: data.LobbyID,
    RaceID: data.RaceID,
    PlayerCreated: data.PlayerCreated,
    PlayerListName: data.PlayerListName
  }
  jcmp.events.CallRemote('Client/LobbyCreated', player, JSON.stringify(lobbytosendtoclient));
  console.log(`Lobby add to the player ${player.name}  name of the lobby : ${data.LobbyName}`);



});

jcmp.events.AddRemoteCallable('DeleteLobby', function(player) {
  LobbyDelete(player);
});

function LobbyDelete(player) {
  let id = player.race.lobbyid;

  //Remove it on the client side on all
  jcmp.events.CallRemote('Client/DeleteLobby', null, id);


  // Remove it on the server side
  for (let i = 0; i < race.game.lobbys.length; i++) {
    let lobbylist = race.game.lobbys[i];
    if (lobbylist.LobbyID == id) {
      race.game.lobbys.splice(i, 1);
    }
  }




}

jcmp.events.AddRemoteCallable('LobbyIsRemovedP', function(player) {
  player.race.lobbyid = undefined;
});

jcmp.events.AddRemoteCallable('Server/ReadyButton', function(player) {
  player.race.ready = true;
  jcmp.events.CallRemote('Client/PlayerIsReady', null, player.race.lobbyid, player.name);

});

jcmp.events.AddRemoteCallable('Server/NotReadyButton', function(player) {
  player.race.ready = false;
  jcmp.events.CallRemote('Client/PlayerIsNotReady', null, player.race.lobbyid, player.name);

});
