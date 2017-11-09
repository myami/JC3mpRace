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

    if (this.type == "classic") {
      console.log("ClassicRace!!!");
      this.ClassicRace();
      return;
    }  if (this.type == "multicrew") {
      console.log("Multicrew!!!");
      this.Multicrew();
      return;
    }  if (this.type == "apo") {
      console.log("APOCALYPSE NOW!!!");
      this.ClassicRace();
      setTimeout(function() {
        this.apoStart();
      }, 30000);
      return;
    }
     if (this.type == "tts"){
      console.log("TTS !!!!!!!!");
      this.TTSStart();
      return;
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
      jcmp.events.CallRemote('LobbyStatus_Server',player,false);
      jcmp.events.CallRemote('Lobby_Update_state_Server',null,player.name,JSON.stringify("Ingame"));

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
      jcmp.events.CallRemote('LobbyStatus_Server',player,false);
      jcmp.events.CallRemote('Lobby_Update_state_Server',null,player.name,JSON.stringify("Ingame"));
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
        if (player.race.partnerplayer[0] == player) {
          if (player.race.driver){
            const secondplayer = player.race.partnerplayer[1];
            jcmp.events.CallRemote('PlayerPassager', secondplayer, true);
            jcmp.events.CallRemote('PlayerPassager', player, false);
            this.playersname.push(player.name + " " + secondplayer.name);
            jcmp.events.CallRemote('ShowPassagerUI', secondplayer);
          }
          else{
            const secondplayer = player.race.partnerplayer[1];
            jcmp.events.CallRemote('PlayerPassager', player, true);
            jcmp.events.CallRemote('PlayerPassager', secondplayer, false);
            this.playersname.push(player.name + " " + secondplayer.name);
            jcmp.events.CallRemote('ShowPassagerUI', player);
          }



        }
        if (player.race.partnerplayer[0] == undefined){
          console.log("Someone didnt have a team");
        }



      if (this.alldefaultvehicle) { // need to replace all this if to not spawn a vehicle per player but a vehicle per team
        player.race.vehicle = this.defaultvehicle;

        setTimeout(function() {
          if (player.race.vehicle != 0 && player.race.partnerplayer[0].name == player.name) {
            const vehicle = new Vehicle(player.race.vehicle, player.position, rotation);
            vehicle.nitroEnabled = this.nitro;
            vehicle.dimension = player.race.game.id;
            if (player.race.driver){
              vehicle.SetOccupant(0, player);
              vehicle.SetOccupant(1, player.race.partnerplayer[1]);
            }
            else{
              vehicle.SetOccupant(1, player);
              vehicle.SetOccupant(0, player.race.partnerplayer[1]);
            }


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


  }




  MCVehicleReset(player, vehicleold) {
    let driver;
    let passager;

    for (var i = 0; i < player.race.partnerplayer.length; i++) {
      if (player.race.partnerplayer[i].race.driver){
        driver = player.race.partnerplayer[i];

        console.log(`Driver is ${driver.name}`);
        if (player.networkId == driver.networkId){
          if (vehicleold != undefined) {
            vehicleold.Destroy();
          }
          const vehicle = new Vehicle(player.race.vehicle, player.position, player.race.playerrotationspawn);
          vehicle.nitroEnabled = this.nitro;
          vehicle.dimension = player.race.game.id;
          vehicle.SetOccupant(0, driver);
          vehicle.SetOccupant(1, passager);
          console.log("Driver");
          return;
        }
      }
      if (!player.race.partnerplayer[i].race.driver){
        passager = player.race.partnerplayer[i];
        console.log(`Passager is ${passager.name}`);
        if (player.networkId == passager.networkId){
          driver.vehicle.SetOccupant(1, player);
          console.log("Passager");
          return;
        }
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




//////////////////////////////TTS//////////////////////////////////

TTSStart() {
  console.log("TTSStart");
  for (var i = 0; i < this.players.length; i++) {
    const player = this.players[i];
    jcmp.events.CallRemote('LobbyStatus_Server',player,false);
    jcmp.events.CallRemote('Lobby_Update_state_Server',null,player.name,JSON.stringify("Ingame"));
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

  console.log(`${this.players.length} player length and ${this.ttsindex}`);
  if (this.players.length > this.ttsindex){
    console.log(`tts unfreeze player `);
  jcmp.events.CallRemote('TTS_race_Freeze_player', this.players[this.ttsindex]);
  race.chat.broadcast(`${this.players[this.ttsindex].name} it's you're turn to start`)
    console.log(this.ttsindex + "ttsunfreezeplayer : " + this.players[this.ttsindex].name);
    this.ttsindex++;
  }
  else{
    console.log("All the player have start");
  }

}

TTSUpdateEndLeaderboard(playername, minute, seconds) {
  for (let player of this.players) {
    jcmp.events.CallRemote('Update_leaderboard_all_TTS', player, playername, minute, seconds);
    // Don't update on people that have finish the race before you maybe because they are remove from the Race constructor
  }

}























}
