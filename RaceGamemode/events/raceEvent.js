jcmp.events.Add('race_updates', function() {

  if (race.game.toStart) {
    race.game.timeToStart -= 500;
  }


  if (race.game.players.onlobby.length >= race.config.game.minPlayers && !race.game.toStart) {
    // Start a new interval
    race.game.toStart = true;
    race.utils.broadcastToLobby("The game is going to start in 2 minutes!");
    //   jcmp.events.CallRemote('Open_voting_menu_client',null , race.config.game.timervote);
    // open the menu to choice the map and then launch the race


    race.game.timeToStart = race.config.game.timeToStart;
    race.game.StartTimer = setTimeout(function() {

    }, race.config.game.timeToStart);
  }

  if (race.game.players.onlobby.length < race.config.game.minPlayers && race.game.toStart) {
    // Delete timeout

    clearTimeout(race.game.StartTimer);

    // Hide and reset timer and show left players text on UI for players on the lobby

    for (let player of race.game.players.onlobby) {


      jcmp.events.Call('toast_show', player, {
        heading: 'Need more players',
        text: "More players are needed to start the battle",
        icon: 'info',
        loader: true,
        loaderBg: '#9EC600',
        position: 'top-right',
        hideAfter: 5000
      });

    }

    // --

    //race.utils.broadcastToLobby("Need more players to start the game ... ");

    race.game.toStart = false;
    race.game.timeToStart = race.config.game.timeToStart;
  }





});



jcmp.events.AddRemoteCallable('race_checkpoint', function(player) {

  const Race = player.race.game;

  let checkpointcoordinate = new Vector3f(Race.raceCheckpoint[player.race.checkpoints].x, Race.raceCheckpoint[player.race.checkpoints].y + Race.AddingYatrespawn, Race.raceCheckpoint[player.race.checkpoints].z);
  player.respawnPosition = race.utils.randomSpawn(checkpointcoordinate, 15);
  player.race.playerrotationspawn = new Vector3f(Race.raceCheckpoint[player.race.checkpoints].rotx, Race.raceCheckpoint[player.race.checkpoints].roty, Race.raceCheckpoint[player.race.checkpoints].rotz);
  player.race.checkpoints++;

  if (player.race.checkpoints == Race.raceCheckpoint.length) { // if it's egal it's mean it's the last checkpoint
    race.chat.send(player, "[SERVER] You finished the race! Well done!!");
    jcmp.events.Call('race_end_point', player);
    // whas last checkpoint

    return;
  }
  if (player.race.checkpoints == Race.raceCheckpoint.length - 1) { // if it's egal it's mean it's the last checkpoint
    let lastnextcheckpoint = Race.raceCheckpoint[player.race.checkpoints];
    jcmp.events.CallRemote('race_checkpoint_client', player, JSON.stringify(lastnextcheckpoint), Race.id, Race.PoiType, Race.checkpointhash, Race.ChekpointType);
    console.log("last checkpoint");
    jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);

    return;
    // change the poi text to last checkpoint
  }

  let positionnextcheckpoint = Race.raceCheckpoint[player.race.checkpoints];
  let positionghostcheckpoint = Race.raceCheckpoint[player.race.checkpoints + 1];
  jcmp.events.CallRemote('race_checkpoint_client', player, JSON.stringify(positionnextcheckpoint), Race.id, Race.PoiType, Race.checkpointhash, Race.ChekpointType, JSON.stringify(positionghostcheckpoint));
  jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);


});

