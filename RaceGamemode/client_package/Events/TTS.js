jcmp.events.AddRemoteCallable('race_Freeze_player_wait', function() {
  jcmp.localPlayer.controlsEnabled = false;
  // Maybe have the UI say : Wait it's you're turn to see the checkpoint
  jcmp.ui.CallEvent('WaityoutimeTTS',true);
  jcmp.ui.CallEvent('IsTTS',true);
  jcmp.events.CallRemote('race_debug', "race_Freeze_player_wait" + jcmp.localPlayer.networkId);

});

jcmp.events.AddRemoteCallable('TTS_race_Freeze_player', function() {
  countdowninprogress = true;
  jcmp.ui.CallEvent('WaityoutimeTTS',false);
  jcmp.ui.CallEvent('Race_Timer_container', true);
  jcmp.ui.CallEvent('Countdown_start');
    jcmp.events.CallRemote('race_debug', "TTS_race_Freeze_player " + jcmp.localPlayer.networkId );

  //doing the countdown for the race to start
});

jcmp.ui.AddEvent('TTS_race_countdown_end', function() {
    jcmp.localPlayer.controlsEnabled = true;
      countdowninprogress = false;
  jcmp.events.CallRemote('race_debug', "TTS_race_countdown_end " + jcmp.localPlayer.networkId);
  jcmp.events.CallRemote('TTS_Race_player_timer_start');
  jcmp.events.CallRemote('race_debug', "CountdownEND");
});
