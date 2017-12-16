

/*
jcmp.events.AddRemoteCallable('Player_Create_Lobby', function(player) {
  if (player.race.lobbyid == undefined) {
    let id = Object.keys(race.game.lobbys).length;
    console.log(id);
    race.game.lobbys[id] = [];
    race.game.lobbys[id].push(player);
    player.race.lobbyid = id;
    jcmp.events.CallRemote('NewLobby', null, player.race.lobbyid, player.name); // id of the lobby and name of the creator of the lobby
    jcmp.events.CallRemote('AddPlayerLobbyArray', player, player.race.lobbyid, player.name);
    jcmp.events.CallRemote('Lobby_Update_state', null, player.name, JSON.stringify('In the Lobby : ' + player.race.lobbyid));

    race.chat.send(player, "[SERVER] You Create the lobby with the id" + player.race.lobbyid);
    for (var i = 0; i < race.game.RaceList.length; i++) { // Create the list of map to select for the admin of the lobby
      jcmp.events.CallRemote('Race_List_Select', player, race.game.RaceList[i].raceid, race.game.RaceList[i].Name);
    }
  } else {
    console.log("Lobby Already created");
  }

});

jcmp.events.AddRemoteCallable('Player_Join_Lobby', function(player, id) {
  if (player.race.lobbyid == undefined) {
    console.log(id);
    if (id == undefined) {
      return;
    }
    if (race.game.lobbys[id]) {
      player.race.lobbyid = id;

      const data = {
        players: race.game.lobbys[id].map(p => ({ // maybe this is the issue
          name: p.name
        }))
      };
      console.log(data.players);

      //  jcmp.events.CallRemote('AddPlayerLobbyArray_All', player, id, JSON.stringify(data));

      for (var i = 0; i < race.game.lobbys[id].length; i++) {
        const playertoadd = race.game.lobbys[id][i];
        console.log(playertoadd.name);
        jcmp.events.CallRemote('AddPlayerLobbyArray', player, id, playertoadd.name);
      }
      for (var i = 0; i < race.game.lobbys[id].length; i++) {
        const playertoupdate = race.game.lobbys[id][i];
        console.log(playertoupdate.name);
        jcmp.events.CallRemote('AddPlayerLobbyArray', playertoupdate, id, player.name);
      }
      race.game.lobbys[id].push(player);
      race.chat.send(player, "[SERVER] You Just join the lobby" + id);
      jcmp.events.CallRemote('Lobby_Update_Player', null, id, race.game.lobbys[id].length);
      jcmp.events.CallRemote('AddPlayerLobbyArray', player, id, player.name);

      jcmp.events.CallRemote('Lobby_Update_state', null, player.name, JSON.stringify('In the Lobby : ' + player.race.lobbyid));

    } else {
      race.chat.send(player, "[SERVER] ID not correct");
    }

  }


});

jcmp.events.AddRemoteCallable('Player_Remove_Lobby', function(player) {
  if (player.race.lobbyid != undefined) {
    jcmp.events.CallRemote('Lobby_Update_Player', null, player.race.lobbyid, race.game.lobbys[player.race.lobbyid].length); // update to everyone the length of the lobby
    for (var i = 0; i < race.game.lobbys[player.race.lobbyid].length; i++) {
      const playertoupdate = race.game.lobbys[player.race.lobbyid][i];
      jcmp.events.CallRemote('Lobby_remove_player', playertoupdate, player.name); // remove the player to everyone on is lobby

    }
    race.chat.send(player, "[SERVER] You Removed from the lobby" + player.race.lobbyid);
    // if lobby is empty remove it
    race.game.lobbys[player.race.lobbyid].removePlayer(player);
    if (race.game.lobbys[player.race.lobbyid].length == 0) {
      delete race.game.lobbys[player.race.lobbyid];
      jcmp.events.CallRemote("DeleteLobby", null, player.race.lobbyid);
      console.log("ArrayEmpty");
    }
    player.race.lobbyid = undefined;
    player.race.ready = false;
    jcmp.events.CallRemote('Lobby_Update_state', null, player.name, JSON.stringify('LobbySelectMenu'));
  }
});
jcmp.events.AddRemoteCallable('Ready_Player_Server', function(player) {
  player.race.ready = true;
  for (var i = 0; i < race.game.lobbys[player.race.lobbyid].length; i++) {
    const playertoupdate = race.game.lobbys[player.race.lobbyid][i];
    console.log(playertoupdate.name);
    jcmp.events.CallRemote('Lobby_Player_Ready', playertoupdate, player.name);

  }
});
jcmp.events.AddRemoteCallable('TypeOfRace', function(player, int) { // 0 is classic , 1 MultiCrew , 2 TTS , 3 APO
  player.race.typeselect = int;
  // then send to everyone

  for (var i = 0; i < race.game.lobbys[player.race.lobbyid].length; i++) {
    const playertoupdate = race.game.lobbys[player.race.lobbyid][i];
    jcmp.events.CallRemote('ShowSelectType', playertoupdate, player.race.typeselect);

  }



});
jcmp.events.AddRemoteCallable('MapRace', function(player, int) { // 0 is classic , 1 MultiCrew , 2 TTS , 3 APO
  player.race.raceselect = int;
  console.log(player.race.raceselect);
  // then send to everyone

  let races;
  for (var i = 0; i < race.game.RaceList.length; i++) {
    let racetofind = race.game.RaceList[i];
    if (racetofind.raceid == player.race.raceselect) {
      races = racetofind;
    }
  }
  for (var i = 0; i < race.game.lobbys[player.race.lobbyid].length; i++) {
    const playertoupdate = race.game.lobbys[player.race.lobbyid][i];
    jcmp.events.CallRemote('ShowSelectRace', playertoupdate, races.raceid, races.Name);

  }

});


*/

