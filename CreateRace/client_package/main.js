
'use strict';

var CreateRace = new WebUIWindow("race CreateRace", "package://createrace/ui/index.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
CreateRace.autoResize = true;
let pois = [];
let chks = [];
jcmp.events.AddRemoteCallable('ShowMenuServer',function(){
  jcmp.ui.CallEvent('ShowMenu');
});

jcmp.events.AddRemoteCallable('HideMenuServer',function(){
  jcmp.ui.CallEvent('HideMenu');
});

jcmp.events.AddRemoteCallable('ResetUI',function(){
  CreateRace.Reload(true);
});




let poiid = 0;
jcmp.events.AddRemoteCallable('Creating_POI_startingPoint',function(position){
  let positionspoi = JSON.parse(position);
  const poi = new POI(10,new Vector3f(positionspoi.x,positionspoi.y,positionspoi.z));
     poi.minDistance = 10.0;
     poi.maxDistance = 100000.0;
     poi.clampedToScreen = false;
     poi.text = "StartingPoint";
     poi.id = poiid;
     pois[poi.id] = poi ;
     poiid ++;
});

jcmp.ui.AddEvent('DeletePOI',function(){
  pois.forEach(poi => {

          //   poi.Destroy();
          poi.visible = false;
          poi.minDistance = 999999;

  })
});
jcmp.events.AddRemoteCallable('Creating_checkpoint',function(position,rotation,id){
  let positionspoi = JSON.parse(position);
  let rotationcheckpoint = JSON.parse(rotation);
  var checkpoint = new Checkpoint(1, 0x301477DB, new Vector3f(positionspoi.x,positionspoi.y,positionspoi.z),new Vector3f(rotationcheckpoint.x,rotationcheckpoint.y,rotationcheckpoint.z));
      checkpoint.radius = 15;
      checkpoint.visible = true;
      checkpoint.id = id;
      chks[id] = checkpoint;

});
jcmp.ui.AddEvent('DeleteCheckpoint',function(){
  chks.forEach(checkpoint => {
          checkpoint.visible = false;
          checkpoint.Destroy();
          chks.splice(checkpoint.id,1);
  })
})



















///////////////////////////////////////         event communication cef-client-server ///////////////////////////////

jcmp.ui.AddEvent('Create_race_name_button',function(name){
jcmp.events.CallRemote('CreateJsonFile_server',name);
});

jcmp.ui.AddEvent('race_name',function(names,name){
jcmp.events.CallRemote('Addname_server',names,name);
});

jcmp.ui.AddEvent('Add_Vehicle_type',function(vehicle,name){
jcmp.events.CallRemote('Add_vehicle_type_server',vehicle,name);
});

jcmp.ui.AddEvent('Add_Minute_second',function(hours,minute,name){
jcmp.events.CallRemote('Add_Minute_seconds_server',hours,minute,name);
});

jcmp.ui.AddEvent('Add_Weather',function(weather,name){
jcmp.events.CallRemote('Add_Weather_server',weather,name);
});

jcmp.ui.AddEvent('Add_vehicle_hash',function(hash,name){
jcmp.events.CallRemote('Add_vehicle_hash_server',hash,name);
});

jcmp.ui.AddEvent('Add_Yatrespawn',function(yatrespawn,name){
jcmp.events.CallRemote('Add_Yatrespawn_server',yatrespawn,name);
});

jcmp.ui.AddEvent('Add_CheckpointHash',function(checkpointhash,name){
jcmp.events.CallRemote('Add_CheckpointHash_server',checkpointhash,name);
});

jcmp.ui.AddEvent('Add_CheckpointType',function(checkpointtype,name){
jcmp.events.CallRemote('Add_CheckpointType_server',checkpointtype,name);
});

jcmp.ui.AddEvent('Add_PoiType',function(poitype,name){
jcmp.events.CallRemote('Add_PoiType_server',poitype,name);
});

jcmp.ui.AddEvent('Add_GhostPoiType',function(ghostpoitype,name){
jcmp.events.CallRemote('Add_GhostPoiType_server',ghostpoitype,name);
});

jcmp.ui.AddEvent('Add_NitroChange',function(nitro,name){
jcmp.events.CallRemote('Add_NitroChange_server',nitro,name);
});

jcmp.ui.AddEvent('Add_MaxPlayer',function(maxplayer,name){
jcmp.events.CallRemote('Add_MaxPlayer_server',maxplayer,name);
});

jcmp.ui.AddEvent('CreateStartingPoint',function(name){
jcmp.events.CallRemote('CreateStartingPoint_server',name);
});

jcmp.ui.AddEvent('CreateCheckpoint',function(name){
jcmp.events.CallRemote('CreateCheckpoint_server',name);
});
