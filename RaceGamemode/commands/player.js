module.exports = ({
  Command,
  manager
}) => {

  manager.category('player', 'commands for the race gamemode')




    .add(new Command('gotolobby').description('tptolobby').handler(function(player) {
      if (player.race.ingame) {
        jcmp.events.Call('race_player_leave_game', player);
        race.chat.send(player, "[SERVER] TP you to the lobby");
      }
    }))



    .add(new Command('reset').description('reset').handler(function(player) {
      player.health = 0;
      race.chat.send(player, "[SERVER] You were reset to the last checkpoint");
    }))

    .add(new Command('resetUI').description('reset the UI').handler(function(player) {
      jcmp.events.CallRemote('Race_Reset_UI_Lobby',player);
      race.chat.send(player, "[SERVER] UI RESET");
    }));




  /*  .add(new Command('spectatortp').description('Join a race as spectator(trackingplayer)').parameter('id', 'number', 'Dimension of the race').handler(function(player,id) {
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
*/




  // Commands end ---
}
