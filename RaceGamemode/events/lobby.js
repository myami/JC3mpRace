
jcmp.events.AddRemoteCallable('Server/Player_Create_Lobby_Test', function(player, LobbyNameReceived) {
  if (player.race.lobbyid == undefined) {
    let id = Object.keys(race.game.lobbys).length;
    console.log(id);
    race.game.lobbys[id] = [];

    player.race.lobbyid = id;
    let NewLobbyObject = {
      LobbyName: "testlobby", //LobbyNameReceived
      NumberofPlayer: 1,
      MapName: "CarRaceBoomIsland",
      RaceID: 50,
      TypeRace: "Classic",
      LobbyID: id,
      PlayerCreated: player.name,
      PlayerList: [player],
      PlayerListName: [player.name]
    };
    race.game.lobbys[id].push(NewLobbyObject);
    let lobbytosendtoclient = {
      LobbyName: "testlobby", //LobbyNameReceived
      NumberofPlayer: 1,
      MapName: "CarRaceBoomIsland",
      TypeRace: "Classic",
      LobbyID: id,
      RaceID: 50, // CarRaceBoomIsland
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
      if (racetofind.raceid == 50) { // should be 12 . 50 is testing
        races = racetofind;
        havefind = true;
        player.race.raceselect = i;
      }
    }
    player.race.typeselect = 0; // setting the type
    jcmp.events.Call('Server/MapList',player);
    jcmp.events.Call('UpdatePlayerOnTheServer', player);

  } else {
    console.log("Lobby Already created");
  }

});


jcmp.events.AddRemoteCallable('Server/Player_Join_Lobby_Test', function(player, id) {
  if (player.race.lobbyid == undefined) {
    console.log(race.game.lobbys[id][0]);
    if (id == undefined) {
      return;
    }
    if (race.game.lobbys[id][0]) {
      player.race.lobbyid = id;
      race.game.lobbys[id][0].PlayerListName.push(player.name);
      race.game.lobbys[id][0].PlayerList.push(player);
      race.game.lobbys[id][0].NumberofPlayer = race.game.lobbys[id][0].PlayerList.length;
      let lobbydata = {
        LobbyName: race.game.lobbys[id][0].LobbyName,
        NumberofPlayer: race.game.lobbys[id][0].PlayerListName.length,
        MapName: race.game.lobbys[id][0].MapName,
        TypeRace: race.game.lobbys[id][0].TypeRace,
        LobbyID: id,
        RaceID: race.game.lobbys[id][0].RaceID,
        PlayerCreated: race.game.lobbys[id][0].PlayerCreated,
        PlayerListName: race.game.lobbys[id][0].PlayerListName
      }

      jcmp.events.CallRemote('Client/PlayerJoinLobby', player, id, JSON.stringify(lobbydata)); // Show the UI of the lobby (player on the lobby , map of the lobby etc..)
      jcmp.events.CallRemote('Client/UpdateLengthLobby', null, id, race.game.lobbys[id][0].NumberofPlayer); // Update the length of a lobby

      for (let i = 0; i < race.game.lobbys[player.race.lobbyid][0].PlayerList.length; i++) {
        let players = race.game.lobbys[player.race.lobbyid][0].PlayerList[i];
        if (players.networkId != player.networkId) {
          console.log("Show new lobby");
          jcmp.events.CallRemote('Client/AddPlayerOnLobbyMenu', players, player.race.lobbyid, player.name); // Add on the lobby menu of everyone in the lobby the name of the new guy
        }
      }
      jcmp.events.Call('UpdatePlayerOnTheServer', player);


    } else {
      race.chat.send(player, "[SERVER] ID not correct");
    }

  } else {
    race.chat.send(player, "[SERVER] Player already on a lobby");
  }


});



