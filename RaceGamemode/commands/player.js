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







  // Commands end ---
}
