module.exports = ({
  Command,
  manager
}) => {

  manager.category('player', 'commands for the race gamemode')




    .add(new Command('index').description('index').handler(function(player) {
      if (!race.utils.isAdmin(player)) {
        return race.chat.send(player, "[SERVER] You're not allowed to use this command");
      }
      let index = race.game.RaceList;
      for (var i = 0; i < index.length; i++) {
        race.chat.send(player, `[SERVER] Index: ${i} , Name of the race: ${index[i].Name}`);
      console.log(`Index: ${i} , Name of the race: ${index[i].Name}`);
      }


    }))

    .add(new Command('resetlist').description('Reset the race list folder to add a race without restart server').handler(function(player) {
      if (!race.utils.isAdmin(player)) {
        return race.chat.send(player, "[SERVER] You're not allowed to use this command");
      }
      race.game.RaceList = [];
      race.utils.GetRaceData();
      setTimeout(function() {
        jcmp.players.forEach(player => {
          jcmp.events.Call('Race_name_index', player);
        })

      }, 5000);

    }))
    .add(new Command('startrace').description('Start a race with id').parameter('id', 'number', 'index of the race').parameter('type', 'string', 'Type of the race: classic , multicrew  , apo , tts').handler(function(player, id, type) {
      if (!race.utils.isAdmin(player)) {
        return race.chat.send(player, "[SERVER] You're not allowed to use this command");
      }
    /*  if (race.game.lobbys["lobby" + player.race.lobbyid][0].networkId == player.networkId){ // only the guy that create the lobby (so is at id 0) can launch the race
        jcmp.events.Call('race_start_index',player, id, type);
        race.chat.send(player, "[SERVER] Race Start");
      }*/
      jcmp.events.Call('race_start_index',player, id, type);
      race.chat.send(player, "[SERVER] Race Start");

    }))
    .add(new Command('startracebeta').description('Start a race with id').handler(function(player) {
      if (!race.utils.isAdmin(player)) {
        return race.chat.send(player, "[SERVER] You're not allowed to use this command");
      }
    /*  if (race.game.lobbys["lobby" + player.race.lobbyid][0].networkId == player.networkId){ // only the guy that create the lobby (so is at id 0) can launch the race
        jcmp.events.Call('race_start_index',player, id, type);
        race.chat.send(player, "[SERVER] Race Start");
      }*/
      jcmp.events.Call('race_start_index_TEST',player);
      race.chat.send(player, "[SERVER] Race Start BETA");

    }))
    .add(new Command('gotolobby').description('tptolobby').handler(function(player) {
      if (player.race.ingame) {
        jcmp.events.Call('race_player_leave_game', player);
        race.chat.send(player, "[SERVER] TP you to the lobby");
      }
    }))

    .add(new Command('adminmenu').description('Open the race menu').handler(function(player) {
      if (!race.utils.isAdmin(player)) {
        return race.chat.send(player, "[SERVER] You're not allowed to use this command");
      }
      if (!player.race.ingame)
        jcmp.events.CallRemote('Open_admin_menu_client', player);
      race.chat.send(player, "[SERVER] Open the race menu");

    }))
    .add(new Command('TypeofRace').description('Explain all the type of race').handler(function(player) {
      if (!player.race.ingame)
      race.chat.send(player, "[SERVER] classic : Basic race");
      race.chat.send(player, "[SERVER] multicrew : 2 people in a car the driver don't see the checkpoint and the passager does");
      race.chat.send(player, "[SERVER] tts : everyone is released one at a time with a time difference, everyone just finishes the race as fast as possible without needing to worry about other people");

    }))
    .add(new Command('multicrewhelp').description('Explain all the type of race').handler(function(player) {
      if (!player.race.ingame)
      race.chat.send(player, "[SERVER] '/partner [nameofthepartner]' to request the partner");
      race.chat.send(player, "[SERVER] '/choicerole [nameofthedriver] to choice who is the driver (work only for the guy that made the request(considering as the leader of the group))");

    }))

    .add(new Command('votemenu').description('Open the vote menu to everyone').handler(function(player) {
      if (!race.utils.isAdmin(player)) {
        return race.chat.send(player, "[SERVER] You're not allowed to use this command");
      }
      if (!player.race.ingame)
        jcmp.events.CallRemote('Open_voting_menu_client', null, race.config.game.timervote);
      race.chat.send(player, "[SERVER] Open the vote menu");

    }))
    .add(new Command('reset').description('reset').handler(function(player) {

      player.health = 0;

      race.chat.send(player, "[SERVER] You were reset to the last checkpoint");

    }))

    .add(new Command('spectatortp').description('Join a race as spectator(trackingplayer)').parameter('id', 'number', 'Dimension of the race').handler(function(player,id) {
      if(player.race.ingame){
        return race.chat.send(player,`[SERVER] You are already on a game you can't spectate until you finish it`)
      }
       for (var i = 0; i  <race.game.games.length; i++) {
       if(race.game.games[i].id = id){
         player.dimension = id;
         player.race.playertotrack = race.game.games[i].players;
         let firstplayertotrack =  player.race.playertotrack[player.race.indextotrack].position;
          player.position = new Vector3f(firstplayertotrack.x -20 ,firstplayertotrack.y - 30 , firstplayertotrack.z +50);
          console.log(firstplayertotrack);
          player.invulnerable = true;
          player.race.spectate = true;
          setTimeout(function() {
             jcmp.events.CallRemote('AddSpectator',player);
          }, 5000);

       }

   }

    }))

    .add(new Command('removespectator').description('Join a race as spectator(trackingplayer)').handler(function(player) {
      player.race.indextotrack = 0;
      player.race.playertotrack = [];
      player.dimension = 0;
      player.race.spectate = false;
      player.race.camspectate = false;
      jcmp.events.CallRemote('RemoveSpectator',player);
      jcmp.events.CallRemote('RemoveSpectatorcm',player);
      player.invulnerable = false;

    }))

    .add(new Command('spectatorcm').description('Join a race as spectator(cameraview)').parameter('id', 'number', 'Dimension of the race').handler(function(player,id) {
      if(player.race.ingame){
        return race.chat.send(player,`[SERVER] You are already on a game you can't spectate until you finish it`)
      }
       for (var i = 0; i <race.game.games.length; i++) {
       if(race.game.games[i].id = id){
         player.dimension = id;
         player.race.cameras = race.game.games[i].cameraview;

         let firstcameratotrack =  race.game.games[i].cameraview[player.race.indextotrack];
          player.position = new Vector3f(firstcameratotrack.x ,firstcameratotrack.y +20 , firstcameratotrack.z);
          player.invulnerable = true;
          player.race.camspectate = true;
          jcmp.events.CallRemote('AddSpectatorcm',player);
          setTimeout(function() {
             jcmp.events.CallRemote('CoordinateView',player,JSON.stringify(firstcameratotrack));
          }, 5000);

       }

   }

 }))

 .add(new Command('partner').description('Send a request for became partner for MultiCrew').parameter('partner', 'string', 'Name of the player to request').handler(function(player,partner) {

 const res = race.utils.getPlayer(partner);
 if (res.length === 0 || res.length > 1) {
          race.chat.send(player, 'no / too many matching players!');
          return;
        }

if(res[0].race.partnerplayer.length != 0){
   race.chat.send(player,"The player you select already have a partner");
   return;
}
  race.chat.send(player,`Request send to the player ${res[0].name}`);
  jcmp.events.CallRemote('PartnerRequest',res[0],player.name,res[0].name);

 }))

 .add(new Command('choicerole').description('Choice who is the driver and passager').parameter('partner', 'string', 'Name of the player to put as driver').handler(function(player,partner) {
   if (player.race.partnerplayer.length == 0){
     race.chat.send(player,"You don't have a partner")
     return;
   }
   if (!player.race.leadpartner){
     race.chat.send(player,"You don't have the right to do this commands ask you're parner");
     return;
   }
   const res = race.utils.getPlayer(partner);
   if (res.length === 0 || res.length > 1) {
            race.chat.send(player, 'no / too many matching players!');
            return;
          }
          if (res[0].race.partnerplayer[0].name == res[0].name)
          {
            if (res[0].race.partnerplayer[0].race.driver)
            {
              console.log(`${res[0].race.partnerplayer[1].name} is the driver`);
              console.log("driver 1");
              res[0].race.partnerplayer[0].race.driver = true;
              res[0].race.partnerplayer[1].race.driver = false;
            }
            else{
                console.log(`${res[0].race.partnerplayer[0].name} is the driver`);
                console.log("driver 2");
              res[0].race.partnerplayer[1].race.driver = true;
              res[0].race.partnerplayer[0].race.driver = false;
            }
          }
          if (res[0].race.partnerplayer[1].name == res[0].name)
          {
            if (res[0].race.partnerplayer[1].race.driver)
            {
                console.log(`${res[0].race.partnerplayer[0].name} is the driver`);
                console.log("driver 3");
              res[0].race.partnerplayer[1].race.driver = true;
              res[0].race.partnerplayer[0].race.driver = false;
            }
            else{
                console.log(`${res[0].race.partnerplayer[1].name} is the driver`);
                console.log("driver4");
              res[0].race.partnerplayer[0].race.driver = true;
              res[0].race.partnerplayer[1].race.driver = false;
            }
          }




 }))




  // Commands end ---
}
