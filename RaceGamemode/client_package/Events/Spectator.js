

jcmp.events.AddRemoteCallable('PlayerCameraHome',function(){
PlayerCameraHomeCEF();
});

function PlayerCameraHomeCEF (){
  jcmp.localPlayer.camera.attachedToPlayer = false;
  jcmp.localPlayer.frozen = true;
  jcmp.localPlayer.camera.rotation = new Vector3f(0,0,0);
  jcmp.localPlayer.camera.position = new Vector3f(-13196,1126,14827); // player body need to be close but not in the fov or will have issue when joining the race close to the camera position
}
