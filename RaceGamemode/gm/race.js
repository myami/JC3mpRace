'use strict';

module.exports = class Race {
  constructor(id, VehicleType, player, NumberofPlayer, StartingPoint, RaceCheckpoint, times, weatherr, defaultvehicle, alldefaultvehicle, addingyatspawn, checkpointhash, checkpointtype, poitype, nitrobool, ghostpoi, cameraview, types) {
    this.id = id;
    this.vehicletype = VehicleType;
    this.players = player;
    this.notfinish = NumberofPlayer;
    this.startingpoint = StartingPoint;
    this.raceCheckpoint = RaceCheckpoint;
    this.time = times;
    this.weather = weatherr;
    this.defaultvehicle = defaultvehicle;
    this.alldefaultvehicle = alldefaultvehicle;
    this.AddingYatrespawn = addingyatspawn;
    this.checkpointhash = checkpointhash;
    this.ChekpointType = checkpointtype;
    this.PoiType = poitype;
    this.ghostpoi = ghostpoi;
    this.nitro = nitrobool;
    this.leaderboard = [];
    this.playersname = [];
    this.wingsuitrace = false;
    this.cameraview = cameraview;
    this.type = types;
    this.mctime = 15000; // time in seconds before changing player on mc
    this.intervalapo = undefined;
    this.ttsindex = 0;


  }

  Start() {
    console.log("Id of the race: " + this.id);

    if (this.type == undefined || this.type == "classic") {
      console.log("ClassicRace!!!");
      this.ClassicRace();
    } else if (this.type == "multicrew") {
      console.log("Multicrew!!!");
      this.Multicrew();
    } else if (this.type == "apo") {
      console.log("APOCALYPSE NOW!!!");
      this.ClassicRace();
      setTimeout(function() {
        this.apoStart();
      }, 30000);
    } else if (this.type == "kart") {
      console.log("KART !!!!!");
      this.KartRaceStart();

    }
    else if (this.Type == "tts"){
      console.log("TTS !!!!!!!!");
      this.TTSStart();
    }


  }

  broadcast(msg, color) {
    for (let player of this.players) {
      race.chat.send(player, msg, color);
    }
  }

  AddPlayerOnLeaderboard(player) {
    jcmp.events.CallRemote('Add_Player_On_Leaderboard', player, JSON.stringify(this.playersname));
  }


  UpdateEndLeaderboard(playername, leaderboardplace, minute, seconds) {
    for (let player of this.players) {
      jcmp.events.CallRemote('Update_leaderboard_all', player, playername, leaderboardplace, minute, seconds);
      // Don't update on people that have finish the race before you maybe because they are remove from the Race constructor
    }

  }

  //////////////////////////////////////////////// CLASSIC RACE ///////////////////////////////////////////////////////
  ClassicRace() {
    for (var i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      let rotation = new Vector3f(this.startingpoint[i].rotx, this.startingpoint[i].roty, this.startingpoint[i].rotz);
      player.race.playerrotationspawn = rotation;
      player.position = new Vector3f(this.startingpoint[i].x, this.startingpoint[i].y, this.startingpoint[i].z);
      player.rotation = new Vector3f(this.startingpoint[i].rotx, this.startingpoint[i].roty, this.startingpoint[i].rotz);
      player.respawnPosition = new Vector3f(this.startingpoint[i].x, this.startingpoint[i].y, this.startingpoint[i].z);
      player.race.game = this;
      player.race.ingame = true;
      player.dimension = this.id;
      player.race.time = 0;
      player.race.hasfinish = false;
      this.playersname.push(player.name);


      if (player.race.vehicle == 0) {
        // wingsuit race
        console.log("true wingsuit");
        this.wingsuitrace = true;
      }
      if (this.alldefaultvehicle) {
        player.race.vehicle = this.defaultvehicle;
        //jcmp.events.Call('race_player_checkpoint_respawn', player);
        setTimeout(function() {
          if (player.race.vehicle != 0) {
            const vehicle = new Vehicle(player.race.vehicle, player.position, rotation);
            vehicle.nitroEnabled = this.nitro;
            vehicle.dimension = player.race.game.id;
            vehicle.SetOccupant(0, player);

          }

        }, 4000);

      } else {
        //  jcmp.events.CallRemote('race_vehicle_choice_menu',player);
      }
      let firstcheckpoint = this.raceCheckpoint[player.race.checkpoints];
      let ghostcheckpoint = this.raceCheckpoint[player.race.checkpoints + 1];
      if (this.wingsuitrace) {
        jcmp.events.CallRemote('race_checkpoint_client', player, JSON.stringify(firstcheckpoint), this.id, this.PoiType, this.checkpointhash, this.ChekpointType, JSON.stringify(ghostcheckpoint), true);

      } else {
        jcmp.events.CallRemote('race_checkpoint_client', player, JSON.stringify(firstcheckpoint), this.id, this.PoiType, this.checkpointhash, this.ChekpointType, JSON.stringify(ghostcheckpoint));

      }
      jcmp.events.CallRemote('PlayerPassager', player, false);
      jcmp.events.CallRemote('race_Freeze_player', player);
      jcmp.events.CallRemote('race_set_time', player, this.time.hour, this.time.minute);
      jcmp.events.CallRemote('race_set_weather', player, this.weather);
      //spawning the first checkpoint

      jcmp.events.CallRemote('Checkpoint_length_client', player, this.raceCheckpoint.length);
      jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
      jcmp.events.CallRemote('race_Start_client', player, this.type);
    }
  }

  CRRespawnCar(player) {
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

  /////////////////////////////////// MULTICREW ////////////////////////////////////////////////////////////////////

  Multicrew() {

    for (var i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      let rotation = new Vector3f(this.startingpoint[i].rotx, this.startingpoint[i].roty, this.startingpoint[i].rotz);
      player.race.playerrotationspawn = rotation;
      player.position = new Vector3f(this.startingpoint[i].x, this.startingpoint[i].y, this.startingpoint[i].z);
      player.rotation = new Vector3f(this.startingpoint[i].rotx, this.startingpoint[i].roty, this.startingpoint[i].rotz);
      player.respawnPosition = new Vector3f(this.startingpoint[i].x, this.startingpoint[i].y, this.startingpoint[i].z);
      player.race.game = this;
      player.race.ingame = true;
      player.dimension = this.id;
      player.race.time = 0;
      player.race.hasfinish = false;

      if (i % 2 === 0) {
        if (player.race.partnerplayer == undefined) {
          console.log("Player don't have partner");
          const secondplayer = this.players[i + 1];
          if (secondplayer.race.partnerplayer.length == 2) {
            player.race.partnerplayer.push(player);
            player.race.partnerplayer.push(secondplayer);
            secondplayer.race.partnerplayer = player.race.partnerplayer;
            jcmp.events.CallRemote('PlayerPassager', secondplayer, true);
            jcmp.events.CallRemote('PlayerPassager', player, false);
            this.playersname.push(player.name + " " + secondplayer.name);
            jcmp.events.CallRemote('ShowPassagerUI', secondplayer);
            jcmp.events.CallRemote('ShowDriverUI', player);
            jcmp.events.CallRemote('PartnerNameUI_Client', player, secondplayer.name);
            jcmp.events.CallRemote('PartnerNameUI_Client', secondplayer, player.name);
          } else {
            console.log("Next player have a partner loop into all player to find");
            for (var i = 0; i < this.players.length; i++) {
              const newplayer = this.players[i];
              if (newplayer != player) {
                if (newplayer.race.partner == undefined) {
                  console.log("Find a player without parner");
                  player.race.partnerplayer.push(player);
                  player.race.partnerplayer.push(newplayer);
                  newplayer.race.partnerplayer = player.race.partnerplayer;
                  jcmp.events.CallRemote('PlayerPassager', newplayer, true);
                  jcmp.events.CallRemote('PlayerPassager', player, false);
                  this.playersname.push(player.name + " " + newplayer.name);
                  jcmp.events.CallRemote('ShowPassagerUI', newplayer);
                  jcmp.events.CallRemote('ShowDriverUI', player);
                  jcmp.events.CallRemote('PartnerNameUI_Client', player, secondplayer.name);
                  jcmp.events.CallRemote('PartnerNameUI_Client', newplayer, player.name);
                } else {
                  // all the team is full ( it's mean it's impair so remove the player of the race)
                  race.chat.send(player, "No other player find for the multicrew you will be tp to the lobby it's probably mean you are an impair number");
                  jcmp.events.Call('race_player_leave_game', player);
                }
              }
            }
          }



        } else {
          console.log("Player Have a Partner");
          const secondplayer = player.race.partnerplayer[1];
          this.playersname.push(player.name + " " + secondplayer.name);
          jcmp.events.CallRemote('ShowDriverUI', player);
          jcmp.events.CallRemote('PlayerPassager', player, false);
          jcmp.events.CallRemote('ShowPassagerUI', secondplayer);
          jcmp.events.CallRemote('PlayerPassager', secondplayer, true);

        }

      }

      if (this.alldefaultvehicle) { // need to replace all this if to not spawn a vehicle per player but a vehicle per team
        player.race.vehicle = this.defaultvehicle;

        setTimeout(function() {
          if (player.race.vehicle != 0 && player.race.partnerplayer[0].name == player.name) {
            const vehicle = new Vehicle(player.race.vehicle, player.position, rotation);
            vehicle.nitroEnabled = this.nitro;
            vehicle.dimension = player.race.game.id;
            vehicle.SetOccupant(0, player);
            vehicle.SetOccupant(1, player.race.partnerplayer[1]);

          }

        }, 4000);
      }
      let firstcheckpoint = this.raceCheckpoint[player.race.checkpoints];
      let ghostcheckpoint = this.raceCheckpoint[player.race.checkpoints + 1];

      if (player.race.partnerplayer[1].name == player.name) {
        jcmp.events.CallRemote('race_checkpoint_client', player, JSON.stringify(firstcheckpoint), this.id, this.PoiType, this.checkpointhash, this.ChekpointType, JSON.stringify(ghostcheckpoint));
      }
      jcmp.events.CallRemote('race_Freeze_player', player);
      jcmp.events.CallRemote('race_set_time', player, this.time.hour, this.time.minute);
      jcmp.events.CallRemote('race_set_weather', player, this.weather);
      //spawning the first checkpoint

      jcmp.events.CallRemote('Checkpoint_length_client', player, this.raceCheckpoint.length);
      jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
      jcmp.events.CallRemote('race_Start_client', player, this.type);



    }

    setInterval(function() { // Not working
      //  jcmp.events.Call('MCChangePlayerDrive');
    }, this.mctime);
  }



  MCVehicleReset(player, vehicleold) {

    if (player.race.partnerplayer[0].name == player.name) {
      if (vehicleold != undefined) {
        vehicleold.Destroy();
      }
      const vehicle = new Vehicle(player.race.vehicle, player.position, player.race.playerrotationspawn);
      vehicle.nitroEnabled = this.nitro;
      vehicle.dimension = player.race.game.id;
      vehicle.SetOccupant(0, player);
      vehicle.SetOccupant(1, player.race.partnerplayer[1]);
      return;
    }
    if (player.race.partnerplayer[1].name == player.name) {
      if (player.race.partnerplayer[0].vehicle != undefined) {
        console.log("passager!!!");
        player.race.partnerplayer[0].vehicle.SetOccupant(1, player);
        return;
      }
    }
  }


  ///////////////////////////////// AppocalypseNOW ////////////////////////////////////////////////////


  // Falling explosive barrel around player every x seconds



  apoStart() {
    this.intervalapo = setInterval(function() {
      jcmp.events.Call('AppoBarrelSpawnAroundPlayer', this.players);
    }, 15000);




  }


  //////////////////////////////////// KART ////////////////////////////////////

  KartRaceStart() {
    for (var i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      let rotation = new Vector3f(this.startingpoint[i].rotx, this.startingpoint[i].roty, this.startingpoint[i].rotz);
      player.race.playerrotationspawn = rotation;
      player.position = new Vector3f(this.startingpoint[i].x, this.startingpoint[i].y, this.startingpoint[i].z);
      player.rotation = new Vector3f(this.startingpoint[i].rotx, this.startingpoint[i].roty, this.startingpoint[i].rotz);
      player.respawnPosition = new Vector3f(this.startingpoint[i].x, this.startingpoint[i].y, this.startingpoint[i].z);
      player.race.game = this;
      player.race.ingame = true;
      player.dimension = this.id;
      player.race.time = 0;
      player.race.hasfinish = false;
      this.playersname.push(player.name);


      if (player.race.vehicle == 0) {
        // wingsuit race
        console.log("true wingsuit");
        this.wingsuitrace = true;
      }
      if (this.alldefaultvehicle) {
        player.race.vehicle = this.defaultvehicle;
        //jcmp.events.Call('race_player_checkpoint_respawn', player);
        setTimeout(function() {
          if (player.race.vehicle != 0) {
            const vehicle = new Vehicle(player.race.vehicle, player.position, rotation);
            vehicle.nitroEnabled = this.nitro;
            vehicle.dimension = player.race.game.id;
            vehicle.SetOccupant(0, player);

          }

        }, 4000);

      } else {
        //  jcmp.events.CallRemote('race_vehicle_choice_menu',player);
      }
      let firstcheckpoint = this.raceCheckpoint[player.race.checkpoints];
      let ghostcheckpoint = this.raceCheckpoint[player.race.checkpoints + 1];
      if (this.wingsuitrace) {
        jcmp.events.CallRemote('race_checkpoint_client', player, JSON.stringify(firstcheckpoint), this.id, this.PoiType, this.checkpointhash, this.ChekpointType, JSON.stringify(ghostcheckpoint), true);

      } else {
        jcmp.events.CallRemote('race_checkpoint_client', player, JSON.stringify(firstcheckpoint), this.id, this.PoiType, this.checkpointhash, this.ChekpointType, JSON.stringify(ghostcheckpoint));

      }
      jcmp.events.CallRemote('PlayerPassager', player, false);
      jcmp.events.CallRemote('race_Freeze_player', player);
      jcmp.events.CallRemote('race_set_time', player, this.time.hour, this.time.minute);
      jcmp.events.CallRemote('race_set_weather', player, this.weather);
      //spawning the first checkpoint

      jcmp.events.CallRemote('Checkpoint_length_client', player, this.raceCheckpoint.length);
      jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
      jcmp.events.CallRemote('race_Start_client', player, this.type);
    }
  }


  KartRespawnCar(player) {
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




//////////////////////////////TTS//////////////////////////////////

TTSStart() {
  for (var i = 0; i < this.players.length; i++) {
    const player = this.players[i];
    let rotation = new Vector3f(this.startingpoint[i].rotx, this.startingpoint[i].roty, this.startingpoint[i].rotz);
    player.race.playerrotationspawn = rotation;
    player.position = new Vector3f(this.startingpoint[i].x, this.startingpoint[i].y, this.startingpoint[i].z);
    player.rotation = new Vector3f(this.startingpoint[i].rotx, this.startingpoint[i].roty, this.startingpoint[i].rotz);
    player.respawnPosition = new Vector3f(this.startingpoint[i].x, this.startingpoint[i].y, this.startingpoint[i].z);
    player.race.game = this;
    player.race.ingame = true;
    player.dimension = this.id;
    player.race.time = 0;
    player.race.hasfinish = false;
    this.playersname.push(player.name);


    if (player.race.vehicle == 0) {
      // wingsuit race
      console.log("true wingsuit");
      this.wingsuitrace = true;
    }
    if (this.alldefaultvehicle) {
      player.race.vehicle = this.defaultvehicle;
      //jcmp.events.Call('race_player_checkpoint_respawn', player);
      setTimeout(function() {
        if (player.race.vehicle != 0) {
          const vehicle = new Vehicle(player.race.vehicle, player.position, rotation);
          vehicle.nitroEnabled = this.nitro;
          vehicle.dimension = player.race.game.id;
          vehicle.SetOccupant(0, player);

        }

      }, 4000);

    } else {
      //  jcmp.events.CallRemote('race_vehicle_choice_menu',player);
    }
    let firstcheckpoint = this.raceCheckpoint[player.race.checkpoints];
    let ghostcheckpoint = this.raceCheckpoint[player.race.checkpoints + 1];
    if (this.wingsuitrace) {
      jcmp.events.CallRemote('race_checkpoint_client', player, JSON.stringify(firstcheckpoint), this.id, this.PoiType, this.checkpointhash, this.ChekpointType, JSON.stringify(ghostcheckpoint), true);

    } else {
      jcmp.events.CallRemote('race_checkpoint_client', player, JSON.stringify(firstcheckpoint), this.id, this.PoiType, this.checkpointhash, this.ChekpointType, JSON.stringify(ghostcheckpoint));

    }
    // freeze all player
    // Unfreeze only the first player after the countdown , wait 30 sec and Unfreeze an other player etc....
    jcmp.events.CallRemote('race_Freeze_player_wait',player);
    jcmp.events.CallRemote('PlayerPassager', player, false);
    jcmp.events.CallRemote('race_set_time', player, this.time.hour, this.time.minute);
    jcmp.events.CallRemote('race_set_weather', player, this.weather);

    //spawning the first checkpoint
    jcmp.events.CallRemote('Checkpoint_length_client', player, this.raceCheckpoint.length);
    jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
    jcmp.events.CallRemote('race_Start_client', player, this.type);
  }
  this.TTSPlayerStartRelease();
}

TTSRespawnCar(player) {
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


TTSPlayerStartRelease(){
  if (this.players.length <= this.ttsindex){
    jcmp.events.CallRemote('TTS_race_Freeze_player', this.players[this.ttsindex]);
    this.ttsindex++;
  }
  else{
    console.log("All the player have start");
  }

}























}
