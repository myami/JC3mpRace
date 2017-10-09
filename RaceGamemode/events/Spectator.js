jcmp.events.AddRemoteCallable('SpectatorNextCam', function(player) {
  if (player.race.indextotrack != player.race.playertotrack.length) {
    player.race.indextotrack++;
  } else {
    player.race.indextotrack = 0;
  }
  let nextplayertotrack = player.race.playertotrack[player.race.indextotrack].position;
  player.position = new Vector3f(nextplayertotrack.x, nextplayertotrack.y + 40, nextplayertotrack.z);
  setTimeout(function() {
    jcmp.events.CallRemote('ChangeTrackedPlayer', player);
  }, 5000);
});

jcmp.events.Add('SpectatorTPtoTracker', function() {
  for (var i = 0; i < jcmp.players.length; i++) {
    const player = jcmp.players[i];
    if (player.race.spectate) {
      let playertotrack = player.race.playertotrack[player.race.indextotrack].position;
      player.position = new Vector3f(playertotrack.x, playertotrack.y + 40, playertotrack.z);
    }

  }
});

jcmp.events.AddRemoteCallable('CameraViewNextCam', function(player) {
  if (player.race.indextotrack != player.race.cameras.length) {
    player.race.indextotrack++;
  } else {
    player.race.indextotrack = 0;
  }
  let nextcamtotrack = player.race.cameras[player.race.indextotrack];
  player.position = new Vector3f(nextcamtotrack.x, nextcamtotrack.y + 20, nextcamtotrack.z);
  setTimeout(function() {
    jcmp.events.CallRemote('CoordinateView', player, JSON.stringify(nextcamtotrack));
  }, 3000);
});