jcmp.events.AddRemoteCallable('Server/Player_Remove_Lobby_Test', function(player) { // need to rewrite it a little
  if (player.race.lobbyid != undefined) {
    for (let i = 0; i < race.game.lobbys[player.race.lobbyid][0].PlayerList.length; i++) {
      let players = race.game.lobbys[player.race.lobbyid][0].PlayerList[i];
      if (players.networkId != player.networkId) {
        jcmp.events.CallRemote('Client/PlayerRemoveLobby', players, player.name);
      }
    }
    console.log("0");
    for (let i = 0; i < race.game.lobbys[player.race.lobbyid][0].PlayerList.length; i++) { // Delete the player from the serverside array
      let players = race.game.lobbys[player.race.lobbyid][0].PlayerList[i];
      if (players.networkId == player.networkId) {
        race.game.lobbys[player.race.lobbyid][0].PlayerList.splice(i, 1);
        race.game.lobbys[player.race.lobbyid][0].PlayerListName.splice(i, 1);
        console.log(race.game.lobbys[player.race.lobbyid][0].PlayerList);
        race.game.lobbys[player.race.lobbyid][0].NumberofPlayer = race.game.lobbys[player.race.lobbyid][0].PlayerList.length; // update the new length serverside
        jcmp.events.CallRemote('Client/UpdateLengthLobby', null, player.race.lobbyid, race.game.lobbys[player.race.lobbyid][0].NumberofPlayer); // Update the length of a lobby

      }
    }
    for (let i = 0; i < race.game.lobbys[player.race.lobbyid][0].PlayerListName.length; i++) { // Delete the player from the serverside array PlayerListName
      let players = race.game.lobbys[player.race.lobbyid][0].PlayerListName[i];
      if (players.name == player.name) {
        race.game.lobbys[player.race.lobbyid][0].PlayerListName.splice(i, 1);
        console.log("remove in PlayerListName" + race.game.lobbys[player.race.lobbyid][0].PlayerListName);
      }
    }

    if (race.game.lobbys[player.race.lobbyid][0].PlayerList <= 0) { // delete lobby
      console.log("DeleteLobby");
    }

    player.race.lobbyid = undefined;
    player.race.ready = false;
    jcmp.events.Call('UpdatePlayerOnTheServer', player);
  } else {
    race.chat.send(player, "[SERVER] Player already out of a lobby")
  }
});

jcmp.events.AddRemoteCallable('Server/Ready_Player_Server_Test', function(player) { // need to add it on cef
  player.race.ready = true;
  // jcmp.CallRemote on   race.game.lobbys[player.race.lobbyid].PlayerList
  for (let i = 0; i < race.game.lobbys[player.race.lobbyid][0].PlayerList.length; i++) {
    let players = race.game.lobbys[player.race.lobbyid][0].PlayerList[i];
    jcmp.events.CallRemote('Client/PlayerReady_Lobby', players, player.race.lobbyid, player.name);
  }
});

jcmp.events.AddRemoteCallable('Server/TypeOfRace_Test', function(player, int) { // 0 is classic , 1 MultiCrew , 2 TTS , 3 APO , 4 MultiplePath
  player.race.typeselect = int;
  let name;
  // then send to everyone
  if (int == 0) {
    name = "Classic"
  }
  if (int == 1) { // don't work for the release
    name = "MultiCrew"
  }
  if (int == 2) {
    name = "TTS"
  }
  if (int == 3) {
    name = "Apo"
  }
  if (int == 4) {
    name = "MultiplePath"
  }
  race.game.lobbys[player.race.lobbyid].TypeRace = name;

  jcmp.events.CallRemote('Server/TypeOfRaceSelected', null, player.race.lobbyid, name);
  for (let i = 0; i < race.game.lobbys[player.race.lobbyid][0].PlayerList.length; i++) {
    let players = race.game.lobbys[player.race.lobbyid][0].PlayerList[i];
    jcmp.events.CallRemote('Client/TypeOfRace', players, name);
  }

});

jcmp.events.AddRemoteCallable('Server/MapRace_Test', function(player, int) { //raceid
  console.log(player.race.raceselect);
  let races;
  let havefind = false;
  let name ;
  for (var i = 0; i < race.game.RaceList.length; i++) {
    let racetofind = race.game.RaceList[i];
    if (racetofind.raceid == int) {
      races = racetofind;
      havefind = true;
      name = racetofind.Name;
      player.race.raceselect = i;
      race.game.lobbys[player.race.lobbyid].MapName = name;
      jcmp.events.CallRemote('Client/MapOfRaceSelected', null, player.race.lobbyid, name,int);
      for (let i = 0; i < race.game.lobbys[player.race.lobbyid][0].PlayerList.length; i++) {
        let players = race.game.lobbys[player.race.lobbyid][0].PlayerList[i];
        jcmp.events.CallRemote('Client/MapOfRace', players, name);
      }
    }
  }

});







