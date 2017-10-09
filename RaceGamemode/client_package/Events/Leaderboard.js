jcmp.events.AddRemoteCallable('Player_data_Announce', (leaderboardplace, time) => {
  jcmp.ui.CallEvent('Race_rank_container', leaderboardplace, time);
});


jcmp.events.AddRemoteCallable('Update_leaderboard_all', function(playername, leaderboardplace, minutes, seconds) {
  jcmp.ui.CallEvent('Leaderboard_update_end', playername, leaderboardplace, minutes, seconds);
});

jcmp.events.AddRemoteCallable('Remove_Leaderboard_name', function() {
  jcmp.ui.CallEvent('Leaderboard_remove_all');
});

jcmp.events.AddRemoteCallable('Add_Player_On_Leaderboard', function(playername) {
  jcmp.ui.CallEvent('AddPlayerOnLeaderboard', playername);
});
