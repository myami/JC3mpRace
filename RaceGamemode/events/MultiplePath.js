
function changerezposition(player){
  const Race = player.race.game;
  let checkpointcoordinate = new Vector3f(Race.racedata[player.race.path][player.race.checkpoints].x, Race.racedata[player.race.path][player.race.checkpoints].y + Race.racedata.AddingYatrespawn, Race.racedata[player.race.path][player.race.checkpoints].z);
  player.respawnPosition = race.utils.randomSpawn(checkpointcoordinate, 15);
  player.race.playerrotationspawn = new Vector3f(Race.racedata[player.race.path][player.race.checkpoints].rotx,Race.racedata[player.race.path][player.race.checkpoints].roty, Race.racedata[player.race.path][player.race.checkpoints].rotz);
}
jcmp.events.Add('MP_Race_Checkpoint', function(player) {
  const Race = player.race.game;
  player.race.checkpoints++;
  if (Race.racedata[player.race.path].length == player.race.checkpoints){
    console.log("Egal");
    console.log(Race.racedata[player.race.path][player.race.checkpoints - 1]);
    if(Race.racedata[player.race.path][player.race.checkpoints - 1].finish){
      jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
      race.chat.send(player, "[SERVER] You finished the race! Well done!!");
      jcmp.events.CallRemote('End_Timer',player);
      console.log("Race Finish");
      return;
    }

    // generate the new path

    let checkpoint = Race.racedata[player.race.path][player.race.checkpoints - 1];
    let newpathi;

    if(checkpoint.CheckpointArray.length > 1){

       newpathi = race.utils.random(0, checkpoint.CheckpointArray.length );
    }
    else{
      newpathi = 0;
    }

    let newpath = checkpoint.CheckpointArray[newpathi];
    console.log(newpath);
    player.race.path = newpath;
    player.race.checkpoints = 0;

    let datas ={
         Dimension : Race.id,
         PoiType : Race.racedata.PoiType,
         CheckpointHash : Race.racedata.checkpointhash,
         CheckpointType : Race.racedata.ChekpointType,
         FirstCheckpoint : Race.racedata[player.race.path][player.race.checkpoints],
         SecondCheckpoint : Race.racedata[player.race.path][player.race.checkpoints + 1],
     };


     console.log("3");
       jcmp.events.CallRemote('race_checkpoint_client_Beta', player, JSON.stringify(datas));
       jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
       jcmp.events.CallRemote('Checkpoint_length_client', player, Race.racedata[player.race.path].length);

       changerezposition(player);
       return;

}
if (player.race.checkpoints == Race.racedata[player.race.path].length - 1) { // last checkpoint of the array
  let datas ={
      Dimension : Race.id,
      PoiType : Race.racedata.PoiType,
      CheckpointHash : Race.racedata.checkpointhash,
      CheckpointType : Race.racedata.ChekpointType,
      FirstCheckpoint : Race.racedata[player.race.path][player.race.checkpoints],
  };


  jcmp.events.CallRemote('race_checkpoint_client_Beta', player, JSON.stringify(datas));
  console.log("last checkpoint multiplepath of the array");
  jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
  changerezposition(player);

  return;
}
console.log("Basic MultiplePath should not appearing on race test");

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



  }

);



jcmp.events.Add('MP_race_end_point', function(player) {

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