// Myami TEST LOBBY








jcmp.events.AddRemoteCallable('Server/Player_Create_Lobby_Test', function(player,LobbyNameReceived) {
  if (player.race.lobbyid == undefined) {
    let id = Object.keys(race.game.lobbys).length;
    console.log(id);
    race.game.lobbys[id] = [];
    
    player.race.lobbyid = id;
    let NewLobbyObject = {
      LobbyName: LobbyNameReceived,
      NumberofPlayer: 1,
      MapName: "RaceIsland",
      RaceID: 50,
      TypeRace:"Classic",
      LobbyID: id,
      PlayerCreated: player.name,
      PlayerList:[player],
      PlayerListName:[player.name]
    };
    race.game.lobbys[id].push(NewLobbyObject);
    let lobbytosendtoclient = {
      LobbyName: "testlobby", //LobbyNameReceived
      NumberofPlayer: 1,
      MapName: "Car Race Boom Island",
      TypeRace:"Classic",
      LobbyID: id,
      RaceID: 50, // CarRaceBoomIsland
      PlayerCreated: player.name,
      PlayerListName:[player.name]
    }
    console.log(  race.game.lobbys);
    jcmp.events.CallRemote('Client/LobbyCreated',null,JSON.stringify(lobbytosendtoclient)); // send to everyone the new lobby object for the array in cef
    jcmp.events.CallRemote('Client/PlayerJoinLobby',player,id,JSON.stringify(lobbytosendtoclient)); // Show the UI of the lobby (player on the lobby , map of the lobby etc..)



  } else {
    console.log("Lobby Already created");
  }

});