// Myami Test Lobby All PlayerList

jcmp.events.Add('PlayerJoinServer', function(player) { // call when the player join the server
  for (let i = 0; i < race.AllPlayerOnTheServer.length; i++) {
    let players = race.AllPlayerOnTheServer[i];
    if (players.PlayerNetworkid == player.networkId) {
      return;
    }
  }


  let newplayer = {
    PlayerName: player.name,
    PlayerNetworkid: player.networkId,
    IsinLobby: false,
    LobbyID: undefined
  };

  race.AllPlayerOnTheServer.push(newplayer); // save the same data that will be on cef


  if (race.AllPlayerOnTheServer.length > 1) {

    for (let i = 0; i < jcmp.players.length; i++) { //CallRemote to everyone to see the new Player

        let players = jcmp.players[i];
        if (players.networkId != player.networkId) {

        jcmp.events.CallRemote("Client/AddPlayerOnTheList", players, JSON.stringify(newplayer));
      }
    }
  }

  // send to the player the all list with himslef
  jcmp.events.CallRemote("Client/AddPlayerOnTheListJoin", player, JSON.stringify(race.AllPlayerOnTheServer));


});



jcmp.events.Add('UpdatePlayerOnTheServer', function(player) {
  let playertochange;
  if (player.race.lobbyid != undefined) {
    for (let i = 0; i < race.AllPlayerOnTheServer.length; i++) {
      let players = race.AllPlayerOnTheServer[i];

      if (players.PlayerNetworkid == player.networkId) {

        players.IsinLobby = true;
        players.LobbyID = player.race.lobbyid;
        playertochange = players;

      }
    }
  } else {
    for (let i = 0; i < race.AllPlayerOnTheServer.length; i++) {
      let players = race.AllPlayerOnTheServer[i];
      if (players.PlayerNetworkid == player.networkId) {

        players.IsinLobby = false;
        players.LobbyID = 500;
        playertochange = players;


        //CallRemote

      }
    }


  }

  for (let i = 0; i < jcmp.players.length; i++) {

    let playerss = jcmp.players[i];

    jcmp.events.CallRemote("Client/UpdatePlayerOnTheServer", playerss, playertochange.PlayerNetworkid, playertochange.IsinLobby, playertochange.LobbyID);
  }



});

jcmp.events.Add('DeletePlayerOnTheserver', function(player) {
  for (let i = 0; i < race.AllPlayerOnTheServer.length; i++) {
    let players = race.AllPlayerOnTheServer[i];
    if (players.PlayerNetworkid == player.networkId) {
      race.AllPlayerOnTheServer.splice(i, 1);
      jcmp.events.CallRemote("Client/RemovePlayer", null, player.networkId);
    }
  }
});

jcmp.events.AddRemoteCallable('LaunchRace', function(player) {
  jcmp.events.Call('race_start_index_Beta', player)
});


jcmp.events.AddRemoteCallable('Server/MultiCrew_SelectRole',function(player,int){
  if(int == 0){
    console.log("0multicrerole");
    player.race.partnerplayer[0].race.driver = true;
    player.race.partnerplayer[1].race.driver = false;
    jcmp.events.CallRemote('Client/MultiCrew_RoleSelected',player.race.partnerplayer[1],0);
  }
  if (int == 1){
    console.log("1multicrerole");

    player.race.partnerplayer[0].race.driver = false;
    player.race.partnerplayer[1].race.driver = true;
    jcmp.events.CallRemote('Client/MultiCrew_RoleSelected',player.race.partnerplayer[1],1);
  }
});

jcmp.events.Add('Server/MapList',function(player){ // call when a player is a lobby admin to see the list

  for (var i = 0; i < race.game.RaceList.length; i++) {
    let races = race.game.RaceList[i];
    if (races.multiplepath){
      let map = {
            raceid: races.raceid,
            name: races.Name,
            type: "MultiplePath"
      }
      console.log(races.Name);
      jcmp.events.CallRemote('Client/MapList',player,JSON.stringify(map));

    }
    else{ 
      let map = {
          raceid: races.raceid,
          name: races.Name,
          type: "Classic,TTS,Apo"
      }
      jcmp.events.CallRemote('Client/MapList',player,JSON.stringify(map));
    }

    }


})
