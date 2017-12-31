'use strict';

module.exports = class RaceBeta {
  constructor(race,raceid,numplayer,playerarray,typeselect) {
    this.racedata = race;
    this.id = raceid;
    this.NumberofPlayer = numplayer;
    this.Players = playerarray;
    this.Type = typeselect;
  }

  Start() {
    console.log("Id of the race: " + this.id);
    console.log("type of the race: " + this.Type);
    console.log(this.players);

    if (this.type == 4) {
      console.log("MultiplePath");
      this.MPSTART();
      return;
    }


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
       // need to find a way to can choice how many people willbe on each starting point at the place of random because if one starting point have only 2 spawn and an other 3 to be sure they are the corect ammount
      player.race.path = race.utils.random(0 , this.racedata.NumberOfDifferentStartingPoint);
      // then spawning vehicle





      let firstcheckpoint = this.racedata.raceCheckpoint[player.race.checkpoints];
      if (this.racedata.raceCheckpoint[player.race.checkpoints + 1].LaunchANewBranch == false){
        let ghostcheckpoint = this.racedata.raceCheckpoint[player.race.checkpoints + 1];
        // need to rewrite the  race_checkpoint_client
          jcmp.events.CallRemote('race_checkpoint_client', player, JSON.stringify(firstcheckpoint), this.id, this.PoiType, this.checkpointhash, this.ChekpointType, JSON.stringify(ghostcheckpoint));
      }
      jcmp.events.CallRemote('PlayerPassager', player, false);
      jcmp.events.CallRemote('race_Freeze_player', player);
      jcmp.events.CallRemote('race_set_time', player, this.time.hour, this.time.minute);
      jcmp.events.CallRemote('race_set_weather', player, this.weather);
      //spawning the first checkpoint

      jcmp.events.CallRemote('Checkpoint_length_client', player, this.raceCheckpoint.length); // from the starting point to the first random path
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