jcmp.events.AddRemoteCallable('Server/Player_Join_Lobby_Test', function(player, id) {
  if (player.race.lobbyid == undefined) {
    console.log(id);
    if (id == undefined) {
      return;
    }
    if (race.game.lobbys[id]) {
      player.race.lobbyid = id;
      race.game.lobbys[id].PlayerListName.push(player.name);
      race.game.lobbys[id].PlayerList.push(player);
      race.game.lobbys[id].NumberofPlayer =  race.game.lobbys[id].PlayerList.length;
      let lobbydata = {
      LobbyName :  race.game.lobbys[id].LobbyName,
      NumberofPlayer: race.game.lobbys[id].PlayerListName.length,
      MapName : race.game.lobbys[id].MapName,
      TypeRace : race.game.lobbys[id].TypeRace,
      LobbyID: id,
      RaceID : race.game.lobbys[id].RaceID,
      PlayerCreated: race.game.lobbys[id].PlayerCreated,
      PlayerListName : race.game.lobbys[id].PlayerListName
      }
      console.log(lobbydata);
      jcmp.events.CallRemote('Client/PlayerJoinLobby',player,id,JSON.stringify(lobbydata)); // Show the UI of the lobby (player on the lobby , map of the lobby etc..)
      jcmp.events.CallRemote('Client/UpdateLengthLobby',null,id,race.game.lobbys[id].NumberofPlayer); // Update the length of a lobby

      for (let i = 0; i <   race.game.lobbys[player.race.lobbyid].PlayerList.length; i++) {
        let players = race.game.lobbys[player.race.lobbyid].PlayerList[i];
        if (players.networkId != player.networkId){
          console.log("Show new lobby");
          jcmp.events.CallRemote('Client/AddPlayerOnLobbyMenu',players,player.race.lobbyid,player.name); // Add on the lobby menu of everyone in the lobby the name of the new guy
        }
      }

    } else {
      race.chat.send(player, "[SERVER] ID not correct");
    }

  }
  else{
    race.chat.send(player, "[SERVER] Player already on a lobby");
  }


});



jcmp.events.AddRemoteCallable('Server/Player_Remove_Lobby_Test', function(player) { // need to rewrite it a little
  if (player.race.lobbyid != undefined) {
    for (let i = 0; i <  race.game.lobbys[player.race.lobbyid].PlayerList.length; i++) { // Delete the player from the serverside array
      let players = race.game.lobbys[player.race.lobbyid].PlayerList[i];
        if (players.networkId == player.networkId){
      delete players;
      race.game.lobbys[player.race.lobbyid].NumberofPlayer = race.game.lobbys[player.race.lobbyid].PlayerList.length; // update the new length serverside
      jcmp.events.CallRemote('Client/UpdateLengthLobby',null,id,race.game.lobbys[id].NumberofPlayer); // Update the length of a lobby

      }
    }

    for (let i = 0; i <   race.game.lobbys[player.race.lobbyid].PlayerList.length; i++) {
      let players = race.game.lobbys[player.race.lobbyid].PlayerList[i]; // Remove the player to the people in the same lobby
      jcmp.events.CallRemote('Client/PlayerRemoveLobby',players,player.race.lobbyid,player.name);
    }
    jcmp.events.CallRemote('Client/ShowLobbyList',player,true);
    player.race.lobbyid = undefined;
    player.race.ready = false;
    jcmp.events.Call('UpdatePlayerOnTheServer',player);
  }
  else{
    race.chat.send(player,"[SERVER] Player already out of a lobby")
  }
});

jcmp.events.AddRemoteCallable('Server/Ready_Player_Server_Test', function(player) { // need to add it on cef
  player.race.ready = true;
  // jcmp.CallRemote on   race.game.lobbys[player.race.lobbyid].PlayerList
  for (let i = 0; i <   race.game.lobbys[player.race.lobbyid].PlayerList.length; i++) {
    let players = race.game.lobbys[player.race.lobbyid].PlayerList[i];
    jcmp.events.CallRemote('Client/PlayerReady_Lobby',players,player.race.lobbyid,player.name);
  }
});

jcmp.events.AddRemoteCallable('Server/TypeOfRace_Test', function(player, int) { // 0 is classic , 1 MultiCrew , 2 TTS , 3 APO
  player.race.typeselect = int;
  let name ;
  // then send to everyone
  if (int == 0){
    name = "Classic"
  }
  if (int == 1){
    name = "MultiCrew"
  }
  if (int == 2){
    name = "TTS"
  }
  if (int == 3){
    name = "Apo"
  }
  race.game.lobbys[id].TypeRace = name;

  jcmp.events.CallRemote('Server/TypeOfRaceSelected',null,id,name);
  for (let i = 0; i <   race.game.lobbys[player.race.lobbyid].PlayerList.length; i++) {
    let players = race.game.lobbys[player.race.lobbyid].PlayerList[i];
    jcmp.events.CallRemote('Client/TypeOfRace',players,name);
  }

});

