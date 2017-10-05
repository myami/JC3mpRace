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


  }

  Start() {
    console.log("Id of the race: " + this.id);

    if (this.type == undefined || this.type == "classic") {
      console.log("ClassicRace!!!");
      this.ClassicRace();
    } else if (this.type == "multicrew") {
      console.log("Multicrew!!!");
      this.Multicrew();
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
    }

  }

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

      jcmp.events.CallRemote('race_Freeze_player', player);
      jcmp.events.CallRemote('race_set_time', player, this.time.hour, this.time.minute);
      jcmp.events.CallRemote('race_set_weather', player, this.weather);
      //spawning the first checkpoint

      jcmp.events.CallRemote('Checkpoint_length_client', player, this.raceCheckpoint.length);
      jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
      jcmp.events.CallRemote('race_Start_client', player);



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
      this.playersname.push(player.name);
      if (i % 2 === 0) {
        player.race.partnerplayer.push(player);
        player.race.partnerplayer.push(this.players[i + 1]);
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

      jcmp.events.CallRemote('race_checkpoint_client', player, JSON.stringify(firstcheckpoint), this.id, this.PoiType, this.checkpointhash, this.ChekpointType, JSON.stringify(ghostcheckpoint));
      jcmp.events.CallRemote('race_Freeze_player', player);
      jcmp.events.CallRemote('race_set_time', player, this.time.hour, this.time.minute);
      jcmp.events.CallRemote('race_set_weather', player, this.weather);
      //spawning the first checkpoint

      jcmp.events.CallRemote('Checkpoint_length_client', player, this.raceCheckpoint.length);
      jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
      jcmp.events.CallRemote('race_Start_client', player);



    }

    setInterval(function() {
      MCChangPlayerDrive();
    }, this.mctime);
  }

  MCChangPlayerDrive() {
    for (var i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      if (player.race.partnerplayer[1] == player) {
        return;
        console.log("The player is the second guy in the team");
      }
      if (player.vehicle.GetOccupant(0) == player) {
        player.vehicle.SetOccupant(1, player);
        player.vehicle.SetOccupant(0, player.race.partnerplayer[1]);
        console.log("First option the player is the driver and became passager");

      }
      if (player.vehicle.GetOccupant(1) == player) {
        player.vehicle.SetOccupant(0, player);
        player.vehicle.SetOccupant(1, player.race.partnerplayer[1]);
        console.log("Second option the player is the passager and became driver");
      }

    }
  }

  MCVehicleReset(player) {
    if (player.race.partnerplayer[0].name == player.name) {
      const vehicle = new Vehicle(player.race.vehicle, player.position, rotation);
      vehicle.nitroEnabled = this.nitro;
      vehicle.dimension = player.race.game.id;
      vehicle.SetOccupant(0, player);
      vehicle.SetOccupant(1, player.race.partnerplayer[1]);
    } else if (player.race.partnerplayer[1].name == player.name) {
      console.log("wait the vehicle will spawn on you're team mate and you will be tp inside ");
    }
  }

}