jcmp.events.Add('race_end_point', function(player) {
  player.race.hasfinish = true;
  const Race = player.race.game;
  clearInterval(player.race.timerinterval);

  Race.leaderboard.push(player);
  let playern = player.networkId;
  Race.players.forEach(player => {
    if (player.race.ingame)
      Race.leaderboard = player.race.game.leaderboard;

  })

  for (var i = 0; i < Race.leaderboard.length; i++) {

    const player = Race.leaderboard[i];
    if (player.networkId == playern) {
      let leaderboardplace = i + 1;
      // send the leaderboardplace to the client
      let minute = Math.floor(player.race.time / 60);
      let seconds = player.race.time % 60
      let playername = player.name;
      race.chat.broadcast(`[SERVER] ${player.name} is ${leaderboardplace} with a time of ${minute} minutes and ${seconds} seconds!`, race.config.colours.red);
      jcmp.events.CallRemote('Player_data_Announce', player, leaderboardplace, player.race.time);
      jcmp.events.Call('toast_show', player, {
        heading: 'You just end the race',
        text: `You just finished the race in ${leaderboardplace} position. Nice play!`,
        icon: 'info',
        loader: true,
        loaderBg: '#9EC600',
        position: 'top-right',
        hideAfter: 5000
      });

      Race.UpdateEndLeaderboard(playername, leaderboardplace, minute, seconds);
      setTimeout(function() {
        jcmp.events.Call('race_player_leave_game', player)
        player.race.time = 0;
      }, 500);

    }

  }




  //Launch when a player is at last checkpoint and launch a spectator mode until the last player as this event launch or wait 2 min after the first player and show the leaderboard
  // check if he is the last that have this event , if it is launch race_timer_end
  // if he is not the last tell him is rank and show him the leaderboard || made a spectator mode the time the last as this event

});
jcmp.events.AddRemoteCallable('AddPlayerLeaderboard', function(player) {
  const Race = player.race.game;
  Race.AddPlayerOnLeaderboard(player);
});
jcmp.events.Add('race_player_leave_game', function(player, destroy) {
  //Call it when a player is disconnect of the game or to foreach with race_timer_end to remove all the data from the race


  // Destroy on TRUE = No put the player into de lobby again

  const Race = player.race.game;
  Race.players.removePlayer(player);
  race.game.players.ingame.removePlayer(player);
  player.race.checkpoints = 0;
  player.race.time = 0;
  jcmp.events.CallRemote('race_End_client', player);


  if (!destroy) {

    race.game.players.onlobby.push(player);
    player.race.ingame = false;
    player.dimension = 0;
    player.respawnPosition = race.config.game.lobby.pos;
    jcmp.events.CallRemote('race_set_time', player, 11, 0);
    jcmp.events.CallRemote('race_set_weather', player, "base");

    const done = race.workarounds.watchPlayer(player, setTimeout(() => {
      done();
      // NOTE: Maybe include here the update needPlayers update event and the lobby push
      player.Respawn();
    }, 5000));

  }

});

jcmp.events.Add('race_player_checkpoint_respawn', function(player, vehicleold) {
  if (!player.race.spawningdouble) {
    player.race.spawningdouble = true;
    console.log("Race_player_respawn");
    //  race.game.RacePeopleDie.push(player);
    jcmp.events.CallRemote('race_deathui_show', player, "Out of the vehicle");
    race.chat.send(player, "Respawning in 3 seconds ...");
    const done = race.workarounds.watchPlayer(player, setTimeout(() => {
      done();
      console.log("Respawning player");
      if (vehicleold != undefined) {
        vehicleold.Destroy();
      }

      player.Respawn();

    }, race.game.respawntimer));
    setTimeout(function() {
      if (player.race.vehicle != 0) {
        const vehicle = new Vehicle(player.race.vehicle, player.position, player.race.playerrotationspawn);
        vehicle.nitroEnabled = player.race.nitro;
        console.log("Vehicle spawning");
        vehicle.dimension = player.race.game.id;
        setTimeout(function() {
          vehicle.SetOccupant(0, player); // sometime the player don't go inside or vehicle is destroy to early
          //  race.game.RacePeopleDie.removePlayer(player);
          player.race.spawningdouble = false;
        }, race.game.respawntimer + 1000);
      } else {
        //Wingsuit race
      }
    }, race.game.respawntimer + 2000);

  

  }

});




jcmp.events.AddRemoteCallable('spawnVehicle', (player, modelhash) => {
  // call in the race_vehicle_choice_menu
  if (player.race.vehicle != 0) {
    player.race.vehicle = modelhash;
    const vehicle = new Vehicle(player.race.vehicle, player.position, player.rotation);
    vehicle.nitroEnabled = player.race.nitro;
    vehicle.dimension = player.race.game.id;
    setTimeout(function() {
      vehicle.SetOccupant(0, player);
    }, 100);
  } else {
    //Wingsuit race
  }

});

