// TODO: A way to select who is the driver and the passenger


jcmp.events.Add('MC_Race_Checkpoint', function(player) {
  const Race = player.race.game;
  const partner = player.race.partnerplayer[0];
  if (!player.race.driver) { // no checkpoint for the defenders
    return;
  }
  let checkpointcoordinate = new Vector3f(Race.racedata[player.race.path][player.race.checkpoints].x, Race.racedata[player.race.path][player.race.checkpoints].y + Race.racedata.AddingYatrespawn, Race.racedata[player.race.path][player.race.checkpoints].z);
  player.respawnPosition = race.utils.randomSpawn(checkpointcoordinate, 10);
  partner.respawnPosition = race.utils.randomSpawn(checkpointcoordinate, 10);
  player.race.playerrotationspawn = new Vector3f(Race.racedata[player.race.path][player.race.checkpoints].rotx,Race.racedata[player.race.path][player.race.checkpoints].roty, Race.racedata[player.race.path][player.race.checkpoints].rotz);
  partner.race.playerrotationspawn = new Vector3f(Race.racedata[player.race.path][player.race.checkpoints].rotx,Race.racedata[player.race.path][player.race.checkpoints].roty, Race.racedata[player.race.path][player.race.checkpoints].rotz);

  player.race.checkpoints++;

  if (player.race.checkpoints == Race.racedata[player.race.path].length) { // if it's egal it's mean it's the last checkpoint
    jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
    jcmp.events.CallRemote('Checkpoint_current_client', partner, player.race.checkpoints);
    race.chat.send(player, "[SERVER] You finished the race! Well done!!");
    jcmp.events.CallRemote('End_Timer',player);
    jcmp.events.CallRemote('End_Timer',partner);
    return;
    // whas last checkpoint
  }
  if (player.race.checkpoints == Race.racedata[player.race.path].length - 1){ // last checkpoint
    let datas ={
        Dimension : Race.id,
        PoiType : Race.racedata.PoiType,
        CheckpointHash : Race.racedata.checkpointhash,
        CheckpointType : Race.racedata.ChekpointType,
        FirstCheckpoint : Race.racedata[player.race.path][player.race.checkpoints],
    };

    jcmp.events.CallRemote('race_checkpoint_client_Beta', player, JSON.stringify(datas));

    console.log("last checkpointMC");
    jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
    jcmp.events.CallRemote('Checkpoint_current_client', partner, player.race.checkpoints);
    return;
    // change the poi text to last checkpoint
  }

  let data ={
      Dimension : Race.id,
      PoiType : Race.racedata.PoiType,
      CheckpointHash : Race.racedata.checkpointhash,
      CheckpointType : Race.racedata.ChekpointType,
      FirstCheckpoint : Race.racedata[player.race.path][player.race.checkpoints],
      SecondCheckpoint : Race.racedata[player.race.path][player.race.checkpoints + 1]

  };

  jcmp.events.CallRemote('race_checkpoint_client_Beta', player, JSON.stringify(data));
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


      let minute = Math.floor(player.race.time / 60);
      let seconds = player.race.time % 60
      let playername = player.name + " " + partner.name;
      race.chat.broadcast(`[SERVER] ${playername} as done the race with a time of ${minute} minutes and ${seconds} seconds!`, race.config.colours.red);
      setTimeout(function() {
        jcmp.events.Call('race_player_leave_game', player);
        jcmp.events.Call('race_player_leave_game', partner);

        partner.race.time = 0;
        player.race.time = 0;

      }, 2000);

});

jcmp.events.AddRemoteCallable('CheckpointSoundDriver', function(player) {
  const driver = player.race.partnerplayer[0];
  jcmp.events.CallRemote('CheckpointSoundDriver_client', driver);
});


jcmp.events.AddRemoteCallable('ValidateRequest_Server', function(player, playername) {
  for (var i = 0; i < jcmp.players.length; i++) {
    const requestguy = jcmp.players[i];
    if (requestguy.name == playername) {
      player.race.partnerplayer.push(requestguy);
      player.race.partnerplayer.push(player);
      requestguy.race.partnerplayer.push(requestguy);
      requestguy.race.partnerplayer.push(player);
      requestguy.race.leadpartner = true;
        requestguy.race.driver = true;

      console.log(player.race.partnerplayer);
      race.chat.send(player, `You are now partner with ${requestguy.name}`);
      race.chat.send(requestguy, `You are now partner with ${player.name}`);
      jcmp.events.CallRemote('PartnerNameUI_Client', player, requestguy.name);
      jcmp.events.CallRemote('PartnerNameUI_Client', requestguy, player.name);
      jcmp.events.CallRemote('IsLead', requestguy);
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
