jcmp.events.AddRemoteCallable('race_set_time', function(hour, minute) {
  jcmp.world.SetTime(hour, minute);
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


});

jcmp.events.AddRemoteCallable('race_Start_client', function(type) {
  playeringame = true;
  typeofrace = type ;
  jcmp.ui.CallEvent('Race_Checkpoint_container', true);
  jcmp.ui.CallEvent('Race_Timer_container', true);
  jcmp.ui.CallEvent('Countdown_start');
  //doing the countdown for the race to start
});
jcmp.events.AddRemoteCallable('race_Freeze_player', function() {
  jcmp.localPlayer.controlsEnabled = false;
  countdowninprogress = true;

});

jcmp.ui.AddEvent('race_countdown_end', function() {
  jcmp.localPlayer.controlsEnabled = true;
  countdowninprogress = false;
  //  jcmp.ui.CallEvent('Race_Timer_container',false);
  //Remove the countdown
  // start the timer global for the player
  jcmp.events.CallRemote('Race_player_timer_start');

});
jcmp.ui.AddEvent('AddPlayerLeaderboard', function() {
  jcmp.events.CallRemote('AddPlayerLeaderboard');
});
jcmp.ui.AddEvent('ResetPlayer_client', function() {
  if (countdowninprogress || playerpassager) {
    return;
  }

  jcmp.events.CallRemote('ResetPlayer_Server');
});
jcmp.events.AddRemoteCallable('race_end_point_client', function() {
  //jcmp.localPlayer.controlsEnabled = false;
  // make appear the leaderboard and button to spectator
  // the player is still ingame and wait the other to finish

});
