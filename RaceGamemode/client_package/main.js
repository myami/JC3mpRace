'use strict';

var menuvehicle = new WebUIWindow("race menuvehicle", "package://race/ui/menuvehicle.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
menuvehicle.autoResize = true;
var deathUI = new WebUIWindow("race deathui", "package://race/ui/deathui.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
deathUI.autoResize = true;
deathUI.captureMouseInput = false;
var text = new WebUIWindow("race text", "package://race/ui/text.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
text.autoResize = true;

var vote = new WebUIWindow("race vote", "package://race/ui/vote.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
vote.autoResize = true;

var adminchoice = new WebUIWindow("race adminchoice", "package://race/ui/admin.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
adminchoice.autoResize = true;

var leaderboard = new WebUIWindow("race leaderboard", "package://race/ui/leaderboard.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
adminchoice.autoResize = true;


//POI
let pois = [];
let poisg = [];
//checkpoint
let chks = [];
let chksghost = [];
// player
let playeringame = false;
const playersCache = [];
//Spectator
let tracked_player = null;
let tracked_id = null;
let currentindex = 0;
let to_pos = new Vector3f(0, 0, 0);
let to_rot = new Vector3f(0, 0, 0);
let spectate = false;
let cameraview = false;
let cm_pos = new Vector3f(0, 0, 0);




function lerp(a, b, t) {
  return (a.add((b.sub(a)).mul(new Vector3f(t, t, t))));
}

function vq(v, q) {
  return vx(vy(v, q), q);
}

function vx(v, q) {
  return new Vector3f(v.x,
    v.y * Math.cos(q.x) + v.z * Math.sin(q.x),
    v.y * Math.sin(q.x) - v.z * Math.cos(q.x));
}

function vy(v, q) {
  return new Vector3f(v.x * Math.cos(q.y) + v.z * Math.sin(q.y),
    v.y, -v.x * Math.sin(q.y) + v.z * Math.cos(q.y));
}

function vz(v, q) {
  return new Vector3f(v.x * Math.cos(q.z) + v.y * Math.sin(q.z),
    v.x * Math.sin(q.z) - v.y * Math.cos(q.z),
    v.z);
}
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
    jcmp.localPlayer.camera.position = new Vector3f(cm_pos.x,cm_pos.y,cm_pos.z);
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

function createCache(id, name, colour) {

  playersCache[id] = {
    id: id,
    name: name,
    colour: colour,
    colour_rgb: hex2rgba(colour),
    flags: {
      isAdmin: false
    },
    nametag: {
      textMetric: null,
      textPos: null,
      shadowPos: null,
      iconPos: null,
      healthBarPos: null,
      healthBarBackPos: null,
      healthBarShadowPos: null
    }
  };

  return playersCache[id];

}

//
const up = new Vector3f(0, 1, 0);
const scaleFactor = new Vector3f(0.0001, 0.0001, 0.0001);
const minScale = new Vector3f(0.001, 0.001, 0.001);
const maxScale = new Vector3f(0.008, 0.008, 0.008);
const maxScaleGroup = new Vector3f(0.014, 0.014, 0.014);

// colours
const white = new RGBA(255, 255, 255, 255);
const black = new RGBA(0, 0, 0, 255);
const red = new RGBA(255, 0, 0, 255);
const darkred = new RGBA(40, 0, 0, 255);

// nametags
const nameTagTextSize = new Vector2f(100000, 1000000);
const healthBarSize = new Vector2f(394, 14);
const healthBarPos = new Vector3f(-(healthBarSize.x / 2), -277, 0);
const healthBarBackPos = new Vector3f(-(healthBarSize.x / 2), -277, 0.05);
const healthBarShadowSize = new Vector2f(400, 20);
const healthBarShadowPos = new Vector3f(-(healthBarShadowSize.x / 2), -280, 0.1);


// Nametags
function RenderNametag(renderer, playerCache, distance) {

  if (typeof playerCache !== 'undefined') {
    let distscale = (distance * 2.4);

    // build the name metric if needed
    if (playerCache.nametag.textMetric === null) {

      const metric = renderer.MeasureText(playerCache.name, 100, 'Arial');
      playerCache.nametag.textMetric = metric;
      playerCache.nametag.textPos = new Vector3f(-(metric.x / 2), -400, 0);
      playerCache.nametag.shadowPos = new Vector3f(-(metric.x / 2) + 5, -395, 1);
      playerCache.nametag.iconPos = new Vector3f(-(metric.x / 2) - 100, -363, 0);
      //playerCache.nametag.healthBarPos = new Vector3f(-(healthBarSize.x / 2), -277, 0);
      //playerCache.nametag.healthBarBackPos = new Vector3f(-(healthBarSize.x / 2), -277, 0.05);
      //playerCache.nametag.healthBarShadowPos = new Vector3f(-(healthBarShadowSize.x / 2), -280, 0.1);
    }

    if (distscale >= 350) {
      distscale = 350;
    }
    // adjust position based on distance
    playerCache.nametag.textPos.y = (-400 + distscale);
    playerCache.nametag.shadowPos.y = (-395 + distscale);
    playerCache.nametag.iconPos.y = (-363 + distscale);
    //playerCache.nametag.healthBarPos.y = (-277 + distscale);
    //playerCache.nametag.healthBarBackPos.y = (-277 + distscale);
    //playerCache.nametag.healthBarShadowPos.y = (-280 + distscale);

    // draw player name
    renderer.DrawText(playerCache.name, playerCache.nametag.textPos, nameTagTextSize, playerCache.colour_rgb, 100, 'Arial');
    renderer.DrawText(playerCache.name, playerCache.nametag.shadowPos, nameTagTextSize, black, 100, 'Arial');

    /*
    // draw admin icon
    if (playerCache.flags.isAdmin) {
        renderer.DrawTexture(admin_icon.texture, playerCache.nametag.iconPos);
    }*/

    // draw health bar
    //renderer.DrawRect(playerCache.nametag.healthBarPos, new Vector2f(healthBarSize.x * Math.max((player.health / player.maxHealth), 0), healthBarSize.y), red);
    //renderer.DrawRect(playerCache.nametag.healthBarBackPos, healthBarSize, darkred);
    //renderer.DrawRect(playerCache.nametag.healthBarShadowPos, healthBarShadowSize, black);
  }
}

function hex2rgba(colour) {
  colour = colour.replace('#', '');

  const r = parseInt(colour.substring(0, 2), 16);
  const g = parseInt(colour.substring(2, 4), 16);
  const b = parseInt(colour.substring(4, 6), 16);

  return new RGBA(r, g, b, 255);
}


function dist(start, end) {
  return end.sub(start).length;
}


function GetDistanceBetweenPoints(v1, v2) {
  let dx = v1.x - v2.x;
  let dy = v1.y - v2.y;
  let dz = v1.z - v2.z;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function GetDistanceBetweenPointsXY(v1, v2) {
  let v13f = new Vector3f(v1.x, v1.y, 0.0);
  let v14f = new Vector3f(v2.x, v2.y, 0.0);
  return GetDistanceBetweenPoints(v13f, v14f);
}

function IsPointInCircle(v1, v2, radius) {
  if (GetDistanceBetweenPointsXY(v1, v2) <= radius) return true;
  return false;
}



jcmp.events.AddRemoteCallable('race_deathui_show', function(killerName) {
  jcmp.ui.CallEvent('race_deathui_show', killerName);
});

jcmp.events.CallRemote('race_debug', 'DeathUI LOADED');

jcmp.events.AddRemoteCallable('Open_admin_menu_client', function() {
  jcmp.ui.CallEvent('Open_admin_menu');
});

jcmp.events.AddRemoteCallable('Open_voting_menu_client', function(time) {
  jcmp.ui.CallEvent('Open_vote_menu', time);
});

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
    //}
  });
  if (playeringame) {
    //race_check_poi();
  }
});

jcmp.events.AddRemoteCallable('Checkpoint_length_client', function(checkpointsmax) {
  jcmp.ui.CallEvent('Checkpointmax', checkpointsmax);
});

jcmp.events.AddRemoteCallable('Checkpoint_current_client', function(checkpointscurrent) {
  jcmp.ui.CallEvent('CheckpointCurrent', checkpointscurrent);
});

jcmp.events.AddRemoteCallable('race_ready', function(data) {

  data = JSON.parse(data);

  data.players.forEach(function(p) {
    jcmp.events.CallRemote('race_debug', 'Cached player with id' + p.id);
    createCache(p.id, p.name, p.colour)
  });



});


jcmp.events.AddRemoteCallable('Race_name_index_client_admin', function(index, namew, name) {
  jcmp.ui.CallEvent('Race_name_index_cef_admin', index, namew, name);
});

jcmp.events.AddRemoteCallable('Race_name_index_client_vote', function(index, namew, name) {
  jcmp.print("" + index + name);
  jcmp.ui.CallEvent('Race_name_index_cef_vote', index, namew, name);
});

jcmp.events.AddRemoteCallable('Race_name_vote_data', function() {
  jcmp.ui.CallEvent('Send_best_vote_index');
});

jcmp.ui.AddEvent('ResetPlayer_client', function() {
  jcmp.events.CallRemote('ResetPlayer_Server');
});
jcmp.ui.AddEvent('Race_send_index_cef', function(index) { // from the voting system
  jcmp.events.CallRemote('Race_index_received_vote', index);
});
jcmp.events.AddRemoteCallable('race_player_created', function(data) {

  data = JSON.parse(data);
  //const playerCache = createCache(data.id, data.name, data.colour);
  createCache(data.id, data.name, data.colour);
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


jcmp.events.AddRemoteCallable('race_vehicle_choice_menu', function(type) {


  // set the vehicle type : car,boats,helicopter,motorbike,airplanes
  //jcmp.ui.CallEvent('CreateMenu',type);

});



jcmp.events.AddRemoteCallable('race_vehicle_choice_menu_remove', function() {
  // delete the generated menu
  jcmp.ui.CallEvent('DeleteMenu');

});

jcmp.ui.AddEvent('HashVehicle_menu', function(hash) {
  jcmp.events.CallRemote('spawnVehicle', hash); // send the hash to the server
});

jcmp.ui.AddEvent('Race_Index_cef', function(index) {

  jcmp.events.CallRemote('Race_index_received_admin', index);
});

let wingsuitrace = false;
jcmp.events.AddRemoteCallable('race_checkpoint_client', function(checkpoint, dimension, typepoi, hashcheckpoint, typecheckpoint, ghostcheckpoint, wg) {
  let nextcheckpointDATA = JSON.parse(checkpoint);
  let ghostcheckpointDATA;
  if (ghostcheckpoint != undefined) {
    ghostcheckpointDATA = JSON.parse(ghostcheckpoint);
  }
  if (wg != undefined) {
    wingsuitrace = wg;
  }

  jcmp.print(" " + wingsuitrace);
  const poi = new POI(typepoi, new Vector3f(nextcheckpointDATA.x, nextcheckpointDATA.y, nextcheckpointDATA.z));
  poi.minDistance = 10.0;
  poi.maxDistance = 100000.0;
  poi.clampedToScreen = false;
  poi.text = "Next Checkpoint";
  poi.id = nextcheckpointDATA.id;
  poi.dimension = dimension; //Race.id
  pois[nextcheckpointDATA.id] = poi;

  if (ghostcheckpoint != undefined) {
    const ghostpoi = new POI(24, new Vector3f(ghostcheckpointDATA.x, ghostcheckpointDATA.y, ghostcheckpointDATA.z));
    ghostpoi.minDistance = 10.0;
    ghostpoi.maxDistance = 100000.0;
    ghostpoi.clampedToScreen = false;
    ghostpoi.text = "";
    ghostpoi.id = ghostcheckpointDATA.id;
    ghostpoi.dimension = dimension; //Race.id
    poisg[ghostcheckpointDATA.id] = ghostpoi;


  }

  // to show the checkpoint

  var checkpoint = new Checkpoint(typecheckpoint, 0x301477DB, new Vector3f(nextcheckpointDATA.x, nextcheckpointDATA.y, nextcheckpointDATA.z), new Vector3f(nextcheckpointDATA.rotx, nextcheckpointDATA.roty, nextcheckpointDATA.rotz));
  checkpoint.radius = 15;
  checkpoint.visible = true;
  checkpoint.dimension = dimension;
  checkpoint.id = nextcheckpointDATA.id;
  checkpoint.sound = true;
  chks[nextcheckpointDATA.id] = checkpoint;

  if (wingsuitrace == true) {
    var checkpointghost = new Checkpoint(1, 0x301477DB, new Vector3f(nextcheckpointDATA.x, nextcheckpointDATA.y, nextcheckpointDATA.z), new Vector3f(nextcheckpointDATA.rotx, nextcheckpointDATA.roty, nextcheckpointDATA.rotz));
    checkpointghost.radius = 15;
    checkpointghost.visible = true;
    checkpointghost.dimension = dimension;
    checkpointghost.id = nextcheckpointDATA.id;
    chksghost[checkpointghost.id] = checkpointghost;

  }


});

jcmp.events.Add('CheckpointEnter', checkpoint => {
  checkpoint.visible = false;
  deletePOI();
  chks.splice(checkpoint.id, 1);
  if (checkpoint.sound) {
    jcmp.ui.CallEvent('Checkpoint_Sound');
    jcmp.events.CallRemote('race_checkpoint');
  }
  checkpoint.Destroy();
  deleteCheckpoint();
});

function deletePOI() {
  pois.forEach(poi => {

    //   poi.Destroy();
    poi.visible = false;
    poi.minDistance = 999999;
    pois.splice(poi.id, 1);
    // poi.Destroy();
  })
  poisg.forEach(poi => {

    //   poi.Destroy();
    poi.visible = false;
    poi.minDistance = 999999;
    pois.splice(poi.id, 1);
    // poi.Destroy();
  })
}

function deleteCheckpoint() {
  chksghost.forEach(checkpoint => {

    checkpoint.visible = false;
    chks.splice(checkpoint.id, 1);
    checkpoint.Destroy();
  })
}

jcmp.events.AddRemoteCallable('race_end_point_client', function() {
  //jcmp.localPlayer.controlsEnabled = false;
  // make appear the leaderboard and button to spectator
  // the player is still ingame and wait the other to finish

});

jcmp.events.AddRemoteCallable('race_End_client', function() {
  // remove all the UI from the race and reset it
  playeringame = false;
  //jcmp.localPlayer.controlsEnabled = true;
  deletePOI();
  deleteCheckpoint();
  jcmp.ui.CallEvent('Race_Checkpoint_container', false);


});

jcmp.events.AddRemoteCallable('race_Start_client', function() {
  playeringame = true;
  jcmp.ui.CallEvent('Race_Checkpoint_container', true);
  jcmp.ui.CallEvent('Race_Timer_container', true);
  jcmp.ui.CallEvent('Countdown_start');
  //doing the countdown for the race to start
});
jcmp.events.AddRemoteCallable('race_Freeze_player', function() {
  jcmp.localPlayer.controlsEnabled = false;

});

jcmp.ui.AddEvent('race_countdown_end', function() {
  jcmp.localPlayer.controlsEnabled = true;
  //  jcmp.ui.CallEvent('Race_Timer_container',false);
  //Remove the countdown
  // start the timer global for the player
  jcmp.events.CallRemote('Race_player_timer_start');

});
jcmp.ui.AddEvent('AddPlayerLeaderboard', function() {
  jcmp.events.CallRemote('AddPlayerLeaderboard');
})

jcmp.ui.AddEvent('Update_All_Client', function(name, value) {
  jcmp.events.CallRemote('Update_All_Client_server', name, value);
});

jcmp.events.AddRemoteCallable('Update_All_Client_toeveryone', function(name, value) {
  jcmp.ui.CallEvent('UpdateUIforvote', name, value);
});
jcmp.events.AddRemoteCallable('Player_data_Announce', (leaderboardplace, time) => {
  jcmp.ui.CallEvent('Race_rank_container', leaderboardplace, time);
});
jcmp.events.AddRemoteCallable('race_set_time', (hour, minute) => {
  jcmp.world.SetTime(hour, minute, 0);
});

jcmp.events.AddRemoteCallable('race_set_weather', weather => {
  jcmp.world.weather = weather;
});


jcmp.events.AddRemoteCallable('Update_leaderboard_all', function(playername, leaderboardplace, minutes, seconds) {
  jcmp.ui.CallEvent('Leaderboard_update_end', playername, leaderboardplace, minutes, seconds);
});

jcmp.events.AddRemoteCallable('Remove_Leaderboard_name', function() {
  jcmp.ui.CallEvent('Leaderboard_remove_all');
})

jcmp.events.AddRemoteCallable('Add_Player_On_Leaderboard', function(playername) {
  jcmp.ui.CallEvent('AddPlayerOnLeaderboard', playername);
})
