jcmp.events.AddRemoteCallable('race_checkpoint_Beta', function(player) {
  const Race = player.race.game;


   if (Race.type == 0 ) { // classic
    jcmp.events.Call('C_Race_Checkpoint', player);
  }

  if (Race.type == 2) { //tts
  jcmp.events.Call('TTS_Race_Checkpoint', player);

}
if (Race.type == 4){ // MultiplePath
  jcmp.events.Call('MP_Race_Checkpoint', player);


}
});

jcmp.events.AddRemoteCallable('Timer_Server_Beta',function(player,time){
  player.race.time = time;
  const Race = player.race.game;
  if (Race.type == 0) {
    jcmp.events.Call('C_race_end_point', player);

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
jcmp.events.CallRemote('Race_end_Loading_Page',player);
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
    if (vehicleold != undefined) {
      vehicleold.Destroy();
    }

    jcmp.events.CallRemote('race_deathui_show', player, "Out of the vehicle");
    race.chat.send(player, "Respawning in 3 seconds ...");
    const done = race.workarounds.watchPlayer(player, setTimeout(() => {
      done();
      console.log("Respawning player" + player.name);

      player.Respawn();

    }, race.game.respawntimer));
    setTimeout(function() {

      if (player.race.game.type == 0 || player.race.game.type == 3) {
        player.race.game.CRRespawnCar(player);
      }

      if (player.race.game.type == 2) {
        player.race.game.TTSRespawnCar(player);
      }
      if (player.race.game.type == 4) {
        player.race.game.MPRespawnCar(player);
      }
    },  2500);
  }

});












jcmp.events.Add('race_start_index_Beta', function(player) {

    race.game.toStart = false;
    race.game.timeToStart = race.config.game.timeToStart;

    const races = race.game.RaceList[player.race.raceselect];
    const PlayerArray = race.game.lobbys[player.race.lobbyid].PlayerList;
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
    jcmp.events.Call('race_player_checkpoint_respawn', player);
  race.chat.send(player, "[SERVER] You were reset to the last checkpoint");
});


jcmp.events.Add('Leaderboard_push_Player',function(player){
  for (var i = 0; i < race.game.games.length; i++) {
    let game = race.game.games[i];
    if (game.id == player.race.game.id)
    {
      game.leaderboard.push(player);
      jcmp.events.CallRemote('Race_Leaderboard_Rank',null,player.race.lobbyid,player.name,game.leaderboard.length);

    }

  }
});
