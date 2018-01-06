'use strict';

module.exports = class RaceBeta {
  constructor(race,raceid,numplayer,playerarray,typeselect) {
    this.racedata = race;
    this.id = raceid;
    this.NumberofPlayer = numplayer;
    this.Players = playerarray;
    this.type = typeselect;
  }

  Start() {
    console.log("Id of the race: " + this.id);
    console.log("type of the race: " + this.type);

      this.MPSTART();



  }


  //////////////////////////////////////////////// CLASSIC RACE ///////////////////////////////////////////////////////
  MPSTART() {
    for (var i = 0; i < this.Players.length; i++) {
      const player = this.Players[i];
      player.race.game = this;
      player.race.ingame = true;
      player.dimension = this.id;
      player.race.time = 0;
      player.race.hasfinish = false;
      player.position = new Vector3f(this.racedata.StartingPoint[i].x, this.racedata.StartingPoint[i].y, this.racedata.StartingPoint[i].z);
      player.rotation = new Vector3f(this.racedata.StartingPoint[i].rotx, this.racedata.StartingPoint[i].roty, this.racedata.StartingPoint[i].rotz);
      player.race.path = this.racedata.StartingPoint[i].CheckpointArray ;
      console.log(player.race.path);

      let FirstCheckpoint = this.racedata[player.race.path][player.race.checkpoints];
      let SecondCheckpoint = this.racedata[player.race.path][player.race.checkpoints + 1];
    //  console.log("X:" + FirstCheckpoint.x);


      jcmp.events.CallRemote('race_Freeze_player', player);
      jcmp.events.CallRemote('race_set_time', player, this.racedata.time.hour, this.racedata.time.minute);
      jcmp.events.CallRemote('race_set_weather', player, this.racedata.weather);
      //spawning the first checkpoint
      jcmp.events.CallRemote('race_checkpoint_client', player, JSON.stringify(FirstCheckpoint), this.id, this.racedata.PoiType, this.racedata.checkpointhash, this.racedata.ChekpointType, JSON.stringify(SecondCheckpoint));

      jcmp.events.CallRemote('Checkpoint_length_client', player, this.racedata[player.race.path].length); // from the starting point to the first random path
      jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
      jcmp.events.CallRemote('race_Start_client', player, this.type);

    }
  }

  MPRespawnCar(player) {
    if (player.race.vehicle != 0) {
      const vehicle = new Vehicle(player.race.vehicle, player.position, player.race.playerrotationspawn);
      vehicle.nitroEnabled = player.race.nitro;
      console.log("Vehicle spawning");
      vehicle.dimension = player.race.game.id;
      setTimeout(function() {
        vehicle.SetOccupant(0, player); // sometime the player don't go inside or vehicle is destroy to early
        //  race.game.RacePeopleDie.removePlayer(player);
        player.race.spawningdouble = false;
      }, race.game.respawntimer + 1000);
    } else {
      //Wingsuit race
    }
  }



























}
