jcmp.events.Add('MP_Race_Checkpoint', function(player) {
  const Race = player.race.game;
    if (this.racedata.raceCheckpoint[player.race.checkpoints + 1].LaunchANewBranch == false){
      player.race.checkpoints++;

        if (player.race.checkpoints == Race.raceCheckpoint.length) { // if it's egal it's mean it's the last checkpoint
          jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
          race.chat.send(player, "[SERVER] You finished the race! Well done!!");
          jcmp.events.CallRemote('End_Timer',player);
          return;

        }
        if (player.race.checkpoints == Race.raceCheckpoint.length - 1) { // last checkpoint
          let lastnextcheckpoint = Race.raceCheckpoint[player.race.checkpoints];
          jcmp.events.CallRemote('race_checkpoint_client', player, JSON.stringify(lastnextcheckpoint), Race.id, Race.PoiType, Race.checkpointhash, Race.ChekpointType);
          console.log("last checkpoint Classic");
          jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
          return;
          // change the poi text to last checkpoint
        }
        let positionnextcheckpoint = Race.raceCheckpoint[player.race.checkpoints];
        let positionghostcheckpoint = this.racedata.raceCheckpoint[player.race.checkpoints + 1];

        jcmp.events.CallRemote('race_checkpoint_client', player, JSON.stringify(positionnextcheckpoint), Race.id, Race.PoiType, Race.checkpointhash, Race.ChekpointType, JSON.stringify(positionghostcheckpoint));
        jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);


    }




  if (this.racedata.raceCheckpoint[player.race.checkpoints + 1].LaunchANewBranch == true){
    // choice a random path between the one available
    //player.race.path  = race.utils.random(0 , this.racedata.NumberOfDifferentStartingPoint);
    // then show the number of checkpoint until next random path
  //  jcmp.events.CallRemote('Checkpoint_length_client', player, this.raceCheckpoint.length);
  }


});
