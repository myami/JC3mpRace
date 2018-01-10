
function changerezposition(player){
  const Race = player.race.game;
  let checkpointcoordinate = new Vector3f(Race.racedata[player.race.path][player.race.checkpoints].x, Race.racedata[player.race.path][player.race.checkpoints].y + Race.racedata.AddingYatrespawn, Race.racedata[player.race.path][player.race.checkpoints].z);
  player.respawnPosition = race.utils.randomSpawn(checkpointcoordinate, 15);
  player.race.playerrotationspawn = new Vector3f(Race.racedata[player.race.path][player.race.checkpoints].rotx,Race.racedata[player.race.path][player.race.checkpoints].roty, Race.racedata[player.race.path][player.race.checkpoints].rotz);

}
jcmp.events.Add('MP_Race_Checkpoint', function(player) { // need rewrite
  const Race = player.race.game;

    player.race.checkpoints++;
    console.log("0");
    if (Race.racedata[player.race.path][player.race.checkpoints + 1] == undefined) {

      console.log("5");

      if (Race.racedata[player.race.path].length <= player.race.checkpoints + 1){
        console.log("2");
          let data ={
              Dimension : Race.id,
              PoiType : Race.racedata.PoiType,
              CheckpointHash : Race.racedata.checkpointhash,
              CheckpointType : Race.racedata.ChekpointType,
              FirstCheckpoint : Race.racedata[player.race.path][player.race.checkpoints], // render the last checkpoint on the array
          };
          console.log("first" + data.FirstCheckpoint.x);
          jcmp.events.CallRemote('race_checkpoint_client_Beta', player, JSON.stringify(data));
          // generate the new path

          let checkpoint = Race.racedata[player.race.path][player.race.checkpoints];
          let newpathi;
          if(checkpoint.CheckpointArray.length > 1){
             newpathi = race.utils.random(0, checkpoint.CheckpointArray.length );
          }
          else{
            newpathi = 0;
          }
          let newpath = checkpoint.CheckpointArray[newpathi];
          player.race.path = newpath;
          player.race.checkpoints = 0;

          let datas ={
               Dimension : Race.id,
               PoiType : Race.racedata.PoiType,
               CheckpointHash : Race.racedata.checkpointhash,
               CheckpointType : Race.racedata.ChekpointType,
               FirstCheckpoint : Race.racedata[player.race.path][player.race.checkpoints],
               SecondCheckpoint : Race.racedata[player.race.path][player.race.checkpoints], // render only the POI on the new path
           };
           console.log("second" + datas.SecondCheckpoint.x);

           console.log("3");
             jcmp.events.CallRemote('race_checkpoint_client_Beta', player, JSON.stringify(datas));
             jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);

      }
      changerezposition(player);

      return;
    }
    if (Race.racedata[player.race.path][player.race.checkpoints].finish) { // End of the race
      jcmp.events.CallRemote('race_checkpoint_client_Beta', player, player.race.checkpoints);
      race.chat.send(player, "[SERVER] You finished the race! Well done!!");
      jcmp.events.CallRemote('End_Timer', player);
      return;
    }
    if (Race.racedata[player.race.path][player.race.checkpoints + 1].LaunchANewBranch == false) { // if the one after is not a new branch
      let datas ={
          Dimension : Race.id,
          PoiType : Race.racedata.PoiType,
          CheckpointHash : Race.racedata.checkpointhash,
          CheckpointType : Race.racedata.ChekpointType,
          FirstCheckpoint : Race.racedata[player.race.path][player.race.checkpoints], // generate as checkpoint and poi
          SecondCheckpoint : Race.racedata[player.race.path][player.race.checkpoints + 1]

      };
      console.log("first" + datas.FirstCheckpoint.x + "second" + datas.SecondCheckpoint.x);
        console.log("1");

      jcmp.events.CallRemote('race_checkpoint_client_Beta', player, JSON.stringify(datas));
      jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);


    }

    changerezposition(player);
    console.log("4");
    return;






/*





   if (Race.racedata[player.race.path][player.race.checkpoints].LaunchANewBranch == false) {
      if (Race.racedata[player.race.path][player.race.checkpoints + 1].finish) { // next checkpoint is the last
        player.race.checkpoints++;
        let datas ={
            Dimension : Race.id,
            PoiType : Race.racedata.PoiType,
            CheckpointHash : Race.racedata.checkpointhash,
            CheckpointType : Race.racedata.ChekpointType,
            FirstCheckpoint : Race.racedata[player.race.path][player.race.checkpoints]


        };
        jcmp.events.CallRemote('race_checkpoint_client_Beta', player, JSON.stringify(datas));
        console.log("last checkpoint MultiplePath");
        jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
        return;
      }



      if (Race.racedata[player.race.path][player.race.checkpoints].length > player.race.checkpoints){
          player.race.checkpoints++;
        let datas ={
            Dimension : Race.id,
            PoiType : Race.racedata.PoiType,
            CheckpointHash : Race.racedata.checkpointhash,
            CheckpointType : Race.racedata.ChekpointType,
            FirstCheckpoint : Race.racedata[player.race.path][player.race.checkpoints],
            SecondCheckpoint : Race.racedata[player.race.path][player.race.checkpoints + 1]

        };
        console.log(Race.racedata[player.race.path][player.race.checkpoints].x) + "NonewBranch";



        jcmp.events.CallRemote('race_checkpoint_client_Beta', player, JSON.stringify(datas));
        jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
        console.log("Not a new branch");
        changerezposition(player);
        return;

      }



  }

  if (Race.racedata[player.race.path][player.race.checkpoints].LaunchANewBranch == true) {



    let data ={
        Dimension : Race.id,
        PoiType : Race.racedata.PoiType,
        CheckpointHash : Race.racedata.checkpointhash,
        CheckpointType : Race.racedata.ChekpointType,
        FirstCheckpoint : Race.racedata[player.race.path][player.race.checkpoints], // render the last checkpoint on the array

    };
    console.log(Race.racedata[player.race.path][player.race.checkpoints].x + "Last of the branch");


      jcmp.events.CallRemote('race_checkpoint_client_Beta', player, JSON.stringify(data));


      // Generate the new path
      let checkpoint = Race.racedata[player.race.path][player.race.checkpoints];
      let newpathi = race.utils.random(0, checkpoint.CheckpointArray.length );
      let newpath = checkpoint.CheckpointArray[newpathi];
    player.race.path = newpath;
    player.race.checkpoints = 0;
    console.log(player.race.path);
    console.log(Race.racedata[player.race.path]);
   let datas ={
        Dimension : Race.id,
        PoiType : Race.racedata.PoiType,
        CheckpointHash : Race.racedata.checkpointhash,
        CheckpointType : Race.racedata.ChekpointType,
        SecondCheckpoint : Race.racedata[player.race.path][player.race.checkpoints],
    };
    console.log(Race.racedata[player.race.path][player.race.checkpoints].x + "First of the branch");

      jcmp.events.CallRemote('race_checkpoint_client_Beta', player, JSON.stringify(datas));


    jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
    console.log("New Branch");
    changerezposition(player);

    return;
  }




  if (Race.racedata[player.race.path][player.race.checkpoints].finish) { // End of the race
    jcmp.events.CallRemote('race_checkpoint_client_Beta', player, player.race.checkpoints);
    race.chat.send(player, "[SERVER] You finished the race! Well done!!");
    jcmp.events.CallRemote('End_Timer', player);
    return;
  }

*/




});
