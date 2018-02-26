jcmp.events.AddRemoteCallable('race_set_time', function(hour, minute,seconds) {
  jcmp.world.SetTime(hour, minute,seconds);
});

jcmp.events.AddRemoteCallable('race_set_weather', function(weather) {
  jcmp.world.weather = weather;
});
jcmp.events.AddRemoteCallable('race_End_client', function() {
  // remove all the UI from the race and reset it
  playeringame = false;
  //jcmp.localPlayer.controlsEnabled = true;
  deletePOI();
  deleteCheckpoint();
  jcmp.ui.CallEvent('Race_Checkpoint_container', false);
  jcmp.ui.CallEvent('RaceFinishShowLobby');


});

jcmp.events.AddRemoteCallable('race_Start_client', function(type) {
  playeringame = true;
  typeofrace = type;
  jcmp.ui.CallEvent('Race_Checkpoint_container', true);
  jcmp.ui.CallEvent('Race_Start');

});
jcmp.events.AddRemoteCallable('race_Freeze_player', function() {
 jcmp.localPlayer.controlsEnabled = false;
  countdowninprogress = true;
  jcmp.ui.CallEvent('IsTTS',false);
  jcmp.ui.CallEvent('Countdown_start');


  //doing the countdown for the race to start
//    jcmp.events.CallRemote('race_debug', "RaceFreezeClassic");

});

jcmp.ui.AddEvent('race_countdown_end', function() {
  jcmp.localPlayer.controlsEnabled = true;
  countdowninprogress = false; // no respawn during countdown
  //jcmp.events.CallRemote('race_debug', "CountdownEND");

});

jcmp.ui.AddEvent('ResetPlayer_client', function() {
  if (countdowninprogress) {
    return;
  }
  jcmp.events.CallRemote('ResetPlayer_Server');
});

/*
jcmp.events.AddRemoteCallable('WarningBarrel',function(){
  jcmp.ui.CallEvent('WarningBarrel_CEF');
});*/


jcmp.events.AddRemoteCallable('End_Timer',function(){
jcmp.ui.CallEvent('Stop_Timer');

});

jcmp.ui.AddEvent('Timer_Client',function(time){
jcmp.events.CallRemote('Timer_Server_Beta',time);
});
