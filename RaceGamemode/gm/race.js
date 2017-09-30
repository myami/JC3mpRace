'use strict';

module.exports = class Race {
  constructor(id, VehicleType, player, NumberofPlayer, StartingPoint, RaceCheckpoint, times, weatherr, defaultvehicle, alldefaultvehicle, addingyatspawn, checkpointhash, checkpointtype, poitype, nitrobool, ghostpoi) {
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
  }

  Start() {
    console.log("Id of the race: " + this.id);

    //TODO: Choice menu for 20 sec to choice the vehicle (settimeout)

    // alldefaultvehicle if it's true all have the same vehicle (the default) if it's false show the vehicle menu
    // if player don't take vehicle on the list before it's dissapear use the this.defaultvehicle hash

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


      if (player.race.vehicle == 0){
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
            vehicle.dimension = player.race.game.id;
            vehicle.SetOccupant(0, player);
            vehicle.nitroEnabled = this.nitro;
          }

        }, 4000);

      } else {
        //  jcmp.events.CallRemote('race_vehicle_choice_menu',player);
      }
      let firstcheckpoint = this.raceCheckpoint[player.race.checkpoints];
      let ghostcheckpoint = this.raceCheckpoint[player.race.checkpoints + 1];
        if (this.wingsuitrace) {
          jcmp.events.CallRemote('race_checkpoint_client', player, JSON.stringify(firstcheckpoint), this.id, this.PoiType, this.checkpointhash, this.ChekpointType, JSON.stringify(ghostcheckpoint),true);

        }
        else{
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




}
