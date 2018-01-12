jcmp.events.AddRemoteCallable('race_checkpoint_Beta', function(player) {
  const Race = player.race.game;

  if (Race.type == 1) {
    jcmp.events.Call('MC_Race_Checkpoint', player);

  }
   if (Race.type == 0 ) { // classic
    jcmp.events.Call('C_Race_Checkpoint', player);
  }

  if (Race.type == 2) {
  jcmp.events.Call('TTS_Race_Checkpoint', player);
  console.log("TTS_Race_Checkpoint");
}
if (Race.type == 4){
  jcmp.events.Call('MP_Race_Checkpoint', player);
  console.log("MP_Race_Checkpoint");

}
});

jcmp.events.AddRemoteCallable('Timer_Server_Beta',function(player,time){
  player.race.time = time;
  const Race = player.race.game;
  if (Race.type == 0) {
    jcmp.events.Call('C_race_end_point', player);

  }
  if (Race.type == 1) {
    jcmp.events.Call('MC_race_end_point', player);

  }
  if (Race.type == 2) {
  jcmp.events.Call('TTS_race_end_point', player);

}

if (Race.type == 4){
  jcmp.events.Call('MP_race_end_point', player);

}


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
      if (player.race.game.racedata.type == 0 || player.race.game.racedata.type == 3) {
        player.race.game.CRRespawnCar(player);
        if (vehicleold != undefined) {
          vehicleold.Destroy();
        }
      }
      if (player.race.game.racedata.type == 1) {
        player.race.game.MCVehicleReset(player,vehicleold);
      }
      if (player.race.game.racedata.type == 2) {
        player.race.game.TTSRespawnCar(player);
        if (vehicleold != undefined) {
          vehicleold.Destroy();
        }
      }
    }, race.game.respawntimer + 2000);
  }

});












jcmp.events.Add('race_start_index_Beta', function(player) {

    race.game.toStart = false;
    race.game.timeToStart = race.config.game.timeToStart;

    const races = race.game.RaceList[player.race.raceselect];
    const PlayerArray = race.game.lobbys[player.race.lobbyid][0].PlayerList;
    const Raceid = race.game.games.length + 1;


    let Race = new race.RaceBeta(
      races,  //map
      Raceid, // id
      PlayerArray,
      player.race.typeselect // type of the race
    );

    race.game.games.push(Race);
    Race.Start();


});


jcmp.events.AddRemoteCallable('ResetPlayer_Server', function(player) { // B button for reset player
  player.health = 0;
  race.chat.send(player, "[SERVER] You were reset to the last checkpoint");
});
