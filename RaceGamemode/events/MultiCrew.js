// TODO: A way to select who is the driver and the passenger


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
    jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
    jcmp.events.CallRemote('Checkpoint_current_client', partner, player.race.checkpoints);
    race.chat.send(player, "[SERVER] You finished the race! Well done!!");
    jcmp.events.CallRemote('End_Timer',player);
      jcmp.events.CallRemote('End_Timer',partner);
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
        jcmp.events.CallRemote('HidePassagerUI', player);

        partner.race.time = 0;
        player.race.time = 0;
        player.race.partnerplayer = [];
        partner.race.partnerplayer = [];
        player.race.leadpartner = false;
        partner.race.leadpartner = false;
        jcmp.events.CallRemote('PartnerNameUI_Client', player, " ");
        jcmp.events.CallRemote('PartnerNameUI_Client', partner, " ");


      }, 2000);

    }


  }
});

jcmp.events.AddRemoteCallable('CheckpointSoundDriver', function(player) {
  const driver = player.race.partnerplayer[0];
  jcmp.events.CallRemote('CheckpointSoundDriver_client', driver);
});

jcmp.events.AddRemoteCallable('MC_Passenger_click_Server', function(player, MacroChat) {
  if (player.race.partnerplayer[0].networkId != player.networkId){
    let driver = player.race.partnerplayer[0];
    if (MacroChat == "F"){
      race.chat.send(driver,"Go Infront",race.config.colours.red);
    }
    if (MacroChat == "B"){
      race.chat.send(driver,"It's Behind",race.config.colours.red);
    }
    if (MacroChat == "L"){
      race.chat.send(driver,"Turn Left",race.config.colours.red);
    }
    if (MacroChat == "R"){
      race.chat.send(driver,"Turn Right",race.config.colours.red);
    }
  }
  else{
    let driver = player.race.partnerplayer[1];
    if (MacroChat == "F"){
      race.chat.send(driver,"Go Infront",race.config.colours.red);
    }
    if (MacroChat == "B"){
      race.chat.send(driver,"It's Behind",race.config.colours.red);
    }
    if (MacroChat == "L"){
      race.chat.send(driver,"Turn Left",race.config.colours.red);
    }
    if (MacroChat == "R"){
      race.chat.send(driver,"Turn Right",race.config.colours.red);
    }
  }

});

jcmp.events.AddRemoteCallable('ValidateRequest_Server', function(player, playername) {
  for (var i = 0; i < jcmp.players.length; i++) {
    const requestguy = jcmp.players[i];
    if (requestguy.name == playername) {
      player.race.partnerplayer.push(requestguy);
      player.race.partnerplayer.push(player);
      requestguy.race.leadpartner = true;
        requestguy.race.driver = true;
      requestguy.race.partnerplayer = player.race.partnerplayer;
      race.chat.send(player, `You are now partner with ${requestguy.name}`);
      race.chat.send(requestguy, `You are now partner with ${player.name}`);
      jcmp.events.CallRemote('PartnerNameUI_Client', player, requestguy.name);
      jcmp.events.CallRemote('PartnerNameUI_Client', requestguy, player.name);
    }
  }
});

jcmp.events.AddRemoteCallable('RefuseRequest_Server', function(player, playername) {
  for (var i = 0; i < jcmp.players.length; i++) {
    const requestguy = jcmp.players[i];
    if (requestguy.name == playername) {
      race.chat.send(requestguy, 'The player selected have refused youre request');
    }
  }
});