jcmp.events.AddRemoteCallable('Server/MapRace_Test', function(player, int,name) { //raceid
  player.race.raceselect = int;
  console.log(player.race.raceselect);
  // then send to everyone

  let races;
  let havefind = false;
  for (var i = 0; i < race.game.RaceList.length; i++) {
    let racetofind = race.game.RaceList[i];
    if (racetofind.raceid == player.race.raceselect) {
      races = racetofind;
      havefind = true;
        race.game.lobbys[id].MapName = name;

        jcmp.events.CallRemote('Client/MapOfRaceSelected',null,id,name);
        for (let i = 0; i <   race.game.lobbys[player.race.lobbyid].PlayerList.length; i++) {
          let players = race.game.lobbys[player.race.lobbyid].PlayerList[i];
          jcmp.events.CallRemote('Client/MapOfRace',players,name);
        }

    }
  }

});







// Myami Test Lobby All PlayerList

jcmp.events.Add('PlayerJoinServer',function(player){ // call when the player join the server
  for (let i = 0; i < race.AllPlayerOnTheServer.length; i++) {
    let player = race.AllPlayerOnTheServer[i];
    if (player.PlayerNetworkid == player.networkId) {
      return;
    }
  }

        let newplayer = {
          PlayerName: player.name,
          PlayerNetworkid: player.networkId,
          IsinLobby: false,
          LobbyID: undefined
        };
        console.log("1");
        race.AllPlayerOnTheServer.push(newplayer); // save the same data that will be on cef
        //CallRemote to everyone to see the new Player
        console.log(race.AllPlayerOnTheServer);
        if (race.AllPlayerOnTheServer.length > 1){
          console.log("3");
          for (let i = 0; i < race.AllPlayerOnTheServer.length; i++) {
            let o = race.AllPlayerOnTheServer[i];
            if (o.networkId != player.networkId) {
              jcmp.events.CallRemote("Client/AddPlayerOnTheList",o,JSON.stringify(newplayer));
              console.log("4");

            }
          }
        }

        // send to the player the all list with himslef
        console.log("5");

        jcmp.events.CallRemote("Client/AddPlayerOnTheListJoin",player,JSON.stringify(race.AllPlayerOnTheServer));

        console.log("6");


});



jcmp.events.Add('UpdatePlayerOnTheServer',function(player){
if (player.race.lobbyid != undefined){
  for (let i = 0; i < race.AllPlayerOnTheServer.length; i++) {
    let player = race.AllPlayerOnTheServer[i];
    if (player.networkId == Networkid) {
      player.IsinLobby = true;
      player.LobbyID = player.race.lobbyid;
      //CallRemote
      for (let y = 0; y < race.AllPlayerOnTheServer.length; y++) {
        let o = race.AllPlayerOnTheServer[y];
          jcmp.events.CallRemote("Client/UpdatePlayerOnTheServer",o,race.AllPlayerOnTheServer[i].networkId,true,player.race.lobbyid);

      }

    }
  }
}
else{
  for (let i = 0; i < race.AllPlayerOnTheServer.length; i++) {
    let player = race.AllPlayerOnTheServer[i];
    if (player.networkId == Networkid) {
      player.IsinLobby = false;
      player.LobbyID = undefined;
      //CallRemote
      for (let y = 0; y < race.AllPlayerOnTheServer.length; y++) {
        let o = race.AllPlayerOnTheServer[y];
          jcmp.events.CallRemote("Client/UpdatePlayerOnTheServer",o,race.AllPlayerOnTheServer[i].networkId,false,undefined);
      }
    }
  }
}
});

    jcmp.events.Add('DeletePlayerOnTheserver',function(player){
      for (let i = 0; i < AllPlayerOnTheServer.length; i++) {
        let players = AllPlayerOnTheServer[i];
        if (players.networkId == player.networkId) {
          delete player;
              jcmp.events.CallRemote("Client/RemovePlayer",null,player.networkId);
        }
      }
    });

    jcmp.events.AddRemoteCallable('LaunchRace', function(player) {
        jcmp.events.Call('race_start_index', player)
    });