jcmp.events.AddRemoteCallable('Race_player_timer_start', (player) => {
  const Race = player.race.game;
  const timerinterval = setInterval(function() {
    if (player != undefined && player.name != undefined)
      if (player.race.ingame)
        player.race.time++;
  }, 1000);
  player.race.timerinterval = timerinterval;

});

jcmp.events.AddRemoteCallable('Update_All_Client_server', function(player, name, value) {

  jcmp.events.CallRemote('Update_All_Client_toeveryone', null, name, value);
});

jcmp.events.Add('race_start_index', function(indexs) {
  jcmp.events.CallRemote('Remove_Leaderboard_name', null);
  setTimeout(function() {
    race.utils.broadcastToLobby("[SERVER] The race is starting be ready!!!!");
    race.game.toStart = false;
    race.game.timeToStart = race.config.game.timeToStart;
    //const index = race.utils.random(0,race.game.RaceList.length -1);
    const races = race.game.RaceList[indexs];
    const VehicleType = races.VehicleType;
    const RaceCheckpoint = races.RaceCheckpoint;
    const StartingPoint = races.StartingPoint;
    const NumberofPlayer = race.game.players.onlobby.length;
    const PlayerArray = race.game.players.onlobby;
    const Raceid = race.game.games.length + 1;
    const times = races.time;
    const weatherr = races.weather;
    const defaultvehicle = races.defaultVehicle;
    const alldefaultvehicle = races.AllDefault;
    const addingyatspawn = races.AddingYatrespawn;
    const checkpointhash = races.CheckpointHash;
    const checkpointtype = races.ChekpointType;
    const poitype = races.PoiType;
    const ghostpoi = races.GhostPOIType;
    const nitro = races.nitroenabled;
    let Race = new race.Race(
      Raceid, // id
      VehicleType, //vehicle type
      PlayerArray, // array of player
      NumberofPlayer, // number of player
      StartingPoint, // position of the start
      RaceCheckpoint, // checkpoint
      times, // hour ingame for the race
      weatherr, // weather during the race
      defaultvehicle, // default vehicle of the race use if the player don't choice a vehicle in the menu
      alldefaultvehicle, // if everyone as the default vehicle or people can choice
      addingyatspawn, // when player respawning adding some alitute or reduce (mainly for airplane battle)
      checkpointhash, // hash of the checkpoint (only have one now)
      checkpointtype, // type of the checkpoint only one work now (1)
      poitype,
      ghostpoi,
      nitro
    );

    jcmp.events.Call('toast_show', null, {
      heading: 'Race starting',
      text: "The Race is starting! Get ready, the countdown begins.",
      icon: 'info',
      loader: true,
      loaderBg: '#9EC600',
      position: 'top-right',
      hideAfter: 5000
    });
    race.game.games.push(Race);
    Race.Start();
  }, 600);

});


jcmp.events.Add('Race_name_index', function(player) {
  let index = race.game.RaceList;
  for (var i = 0; i < index.length; i++) {
    jcmp.events.CallRemote('Race_name_index_client_admin', player, i, index[i].NameWithoutSpace, index[i].Name);
    jcmp.events.CallRemote('Race_name_index_client_vote', player, i, index[i].NameWithoutSpace, index[i].Name);

  }

});



jcmp.events.AddRemoteCallable('ResetPlayer_Server', function(player) {
  player.health = 0;
  race.chat.send(player, "[SERVER] You were reset to the last checkpoint");
});

jcmp.events.AddRemoteCallable('Race_index_received_admin', function(player, index) {
  if (!race.utils.isAdmin(player)) {
    return race.chat.send(player, "[SERVER] Reserved for admins, for now try the voting system");
  }
  jcmp.events.Call('race_start_index', index);
});

jcmp.events.AddRemoteCallable('Race_index_received_vote', function(player, index) {
  if (race.game.RaceLaunch) {
    jcmp.events.Call('race_start_index', index);
    race.game.RaceLaunch = false;
    setTimeout(function() {
      race.game.RaceLaunch = true;
    }, 5000);
  }

});
