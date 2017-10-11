// TODO: A way to can select the partner
// TODO: The passager can use button that will show indication to the driver (pav num = 8 infront , 4 left , 6right 5 behind)

jcmp.events.Add('MC_Race_Checkpoint', function(player) {
  const Race = player.race.game;
  const partner = player.race.partnerplayer[0];
  if (player.race.partnerplayer[0].name == player.name) { // no checkpoint for the driver
    return;
  }
  let checkpointcoordinate = new Vector3f(Race.raceCheckpoint[player.race.checkpoints].x, Race.raceCheckpoint[player.race.checkpoints].y + Race.AddingYatrespawn, Race.raceCheckpoint[player.race.checkpoints].z);
  player.respawnPosition = race.utils.randomSpawn(checkpointcoordinate, 10);
  partner.respawnPosition = race.utils.randomSpawn(checkpointcoordinate, 10);
  player.race.playerrotationspawn = new Vector3f(Race.raceCheckpoint[player.race.checkpoints].rotx, Race.raceCheckpoint[player.race.checkpoints].roty, Race.raceCheckpoint[player.race.checkpoints].rotz);
  player.race.checkpoints++;

  if (player.race.checkpoints == Race.raceCheckpoint.length) { // if it's egal it's mean it's the last checkpoint
    race.chat.send(player, "[SERVER] You finished the race! Well done!!");
    jcmp.events.Call('MC_race_end_point', player);
    return;
    // whas last checkpoint
  }
  if (player.race.checkpoints == Race.raceCheckpoint.length - 1) { // last checkpoint
    let lastnextcheckpoint = Race.raceCheckpoint[player.race.checkpoints];
    jcmp.events.CallRemote('race_checkpoint_client', player, JSON.stringify(lastnextcheckpoint), Race.id, Race.PoiType, Race.checkpointhash, Race.ChekpointType);
    console.log("last checkpointMC");
    jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
    jcmp.events.CallRemote('Checkpoint_current_client', partner, player.race.checkpoints);
    return;
    // change the poi text to last checkpoint
  }

  let positionnextcheckpoint = Race.raceCheckpoint[player.race.checkpoints];
  let positionghostcheckpoint = Race.raceCheckpoint[player.race.checkpoints + 1];
  jcmp.events.CallRemote('race_checkpoint_client', player, JSON.stringify(positionnextcheckpoint), Race.id, Race.PoiType, Race.checkpointhash, Race.ChekpointType, JSON.stringify(positionghostcheckpoint));
  jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
  jcmp.events.CallRemote('Checkpoint_current_client', partner, player.race.checkpoints);


});


jcmp.events.Add('MC_race_end_point', function(player) {
  if (player.race.partnerplayer[0].name == player.name) {
    return;
  }
  const Race = player.race.game;
  const partner = player.race.partnerplayer[0];
  player.race.hasfinish = true;
  partner.race.hasfinish = true;
  clearInterval(player.race.timerinterval);
  clearInterval(partner.race.timerinterval);

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
      let playername = player.name + " " + partner.name;
      race.chat.broadcast(`[SERVER] ${playername} is ${leaderboardplace} with a time of ${minute} minutes and ${seconds} seconds!`, race.config.colours.red);
      jcmp.events.CallRemote('Player_data_Announce', player, leaderboardplace, player.race.time);
      Race.UpdateEndLeaderboard(playername, leaderboardplace, minute, seconds);
      setTimeout(function() {
        jcmp.events.Call('race_player_leave_game', player);
        jcmp.events.Call('race_player_leave_game', partner);
        jcmp.events.CallRemote('HidePassagerUI',player);
        jcmp.events.CallRemote('HideDriverUI',partner);
        partner.race.time = 0;
        player.race.time = 0;
      }, 2000);

    }
    if (Race.type == "multicrew") {
      if (Race.leaderboard.length == Race.players.length) { // if the guy was the last one finishing the race remove the interval
        clearInterval(Race.intervalswitch);
      }
    }

  }
});

jcmp.events.AddRemoteCallable('CheckpointSoundDriver',function(player){
  const driver = player.race.partnerplayer[0];
  jcmp.events.CallRemote('CheckpointSoundDriver_client',driver);
});

jcmp.events.AddRemoteCallable('MC_Passenger_click_Server',function(player,DivToShow){
const driver = player.race.partnerplayer[0];
jcmp.events.CallRemote('MC_DriverDirection_Show',driver,DivToShow);
});

jcmp.events.AddRemoteCallable('ValidateRequest_Server',function(player,playername){
for (var i = 0; i < jcmp.players.length; i++) {
  const requestguy = jcmp.players[i];
  if (requestguy.name == playername){
    player.race.partnerplayer.push(player);
    player.race.partnerplayer.push(requestguy);
    requestguy.race.partnerplayer = player.race.partnerplayer;
    race.chat.send(player,`You are now partner with ${requestguy.name}`);
    race.chat.send(requestguy,`You are now partner with ${player.name}`);
  }
}
});

jcmp.events.AddRemoteCallable('RefuseRequest_Server',function(player,playername){
  for (var i = 0; i < jcmp.players.length; i++) {
    const requestguy = jcmp.players[i];
    if (requestguy.name == playername){
      race.chat.send(requestguy,'The player selected have refused youre request');
    }
  }
});






jcmp.events.Add('MCChangePlayerDrive', function() {
  /* NOT WORKING
  for (var i = 0; i < jcmp.players.length; i++) {
    const player = jcmp.players[i];
    if (player.vehicle != undefined) {
      if (player.race.ingame && player.race.game.type == "multicrew") {
        if (player.race.partnerplayer[0].networkId == player.networkId) {
          console.log("1");
          if (player.vehicle.GetOccupant(0).networkId == player.networkId) {
              setTimeout(function() {
                player.vehicle.SetOccupant(1, player);
                  console.log("3");
              }, 500);
            console.log("2");
                player.vehicle.SetOccupant(0, player.race.partnerplayer[1]);
            return;

          }
          else if (player.vehicle.GetOccupant(1).networkId == player.networkId) {
            console.log("3");
              setTimeout(function() {
                player.vehicle.SetOccupant(1, player.race.partnerplayer[1]);
                  console.log("4");
              }, 500);
                  player.vehicle.SetOccupant(0, player);
              console.log("5");
            return;
          }
        }
      }
    }
  }*/
});
