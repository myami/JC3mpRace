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
    playertotrack: [],
    indextotrack: 0,
    spectate: false,
    cameras: [],
    camspectate: false,
    partnerplayer: [] ,// for multicrew save team in the array
    leadpartner : false,
    driver:false,
    lobbyid: undefined,
    ready: false,
    typeselect: undefined, // int
    raceselect: undefined // int

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
  jcmp.events.CallRemote('Add_Player_On_Lobby',null,player.name);

});


jcmp.events.Add('PlayerReady', function(player) {


  player.respawnPosition = new Vector3f(-1330, 1035, 14827);
  player.Respawn();



  setTimeout(function() {

      const data = {
        players: jcmp.players.map(p => ({
          id: p.networkId,
          name: p.escapedNametagName,
          colour: p.race.colour
        }))
      };
  /*    const lobbylist = {
          lobby: Object.keys(race.game.lobbys).map((key, index) => {
              const l = race.game.lobbys[key];
              return {
                  id: index,
                  PlayerCreated: l[0].escapedNametagName,
                  numberofplayer: l.length
              }
          })
      };*/

        console.log(data);
        console.log(lobbylist);

      jcmp.events.CallRemote('race_ready', player, JSON.stringify(data));
  //    jcmp.events.CallRemote('Lobby_ready',player,JSON.stringify(data));
  //    jcmp.events.CallRemote('Lobby_List',player,JSON.stringify(lobbylist));
    jcmp.events.Call('PlayerJoinServer',player);


    jcmp.events.Call('Race_name_index', player);

    jcmp.events.CallRemote('Lobby_Update_state',null,player.name,JSON.stringify('LobbySelectMenu'));
    jcmp.events.CallRemote('Lobby_show',player,true);

  }, 3000);




});

jcmp.events.Add('PlayerDeath', function(player, killer, reason) {

  if (player.race.ingame) {
    jcmp.events.Call('race_player_checkpoint_respawn', player);

  }


  if (!player.race.ingame) {
    let killerName = 'Environment';
    if (killer != null) {
      killerName = killer.escapedNametagName;
    }
    console.log("NotIngame");

    jcmp.events.CallRemote('race_deathui_show', player, killerName);

    race.chat.send(player, "Respawning in 5 seconds ...")

    const done = race.workarounds.watchPlayer(player, setTimeout(() => {
      done();
      // NOTE: The death UI hides automatically
      console.log("Respawning playerdie");

      player.Respawn();
    }, 5000));
  }


});


jcmp.events.Add('PlayerVehicleExited', (player, vehicle, seatIndex) => {
  const Race = player.race.game;
  if (player.race.ingame) {
    jcmp.events.Call('race_player_checkpoint_respawn', player, vehicle);
  }

});
