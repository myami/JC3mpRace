jcmp.events.AddRemoteCallable('race_checkpoint', function(player) {
  const Race = player.race.game;
  console.log(Race.type + "Checkpoint");
  if (Race.type == 1) {
    jcmp.events.Call('MC_Race_Checkpoint', player);

  }  if (Race.type == 0 ||Race.type == 3) { // classic or apo
    jcmp.events.Call('C_Race_Checkpoint', player);

  }

  if (Race.type == 2) {
  jcmp.events.Call('TTS_Race_Checkpoint', player);
  console.log("TTS_Race_Checkpoint");
}
});

jcmp.events.AddRemoteCallable('Timer_Server',function(player,time){
  player.race.time = time;
  const Race = player.race.game;
  if (Race.type == 1) {
    jcmp.events.Call('MC_race_end_point', player);

  }  if (Race.type == 0) {
    jcmp.events.Call('C_race_end_point', player);

  }

  if (Race.type == 2) {
  jcmp.events.Call('TTS_race_end_point', player);

}


});


jcmp.events.AddRemoteCallable('AddPlayerLeaderboard', function(player) {
  const Race = player.race.game;
  Race.AddPlayerOnLeaderboard(player);
});
jcmp.events.Add('race_player_leave_game', function(player, destroy) {
  //Call it when a player is disconnect of the game or to foreach with race_timer_end to remove all the data from the race
  // Destroy on TRUE = No put the player into de lobby again

  const Race = player.race.game;
  //  Race.players.removePlayer(player);
  race.game.players.ingame.removePlayer(player);
  player.race.checkpoints = 0;
  player.race.time = 0;
  player.race.partnerplayer = [];
  jcmp.events.CallRemote('race_End_client', player);
  player.race.ready = false;
  if (!destroy) {

    player.race.ingame = false;
    player.dimension = 0;
    player.respawnPosition = race.config.game.lobby.pos;
    jcmp.events.CallRemote('race_set_time', player, 11, 0);
    jcmp.events.CallRemote('race_set_weather', player, "base");



    const done = race.workarounds.watchPlayer(player, setTimeout(() => {
      done();
      // NOTE: Maybe include here the update needPlayers update event and the lobby push
        console.log(player.race.game.players);
      player.Respawn();
    }, 5000));

  }

});

jcmp.events.Add('race_player_checkpoint_respawn', function(player, vehicleold) {
  if (!player.race.spawningdouble) {
    player.race.spawningdouble = true;

    jcmp.events.CallRemote('race_deathui_show', player, "Out of the vehicle");
    race.chat.send(player, "Respawning in 3 seconds ...");
    const done = race.workarounds.watchPlayer(player, setTimeout(() => {
      done();
      console.log("Respawning player");

      player.Respawn();

    }, race.game.respawntimer));
    setTimeout(function() {
      player.race.spawningdouble = false;
      if (player.race.game.type == 0 || player.race.game.type == 3) {
        player.race.game.CRRespawnCar(player);
        if (vehicleold != undefined) {
          vehicleold.Destroy();
        }
      }
      if (player.race.game.type == 1) {
        player.race.game.MCVehicleReset(player,vehicleold);
      }
      if (player.race.game.type == 2) {
        player.race.game.TTSRespawnCar(player);
        if (vehicleold != undefined) {
          vehicleold.Destroy();
        }
      }
    }, race.game.respawntimer + 2000);
  }

});




jcmp.events.Add('race_start_index', function(player) {
  // type of the race (to add as an args here)
  // classic = basic race
  // multicrew = 2 people in a car the driver don't see the checkpoint and the passager does
  // TODO: apo = ApocalypseNOW = explosive barrel spawn randomly around everyone every x seconds
  //   tts = time trial solo , everyone is released one at a time with a time difference, everyone just finishes the race as fast as possible without needing to worry about other people ramming them and such
  jcmp.events.CallRemote('Remove_Leaderboard_name', null);

    race.game.toStart = false;
    race.game.timeToStart = race.config.game.timeToStart;
/*    let races ;

    //const index = race.utils.random(0,race.game.RaceList.length -1);
    for (var i = 0; i < race.game.RaceList.length; i++) {
      let racetofind = race.game.RaceList[i];
      console.log(racetofind.raceid);
      if (racetofind.raceid == race.game.lobbys[player.race.lobbyid][0].RaceID){
      races = racetofind;
      console.log("Find!!!");
      }

    }*/

    const races = race.game.RaceList[player.race.raceselect];

    const VehicleType = races.VehicleType;
    const RaceCheckpoint = races.RaceCheckpoint;
    const StartingPoint = races.StartingPoint;
    const NumberofPlayer = race.game.lobbys[player.race.lobbyid][0].PlayerList.length;
    const PlayerArray = race.game.lobbys[player.race.lobbyid][0].PlayerList;
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
    const cameraview = races.CameraView;
    if (player.race.typeselect == 1) {
      if (!races.multicrew) {
        return race.utils.broadcastToLobby("[SERVER] This race are not allowed for multicrew");
      }

      for (var i = 0; i < NumberofPlayer; i++) {
        const player = PlayerArray[i];
        if (player.race.partnerplayer[1] == undefined){
          race.utils.broadcastToLobby("Someone don't have a team partner");
          return;
        }

      }
    }
    if (player.race.typeselect == 3) { // wait 1.1 test build to finish it
        return race.utils.broadcastToLobby("[SERVER] This type of race is not fully working");
    }

        race.utils.broadcastToLobby("[SERVER] The race is starting be ready!!!!");

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
      poitype, // the poi type
      ghostpoi, // the ghost poi type
      nitro, // if nitro is enabled or not
      cameraview, // the camera view for spectator
      player.race.typeselect // type of the race
    );

    race.game.games.push(Race);
    Race.Start();
    // send an event to say the lobby is in race

});


jcmp.events.Add('race_start_index_TEST', function(player) {

    race.game.toStart = false;
    race.game.timeToStart = race.config.game.timeToStart;

    const races = race.game.RaceList[player.race.raceselect];
    const NumberofPlayer = race.game.lobbys[player.race.lobbyid][0].PlayerList.length;
    const PlayerArray = race.game.lobbys[player.race.lobbyid][0].PlayerList;
    const Raceid = race.game.games.length + 1;

/*    if (player.race.typeselect == 1) {
      if (!races.multicrew) {
        return race.utils.broadcastToLobby("[SERVER] This race are not allowed for multicrew");
      }

      for (var i = 0; i < NumberofPlayer; i++) {
        const player = PlayerArray[i];
        if (player.race.partnerplayer[1] == undefined){
          race.utils.broadcastToLobby("Someone don't have a team partner");
          return;
        }

      }
    }
    if (player.race.typeselect == 3) { // wait 1.1 test build to finish it
        return race.utils.broadcastToLobby("[SERVER] This type of race is not fully working");
    } */

        race.utils.broadcastToLobby("[SERVER] The race is starting be ready!!!!");

    let Race = new race.RaceBeta(
      races,
      Raceid, // id
      NumberofPlayer,
      PlayerArray,
      4 //  player.race.typeselect // type of the race
    );

    race.game.games.push(Race);
    Race.Start();
    // send an event to say the lobby is in race

});



jcmp.events.AddRemoteCallable('ResetPlayer_Server', function(player) { // B button for reset player
  player.health = 0;
  race.chat.send(player, "[SERVER] You were reset to the last checkpoint");
});
