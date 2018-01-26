jcmp.events.AddRemoteCallable('race_checkpoint_client_Beta', function(data) {
  let DataR = JSON.parse(data)
  if (DataR.FirstCheckpoint != undefined){
    const poi = new POI(DataR.PoiType, new Vector3f(DataR.FirstCheckpoint.x, DataR.FirstCheckpoint.y, DataR.FirstCheckpoint.z));
    poi.minDistance = 10.0;
    poi.maxDistance = 100000.0;
    poi.clampedToScreen = false;
    poi.text = "Next Checkpoint";
    poi.id = DataR.FirstCheckpoint.id;
    poi.dimension = DataR.Dimension; //Race.id
    pois[DataR.FirstCheckpoint.id] = poi;
  }


  if (DataR.SecondCheckpoint != undefined) {
    const ghostpoi = new POI(24, new Vector3f(DataR.SecondCheckpoint.x, DataR.SecondCheckpoint.y, DataR.SecondCheckpoint.z));
    ghostpoi.minDistance = 10.0;
    ghostpoi.maxDistance = 100000.0;
    ghostpoi.clampedToScreen = false;
    ghostpoi.text = "";
    ghostpoi.id = DataR.SecondCheckpoint.id;
    ghostpoi.dimension = DataR.Dimension; //Race.id
    poisg[DataR.SecondCheckpoint.id] = ghostpoi;


  }

  // to show the checkpoint
  if(DataR.FirstCheckpoint != undefined){
    var checkpoint = new Checkpoint(DataR.CheckpointType, 0x342A687F, new Vector3f(DataR.FirstCheckpoint.x, DataR.FirstCheckpoint.y, DataR.FirstCheckpoint.z), new Vector3f(DataR.FirstCheckpoint.rotx, DataR.FirstCheckpoint.roty, DataR.FirstCheckpoint.rotz));
    checkpoint.radius = 15;
    checkpoint.visible = true;
    checkpoint.dimension = DataR.Dimension;
    checkpoint.id = DataR.FirstCheckpoint.id;
    checkpoint.sound = true;
    chks[DataR.FirstCheckpoint.id] = checkpoint;
  }






});

jcmp.events.Add('CheckpointEnter', checkpoint => {
  checkpoint.visible = false;
  deletePOI();
  chks.splice(checkpoint.id, 1);
  if (checkpoint.sound) {
  nextcheckpoint();
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
function nextcheckpoint(){

    jcmp.ui.CallEvent('Checkpoint_Sound');
    jcmp.events.CallRemote('race_checkpoint_Beta');



}


jcmp.events.AddRemoteCallable('Checkpoint_length_client', function(checkpointsmax) {
  jcmp.ui.CallEvent('Checkpointmax', checkpointsmax);
});

jcmp.events.AddRemoteCallable('Checkpoint_current_client', function(checkpointscurrent) {
  jcmp.ui.CallEvent('CheckpointCurrent', checkpointscurrent);
});
jcmp.events.AddRemoteCallable('CheckpointSoundDriver_client',function(){
    jcmp.ui.CallEvent('Checkpoint_Sound');
});
