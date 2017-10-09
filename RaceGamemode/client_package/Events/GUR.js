jcmp.events.Add("GameUpdateRender", function(renderer) {

  const cam = jcmp.localPlayer.camera.position;
  trackPlayer(renderer);
  CameraView(renderer);
  jcmp.players.forEach(player => {
    //if (!player.localPlayer) {
    const playerCache = playersCache[player.networkId];
    if (typeof playerCache !== 'undefined') {
      let head = player.GetBoneTransform(0xA877D9CC, renderer.dtf);

      const d = dist(head.position, cam);
      let scale = new Vector3f(d, d, d).mul(scaleFactor);
      if (scale.x >= maxScaleGroup.x) {
        scale = maxScaleGroup;
      } else if (scale.x <= minScale.x) {
        scale = minScale;
      }

      const mat = head.LookAt(head.position, cam, up).Scale(scale);
      renderer.SetTransform(mat);
      if (!spectate) {
        RenderNametag(renderer, playerCache, d);
      }

    }

  });

});
