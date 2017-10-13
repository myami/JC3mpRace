jcmp.events.Add('AppoBarrelSpawnAroundPlayer',function(players){
    for (var i = 0; i < players.length; i++) {
      const player = players[i];
      for (var g = 0; g < 5; g++){ // 5 limit of barrel spawn around the player
        let gameobjectposition = race.utils.randomSpawn(player.position,50);
        var object = new GameObject('glowstick_yellow',gameobjectposition);
        object.ApplyForce(new Vector3f(0, 30, 0), 1); // gameobject fly a little and then fall around the player
      }
    }

});
