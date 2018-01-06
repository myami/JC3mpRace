jcmp.events.Add('C_Race_Checkpoint', function(player) {
  const Race = player.race.game;


    // Set the new restart point
  let checkpointcoordinate = new Vector3f(Race.racedata[player.race.path][player.race.checkpoints].x, Race.racedata[player.race.path][player.race.checkpoints].y + Race.racedata.AddingYatrespawn, Race.racedata[player.race.path][player.race.checkpoints].z);
  player.respawnPosition = race.utils.randomSpawn(checkpointcoordinate, 15);
  player.race.playerrotationspawn = new Vector3f(Race.racedata[player.race.path][player.race.checkpoints].rotx,Race.racedata[player.race.path][player.race.checkpoints].roty, Race.racedata[player.race.path][player.race.checkpoints].rotz);

  player.race.checkpoints++;

  if (player.race.checkpoints == Race.racedata[player.race.path].length) { // if it's egal it's mean it's the last checkpoint
    jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
    race.chat.send(player, "[SERVER] You finished the race! Well done!!");
    jcmp.events.CallRemote('End_Timer',player);
    return;
    // whas last checkpoint
  }
  if (player.race.checkpoints == Race.racedata[player.race.path].length - 1) { // last checkpoint
    let datas ={
        Dimension : Race.id,
        PoiType : Race.racedata.PoiType,
        CheckpointHash : Race.racedata.checkpointhash,
        CheckpointType : Race.racedata.ChekpointType,
        FirstCheckpoint : Race.racedata[player.race.path][player.race.checkpoints],
    };

    jcmp.events.CallRemote('race_checkpoint_client_Beta', player, JSON.stringify(datas));
    console.log("last checkpoint Classic");
    jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
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


});


jcmp.events.Add('C_race_end_point', function(player) {

  player.race.hasfinish = true;

  let minute = Math.floor(player.race.time / 60);
  let seconds = player.race.time % 60
  let playername = player.name;
  race.chat.broadcast(`[SERVER] ${playername} as done the race with a time of ${minute} minutes and ${seconds} seconds!`, race.config.colours.red);
  setTimeout(function() {
    jcmp.events.Call('race_player_leave_game', player)
    player.race.time = 0;
  }, 2000);

});
