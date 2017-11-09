jcmp.events.AddRemoteCallable('race_ready', function(data) {

  data = JSON.parse(data);

  data.players.forEach(function(p) {
  //  jcmp.events.CallRemote('race_debug', 'Cached player with id' + p.id);
    createCache(p.id, p.name, p.colour)
  });



});

jcmp.events.AddRemoteCallable('race_player_created', function(data) {

  data = JSON.parse(data);
  //const playerCache = createCache(data.id, data.name, data.colour);
  createCache(data.id, data.name, data.colour,data.isAdmin);
});


jcmp.events.AddRemoteCallable('race_player_destroyed', function(networkId) {

  if (playersCache[networkId] !== null) {
    delete playersCache[networkId];
  }
});

jcmp.events.AddRemoteCallable('race_cachelist', function() {
  jcmp.events.CallRemote('race_debug', JSON.stringify(playersCache));
});

jcmp.events.CallRemote('race_clientside_ready');

jcmp.events.AddRemoteCallable('race_deathui_show', function(killerName) {
  jcmp.ui.CallEvent('race_deathui_show', killerName);
});

jcmp.events.CallRemote('race_debug', 'DeathUI LOADED');
