jcmp.events.AddRemoteCallable('ChangeTrackedPlayer', function() {
  Addplayertotrack();
});
jcmp.events.AddRemoteCallable('AddSpectator', function() {
  jcmp.localPlayer.camera.attachedToPlayer = false;
  jcmp.localPlayer.frozen = true;
  spectate = true;
  Addplayertotrack();
  jcmp.ui.CallEvent('ShowSpectatorMode', true);

});

jcmp.events.AddRemoteCallable('RemoveSpectator', function() {
  jcmp.localPlayer.camera.attachedToPlayer = true;
  jcmp.localPlayer.frozen = false;
  jcmp.ui.CallEvent('ShowSpectatorMode', false);
  tracked_player = undefined;
  tracked_id = null;
  spectate = false;
  currentindex = 0;
});

function Addplayertotrack() {
  let playertotrack = null;
  for (var i = 0; i < jcmp.players.length; i++) {
    jcmp.events.CallRemote('race_debug', 'loop' + jcmp.players[i].name);
    if (jcmp.players[i].networkId != tracked_id && jcmp.players[i].networkId != jcmp.localPlayer.networkId) {
      playertotrack = jcmp.players[i];
      jcmp.events.CallRemote('race_debug', 'Player to track :  ' + playertotrack.name);
    }
  }



  if (playertotrack != null) {

    jcmp.ui.CallEvent('playeritrack', playertotrack.name);
    tracked_player = playertotrack;
    tracked_id = playertotrack.networkId;

  } else {

    tracked_player = null;
    tracked_id = null;
  }
}

function trackPlayer(renderer) { // to call on the GameUpdateRender
  if (typeof tracked_player != 'undefined' && tracked_player != null && spectate && !cameraview) {


    let p_pos = tracked_player.position;
    let p_rot = tracked_player.rotation;
    let offset = new Vector3f(1, 1.75, -5.5);
    to_pos = p_pos.add(vq(offset, jcmp.localPlayer.camera.rotation));
    to_rot = p_rot;
    jcmp.localPlayer.camera.rotation = tracked_player.rotation;
    jcmp.localPlayer.camera.position = to_pos;
  }
}
jcmp.events.AddRemoteCallable('AddSpectatorcm', function() {
  jcmp.localPlayer.camera.attachedToPlayer = false;
  jcmp.localPlayer.frozen = true;
  cameraview = true;
  jcmp.ui.CallEvent('ShowSpectatorCameraMode', true);
});
jcmp.events.AddRemoteCallable('CoordinateView', function(coordinate) {
  cm_pos = JSON.parse(coordinate);
  jcmp.ui.CallEvent('cameratrack', cm_pos.id);

});
jcmp.events.AddRemoteCallable('RemoveSpectatorcm', function() {
  jcmp.localPlayer.camera.attachedToPlayer = false;
  jcmp.localPlayer.frozen = true;
  cameraview = false;
  jcmp.ui.CallEvent('ShowSpectatorCameraMode', false);
});

function CameraView(renderer) {
  if (cameraview) {
    jcmp.localPlayer.camera.position = new Vector3f(cm_pos.x, cm_pos.y, cm_pos.z);
  }

}


jcmp.ui.AddEvent('Changingtrack', function() {
  if (spectate) {
    jcmp.events.CallRemote('SpectatorNextCam', player);
  }
  if (cameraview) {
    jcmp.events.CallRemote('CameraViewNextCam', player);
  }

});
