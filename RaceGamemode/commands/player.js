module.exports = ({
  Command,
  manager
}) => {

  manager.category('player', 'commands for the race gamemode')




    .add(new Command('gotolobby').description('Make you leave the race').handler(function(player) {
      if (player.race.ingame) {
        jcmp.events.Call('race_player_leave_game', player);
        race.chat.send(player, "[SERVER] TP you to the lobby");
      }
    }))

    .add(new Command('JoinRacePackage').description('Join The Gamemode Race').handler(function(player) {
      jcmp.events.CallRemote('ShowRaceMenu',player,true);
        jcmp.events.CallRemote('PlayerCameraHome',player);
    }))

    .add(new Command('LeaveRacePackage').description('Leave The Gamemode Race').handler(function(player) {
      jcmp.events.CallRemote('ShowRaceMenu',player,false);
    }))



    .add(new Command('reset').description('Reset to the last checkpoint').handler(function(player) {
      if (player.race.ingame) {
      jcmp.events.Call('race_player_checkpoint_respawn', player);
      race.chat.send(player, "[SERVER] You were reset to the last checkpoint");
    }
    }));







  // Commands end ---
}
