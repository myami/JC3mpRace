jcmp.events.Add('TTS_Race_Checkpoint', function(player) {
  const Race = player.race.game;
  let checkpointcoordinate = new Vector3f(Race.raceCheckpoint[player.race.checkpoints].x, Race.raceCheckpoint[player.race.checkpoints].y + Race.AddingYatrespawn, Race.raceCheckpoint[player.race.checkpoints].z);
  player.respawnPosition = race.utils.randomSpawn(checkpointcoordinate, 15);
  player.race.playerrotationspawn = new Vector3f(Race.raceCheckpoint[player.race.checkpoints].rotx, Race.raceCheckpoint[player.race.checkpoints].roty, Race.raceCheckpoint[player.race.checkpoints].rotz);
  player.race.checkpoints++;

  if (player.race.checkpoints == Race.raceCheckpoint.length) { // if it's egal it's mean it's the last checkpoint
    race.chat.send(player, "[SERVER] You finished the race! Well done!!");
    jcmp.events.Call('TTS_race_end_point', player);
    return;
    // whas last checkpoint
  }
  if (player.race.checkpoints == Race.raceCheckpoint.length - 1) { // last checkpoint
    let lastnextcheckpoint = Race.raceCheckpoint[player.race.checkpoints];
    jcmp.events.CallRemote('race_checkpoint_client', player, JSON.stringify(lastnextcheckpoint), Race.id, Race.PoiType, Race.checkpointhash, Race.ChekpointType);
    console.log("last checkpoint TTS");
    jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
    return;
    // change the poi text to last checkpoint
  }

  let positionnextcheckpoint = Race.raceCheckpoint[player.race.checkpoints];
  let positionghostcheckpoint = Race.raceCheckpoint[player.race.checkpoints + 1];
  jcmp.events.CallRemote('race_checkpoint_client', player, JSON.stringify(positionnextcheckpoint), Race.id, Race.PoiType, Race.checkpointhash, Race.ChekpointType, JSON.stringify(positionghostcheckpoint));
  jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);


});


jcmp.events.Add('TTS_race_end_point', function(player) {

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
      race.chat.broadcast(`[SERVER] ${playername} is ${leaderboardplace} with a time of ${minute} minutes and ${seconds} seconds!`, race.config.colours.red);
      jcmp.events.CallRemote('Player_data_Announce', player, leaderboardplace, player.race.time);
      Race.UpdateEndLeaderboard(playername, leaderboardplace, minute, seconds);
      setTimeout(function() {
        jcmp.events.Call('race_player_leave_game', player)
        player.race.time = 0;
      }, 2000);

    }

  }

});

jcmp.events.AddRemoteCallable('TTS_Race_player_timer_start', (player) => { // the timer for the leaderboard
  const Race = player.race.game;
  const timerinterval = setInterval(function() {
    if (player != undefined && player.name != undefined)
      if (player.race.ingame)
        player.race.time++;
  }, 1000);
  player.race.timerinterval = timerinterval;
  Race.TTSPlayerStartRelease();

});
