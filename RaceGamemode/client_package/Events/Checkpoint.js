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


jcmp.events.AddRemoteCallable('Checkpoint_length_client', function(checkpointsmax) {
  jcmp.ui.CallEvent('Checkpointmax', checkpointsmax);
});

jcmp.events.AddRemoteCallable('Checkpoint_current_client', function(checkpointscurrent) {
  jcmp.ui.CallEvent('CheckpointCurrent', checkpointscurrent);
});
