jcmp.events.Add("PlayerCreated", function(player) {

  player.escapedNametagName = player.name.replace(/</g, '&lt;').replace(/>/g, '&gt;').substring(0, 40);
  console.log(`${player.escapedNametagName} has joined.`);

  var color = race.utils.randomColor();
  player.race = {
    ingame: false,
    isAdmin:false,
    colour: color,
    colour_rgb: race.utils.hexToRGB(color),
    warning: false,
    timers: [], // Daranix's workaround version
    checkpoints: 0, // index of the checkpoint of the player
    vehicle: "", // save the vehicle model to spawn an other when he die during the race
    hasfinish: false,
    time: 0,
    spawningdouble: false,
    playerrotationspawn: new Vector3f(0, 0, 0),
    lobbyid: undefined,
    ready: false,
    typeselect: undefined, // int
    raceselect: undefined, // int
    path: undefined,
    arraycheckpoint:[]

  }
  if (race.utils.isAdmin(player)) {
    player.race.isAdmin = true;
    }

  var dsend = {
    id: player.networkId,
    name: player.escapedNametagName,
    colour: player.race.colour,
    isAdmin: player.race.isAdmin
  };

  jcmp.events.CallRemote('race_player_created', null, JSON.stringify(dsend));

});

jcmp.events.Add('PlayerDestroyed', function(player) {

  console.log(`${player.escapedNametagName} has left.`);

  // Daranix's workaround clearinterval / timer

  if (player.race.timers.length >= 1) {
    for (let timer in player.race.timers) {
      console.log(timer);
    }
  }
  jcmp.events.CallRemote('Lobby_remove_player', null, player.name);
  jcmp.events.CallRemote('race_player_destroyed', null, player.networkId);
  jcmp.events.Call('DeletePlayerOnTheserver',player);

  if (player.race.ingame) {
    jcmp.events.Call('race_player_leave_game', player, true);
  } else {
    race.game.players.onlobby.removePlayer(player);

  }

});

jcmp.events.AddRemoteCallable('race_debug', function(player, text) {
  console.log(text);
});

jcmp.events.AddRemoteCallable('race_clientside_ready', function(player) {




});


jcmp.events.Add('PlayerReady', function(player) {

player.respawnPosition = new Vector3f(-13196,1326,14827);

  player.Respawn();



  setTimeout(function() {

      const data = {
        players: jcmp.players.map(p => ({
          id: p.networkId,
          name: p.escapedNametagName,
          colour: p.race.colour
        }))
      };

      for (let i = 0; i < race.game.lobbys.length; i++) {

        let lobby = race.game.lobbys[i];

            let lobbytosendtoclient = {
              LobbyName: lobby.LobbyName,
              NumberofPlayer: lobby.NumberofPlayer,
              MapName: lobby.MapName,
              TypeRace: lobby.TypeRace,
              LobbyID: lobby.LobbyID,
              RaceID: lobby.RaceID,
              PlayerCreated: lobby.PlayerCreated,
              PlayerListName: lobby.PlayerListName
            }
          jcmp.events.CallRemote('Client/LobbyCreated', player, JSON.stringify(lobbytosendtoclient));
      }





      jcmp.events.CallRemote('race_ready', player, JSON.stringify(data));
      jcmp.events.Call('PlayerJoinServer',player);
      jcmp.events.CallRemote('PlayerMeLobby',player,player.name);

      jcmp.events.CallRemote('PlayerCameraHome',player);


}, 4000);




});

jcmp.events.Add('PlayerDeath', function(player, killer, reason) {

  if (player.race.ingame) {
    jcmp.events.Call('race_player_checkpoint_respawn', player);
      jcmp.events.CallRemote('race_deathui_show', player);
    return;

  }





    race.chat.send(player, "Respawning in 5 seconds ...")

    const done = race.workarounds.watchPlayer(player, setTimeout(() => {
      done();
      // NOTE: The death UI hides automatically
      console.log("Respawning playerdie");

      player.Respawn();
    }, 5000));
  }


);


jcmp.events.Add('PlayerVehicleExited', (player, vehicle, seatIndex) => {
  const Race = player.race.game;
  if (player.race.ingame) {
    jcmp.events.Call('race_player_checkpoint_respawn', player, vehicle);
  }

});
