
jcmp.events.AddRemoteCallable('Update_leaderboard_all', function(playername, leaderboardplace, time) {
  jcmp.ui.CallEvent('Leaderboard_update_end', playername, leaderboardplace, time);
});
jcmp.events.AddRemoteCallable('Update_leaderboard_all_TTS',function(playername,time){
    jcmp.ui.CallEvent('Leaderboard_update_end_TTS', playername, time);
});

jcmp.events.AddRemoteCallable('Remove_Leaderboard_name', function() {
  jcmp.ui.CallEvent('Leaderboard_remove_all');
});

jcmp.events.AddRemoteCallable('Add_Player_On_Leaderboard', function(playername) {
  jcmp.ui.CallEvent('AddPlayerOnLeaderboard', playername);
});
