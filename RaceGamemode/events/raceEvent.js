jcmp.events.AddRemoteCallable('race_checkpoint', function(player) {
  const Race = player.race.game;
  if (Race.type == "multicrew") {
    jcmp.events.Call('MC_Race_Checkpoint', player);

  }  if (Race.type == "classic" ||Race.type == "apo") {
    jcmp.events.Call('C_Race_Checkpoint', player);

  }
   if (Race.type == "kart") {
   jcmp.events.Call('Kart_Race_Checkpoint', player);
 }
  if (Race.type == "tts") {
  jcmp.events.Call('TTS_Race_Checkpoint', player);
  console.log("TTS_Race_Checkpoint");
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

    jcmp.events.CallRemote('race_deathui_show', player, "Out of the vehicle");
    race.chat.send(player, "Respawning in 3 seconds ...");
    const done = race.workarounds.watchPlayer(player, setTimeout(() => {
      done();
      console.log("Respawning player");

      player.Respawn();

    }, race.game.respawntimer));
    setTimeout(function() {
      player.race.spawningdouble = false;
      if (player.race.game.type == "classic" || player.race.game.type == "apo") {
        player.race.game.CRRespawnCar(player);
        if (vehicleold != undefined) {
          vehicleold.Destroy();
        }
      }
      if (player.race.game.type == "multicrew") {
        player.race.game.MCVehicleReset(player,vehicleold);
      }
      if (player.race.game.type == "kart") {
        player.race.game.KartRespawnCar(player);
        if (vehicleold != undefined) {
          vehicleold.Destroy();
        }
      }
      if (player.race.game.type == "tts") {
        player.race.game.TTSRespawnCar(player);
        if (vehicleold != undefined) {
          vehicleold.Destroy();
        }
      }
    }, race.game.respawntimer + 2000);
  }

});


jcmp.events.AddRemoteCallable('Race_player_timer_start', (player) => { // the timer for the leaderboard
  const Race = player.race.game;
  const timerinterval = setInterval(function() {
    if (player != undefined && player.name != undefined)
      if (player.race.ingame)
        player.race.time++;
  }, 1000);
  player.race.timerinterval = timerinterval;

});

jcmp.events.AddRemoteCallable('Update_All_Client_server', function(player, name, value) { // for the votesystem

  jcmp.events.CallRemote('Update_All_Client_toeveryone', null, name, value);
});

jcmp.events.Add('race_start_index', function(indexs, TypeRace) {

  // type of the race (to add as an args here)
  // classic = basic race
  // TODO:  kart = mariokart like (When you go on a checkpoint have a chance to have a bonus)
  // multicrew = 2 people in a car every X seconds the driver change WORKING
  // TODO: apo = ApocalypseNOW = explosive barrel spawn randomly around everyone every x seconds
  // TODO:  tts = time trial solo , everyone is released one at a time with a time difference, everyone just finishes the race as fast as possible without needing to worry about other people ramming them and such
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
    const cameraview = races.CameraView;
    if (TypeRace == "multicrew") {
      if (!races.multicrew) {
        return race.utils.broadcastToLobby("[SERVER] This race are not allowed for multicrew");
      }
    }
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
      TypeRace // type of the race
    );

    race.game.games.push(Race);
    Race.Start();
    race.game.players.onlobby = [];
  }, 600);

});


jcmp.events.Add('Race_name_index', function(player) { // Send to the client all the race name
  let index = race.game.RaceList;
  for (var i = 0; i < index.length; i++) {
    jcmp.events.CallRemote('Race_name_index_client_admin', player, i, index[i].NameWithoutSpace, index[i].Name);
    jcmp.events.CallRemote('Race_name_index_client_vote', player, i, index[i].NameWithoutSpace, index[i].Name);

  }

});

jcmp.events.AddRemoteCallable('ResetPlayer_Server', function(player) { // B button for reset player
  player.health = 0;
  race.chat.send(player, "[SERVER] You were reset to the last checkpoint");
});

jcmp.events.AddRemoteCallable('Race_index_received_admin', function(player, index) { // launch the race from the admin.html menu
  if (!race.utils.isAdmin(player)) {
    return race.chat.send(player, "[SERVER] Reserved for admins, for now try the voting system");
  }
  jcmp.events.Call('race_start_index', index);
});

jcmp.events.AddRemoteCallable('Race_index_received_vote', function(player, index) { // from vote.html
  if (race.game.RaceLaunch) {
    jcmp.events.Call('race_start_index', index);
    race.game.RaceLaunch = false;
    setTimeout(function() {
      race.game.RaceLaunch = true;
    }, 5000);
  }

});
