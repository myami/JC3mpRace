jcmp.events.Add('MP_Race_Checkpoint', function(player) {
  const Race = player.race.game;
  if (Race.racedata[player.race.path][player.race.checkpoints + 1].LaunchANewBranch == false) {
    player.race.checkpoints++;

    let positionnextcheckpoint = Race.racedata[player.race.path][player.race.checkpoints];
    let positionghostcheckpoint = Race.racedata[player.race.path][player.race.checkpoints + 1];

    jcmp.events.CallRemote('race_checkpoint_client_Beta', player, JSON.stringify(positionnextcheckpoint), Race.id, Race.PoiType, Race.checkpointhash, Race.ChekpointType, JSON.stringify(positionghostcheckpoint));
    jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
    return;

  }

  if (Race.racedata[player.race.path][player.race.checkpoints + 1].LaunchANewBranch == true) {
    player.race.checkpoints++;
    let checkpoint = Race.racedata[player.race.path][player.race.checkpoints];
    let newpath = checkpoint.CheckpointArray[race.utils.random(0, checkpoint.CheckpointArray.lenght - 1)];
    player.race.path = newpath;
    player.race.checkpoints = 0;

    let positionnextcheckpoint = Race.racedata[player.race.path][player.race.checkpoints];
    let positionghostcheckpoint = Race.racedata[player.race.path][player.race.checkpoints + 1];

    jcmp.events.CallRemote('race_checkpoint_client_Beta', player, JSON.stringify(positionnextcheckpoint), Race.id, Race.PoiType, Race.checkpointhash, Race.ChekpointType, JSON.stringify(positionghostcheckpoint));
    jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
    return;
  }

  if (Race.racedata[player.race.path][player.race.checkpoints + 1].finish) { // next checkpoint is the last
    player.race.checkpoints++;
    let lastnextcheckpoint = Race.racedata[player.race.path][player.race.checkpoints];
    jcmp.events.CallRemote('race_checkpoint_client_Beta', player, JSON.stringify(lastnextcheckpoint), Race.id, Race.PoiType, Race.checkpointhash, Race.ChekpointType);
    console.log("last checkpoint MultiplePath");
    jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
    return;
  }

  if (Race.racedata[player.race.path][player.race.checkpoints].finish) { // End of the race
    jcmp.events.CallRemote('race_checkpoint_client_Beta', player, player.race.checkpoints);
    race.chat.send(player, "[SERVER] You finished the race! Well done!!");
    jcmp.events.CallRemote('End_Timer', player);
    return;
  }







});
