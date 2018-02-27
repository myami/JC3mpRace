'use strict';

module.exports = class RaceBeta {
  constructor(race, raceid, playerarray, typeselect) {
    this.racedata = race;
    this.id = raceid;
    this.NumberofPlayer = playerarray.length;
    this.Players = playerarray;
    this.type = typeselect;
    this.IsWingsuit = false;
    this.TtsIndex = 0;
  }

  Start() {
    if (this.racedata.defaultVehicle == 0) {
      this.IsWingsuit = true;
    }
    console.log("Id of the race: " + this.id);
    console.log("Map of the race : " + this.racedata.Name);

    if (this.type == 0) {
      console.log("ClassicRace!!!");

      this.ClassicRace();
      return;
    }


    if (this.type == 2) {
      console.log("TTS !!!!!!!!");
      this.TTSStart();
      return;
    }


    if (this.type == 4) {
      console.log("MULTIPLEPATH!!!!!!!!!");
      this.MPSTART();
      return;
    }

  }






  //////////////////////////////////////////////// CLASSIC RACE ///////////////////////////////////////////////////////
  ClassicRace() {
    for (var i = 0; i < this.Players.length; i++) {

      const player = this.Players[i];
      player.race.game = this;
      player.race.ingame = true;
      player.race.ready = false;

      player.dimension = this.id;
      player.race.time = 0;
      player.race.hasfinish = false;
      // Player spawn
      player.position = new Vector3f(this.racedata.StartingPoint[i].x, this.racedata.StartingPoint[i].y + 3, this.racedata.StartingPoint[i].z);
      player.rotation = new Vector3f(this.racedata.StartingPoint[i].rotx, this.racedata.StartingPoint[i].roty, this.racedata.StartingPoint[i].rotz);
      // Player rotation if they die to restart in the good direction
      let rotation = new Vector3f(this.racedata.StartingPoint[i].rotx, this.racedata.StartingPoint[i].roty, this.racedata.StartingPoint[i].rotz);
      player.race.playerrotationspawn = rotation;
      player.respawnPosition = new Vector3f(this.racedata.StartingPoint[i].x, this.racedata.StartingPoint[i].y, this.racedata.StartingPoint[i].z);
      player.race.path = "RaceCheckpoint";

      if (!this.IsWingsuit) {
        player.race.vehicle = this.racedata.defaultVehicle;
        setTimeout(function() {
          const vehicle = new Vehicle(player.race.vehicle, player.position, rotation);

         if (player.race.game.racedata.nitroenabled){
      //  player.vehicle.nitroEnabled = enabled;
          console.log("nitro");
        }

          vehicle.dimension = player.race.game.id;
          vehicle.SetOccupant(0, player);
        }, 4000);

      }
      if (this.IsWingsuit){
        player.race.vehicle = undefined;
      }

      jcmp.events.CallRemote('race_Freeze_player', player);
      jcmp.events.CallRemote('race_set_time', player, this.racedata.time.hour, this.racedata.time.minute, 0);
      jcmp.events.CallRemote('race_set_weather', player, this.racedata.weather);
      //spawning the first checkpoint
      let data = {
        Dimension: this.id,
        PoiType: this.racedata.PoiType,
        CheckpointHash: this.racedata.checkpointhash,
        CheckpointType: this.racedata.ChekpointType,
        FirstCheckpoint: this.racedata[player.race.path][player.race.checkpoints],
        SecondCheckpoint: this.racedata[player.race.path][player.race.checkpoints + 1]

      };
      jcmp.events.CallRemote('race_checkpoint_client_Beta', player, JSON.stringify(data));

      jcmp.events.CallRemote('Checkpoint_length_client', player, this.racedata[player.race.path].length); // from the starting point to the first random path
      jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
      jcmp.events.CallRemote('race_Start_client', player, this.type);
    }
  }

  CRRespawnCar(player) {
    if (player.race.vehicle != 0) {
      const vehicle = new Vehicle(player.race.vehicle, player.position, player.race.playerrotationspawn);
      if (player.race.game.racedata.nitroenabled){
      //  player.vehicle.nitroEnabled = enabled;
       console.log("nitro");
     }
      console.log("Vehicle spawning");
      vehicle.dimension = player.race.game.id;
      setTimeout(function() {
        vehicle.SetOccupant(0, player); // sometime the player don't go inside or vehicle is destroy to early
        //  race.game.RacePeopleDie.removePlayer(player);
        player.race.spawningdouble = false;
      }, 2000);
    } else {
      //Wingsuit race
    }
  }

  //////////////////////////////////////////////// MultiplePath ///////////////////////////////////////////////////////
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
      let rotation = new Vector3f(this.racedata.StartingPoint[i].rotx, this.racedata.StartingPoint[i].roty, this.racedata.StartingPoint[i].rotz);
      player.race.playerrotationspawn = rotation;
       player.race.path = this.racedata.StartingPoint[i].CheckpointArray;




      //  console.log("X:" + FirstCheckpoint.x);

      if (!this.IsWingsuit) {
        player.race.vehicle = this.racedata.defaultVehicle;
        setTimeout(function() {
          const vehicle = new Vehicle(player.race.vehicle, player.position, player.rotation);
          if (player.race.game.racedata.nitroenabled){
          //  player.vehicle.nitroEnabled = enabled;
           console.log("nitro");
         }
          vehicle.dimension = player.race.game.id;
          vehicle.SetOccupant(0, player);
        }, 4000);

      }


      jcmp.events.CallRemote('race_Freeze_player', player);
      jcmp.events.CallRemote('race_set_time', player, this.racedata.time.hour, this.racedata.time.minute, 0);
      jcmp.events.CallRemote('race_set_weather', player, this.racedata.weather);
      //spawning the first checkpoint
      let data = {
        Dimension: this.id,
        PoiType: this.racedata.PoiType,
        CheckpointHash: this.racedata.checkpointhash,
        CheckpointType: this.racedata.ChekpointType,
        FirstCheckpoint: this.racedata[player.race.path][player.race.checkpoints],
        SecondCheckpoint: this.racedata[player.race.path][player.race.checkpoints + 1]

      };
      console.log(this.racedata[player.race.path][player.race.checkpoints].x);

      jcmp.events.CallRemote('race_checkpoint_client_Beta', player, JSON.stringify(data));

      jcmp.events.CallRemote('Checkpoint_length_client', player, this.racedata[player.race.path].length); // from the starting point to the first random path
      jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
      jcmp.events.CallRemote('race_Start_client', player, this.type);

    }
  }

  MPRespawnCar(player) {
    if (player.race.vehicle != 0) {
      const vehicle = new Vehicle(player.race.vehicle, player.position, player.race.playerrotationspawn);
      if (player.race.game.racedata.nitroenabled){
      //  player.vehicle.nitroEnabled = enabled;
       console.log("nitro");
     }
      console.log("Vehicle spawning");
      vehicle.dimension = player.race.game.id;
      setTimeout(function() {
        vehicle.SetOccupant(0, player); // sometime the player don't go inside or vehicle is destroy to early
        //  race.game.RacePeopleDie.removePlayer(player);
        player.race.spawningdouble = false;
      }, 2000);
    } else {
      //Wingsuit race
    }
  }







  //////////////////////////////TTS//////////////////////////////////

  TTSStart() {
    console.log("TTSStart");
    for (var i = 0; i < this.Players.length; i++) {
      const player = this.Players[i];
      player.race.game = this;
      player.race.ingame = true;
      player.dimension = this.id;
      player.race.time = 0;
      player.race.hasfinish = false;
      // Player spawn
      player.position = new Vector3f(this.racedata.StartingPoint[i].x, this.racedata.StartingPoint[i].y, this.racedata.StartingPoint[i].z);
      player.rotation = new Vector3f(this.racedata.StartingPoint[i].rotx, this.racedata.StartingPoint[i].roty, this.racedata.StartingPoint[i].rotz);
      // Player rotation if they die to restart in the good direction
      let rotation = new Vector3f(this.racedata.StartingPoint[i].rotx, this.racedata.StartingPoint[i].roty, this.racedata.StartingPoint[i].rotz);
      player.race.playerrotationspawn = rotation;
      player.respawnPosition = new Vector3f(this.racedata.StartingPoint[i].x, this.racedata.StartingPoint[i].y, this.racedata.StartingPoint[i].z);
      player.race.path = "RaceCheckpoint";



      if (!this.IsWingsuit) {
        player.race.vehicle = this.racedata.defaultVehicle;
        setTimeout(function() {
          const vehicle = new Vehicle(player.race.vehicle, player.position, rotation);
          if (player.race.game.racedata.nitroenabled){
          //  player.vehicle.nitroEnabled = enabled;
           console.log("nitro");
         }
          vehicle.dimension = player.race.game.id;
          vehicle.SetOccupant(0, player);
        }, 4000);

      }

      jcmp.events.CallRemote('race_Freeze_player_wait', player);
      jcmp.events.CallRemote('race_set_time', player, this.racedata.time.hour, this.racedata.time.minute, 0);
      jcmp.events.CallRemote('race_set_weather', player, this.racedata.weather);
      //spawning the first checkpoint
      let data = {
        Dimension: this.id,
        PoiType: this.racedata.PoiType,
        CheckpointHash: this.racedata.checkpointhash,
        CheckpointType: this.racedata.ChekpointType,
        FirstCheckpoint: this.racedata[player.race.path][player.race.checkpoints],
        SecondCheckpoint: this.racedata[player.race.path][player.race.checkpoints + 1]

      };
      jcmp.events.CallRemote('race_checkpoint_client_Beta', player, JSON.stringify(data));

      jcmp.events.CallRemote('Checkpoint_length_client', player, this.racedata[player.race.path].length); // from the starting point to the first random path
      jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
      jcmp.events.CallRemote('race_Start_client', player, this.type);
    }
    // freeze all player
    // Unfreeze only the first player after the countdown , wait 30 sec and Unfreeze an other player etc....

    this.TTSPlayerStartRelease();
  }



  TTSRespawnCar(player) {
    if (player.race.vehicle != 0) {
      const vehicle = new Vehicle(player.race.vehicle, player.position, player.race.playerrotationspawn);
      if (player.race.game.racedata.nitroenabled){
      //  player.vehicle.nitroEnabled = enabled;
       console.log("nitro");
     }
      console.log("Vehicle spawning");
      vehicle.dimension = player.race.game.id;
      setTimeout(function() {
        vehicle.SetOccupant(0, player); // sometime the player don't go inside or vehicle is destroy to early
        //  race.game.RacePeopleDie.removePlayer(player);
        player.race.spawningdouble = false;
      },  2000);
    } else {
      //Wingsuit race
    }
  }


  TTSPlayerStartRelease() {

    console.log(`${this.Players.length} player length and ${this.TtsIndex}`);
    if (this.Players.length > this.TtsIndex) {
      console.log(`tts unfreeze player `);
      jcmp.events.CallRemote('TTS_race_Freeze_player', this.Players[this.TtsIndex]);
      race.chat.broadcast(`${this.Players[this.TtsIndex].name} it's you're turn to start`)
      console.log(this.TtsIndex + "ttsunfreezeplayer : " + this.Players[this.TtsIndex].name);
      this.TtsIndex++;
    } else {
      console.log("All the player have start");
    }

  }









}
