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
    .add(new Command('startrace').description('Start a race with id').parameter('id', 'number', 'index of the race').handler(function(player, id) {
      if (!race.utils.isAdmin(player)) {
        return race.chat.send(player, "[SERVER] You're not allowed to use this command");
      }
      jcmp.events.Call('race_start_index', id);
      race.chat.send(player, "[SERVER] Race Start");

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

    .add(new Command('spectator').description('Join a race as spectator').parameter('id', 'number', 'Dimension of the race').handler(function(player,id) {

      player.dimension = id;

      jcmp.events.CallRemote('Addplayertotrackfromserver',player);
      player.invulnerable = true;
    }))

    .add(new Command('removespectator').description('Join a race as spectator').handler(function(player) {

      player.dimension = 0;
      jcmp.events.CallRemote('RemoveSpectator',player);
      player.invulnerable = false;

    }));



  // Commands end ---
}
