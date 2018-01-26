var LeaderBoard = new Vue({
    el: '#Leaderboard',
    data: {
      LeaderboardPlayer:[]
    },
    methods: {

    }

});


jcmp.AddEvent('AddPlayerOnLeaderboard', function(playerlist) {
  let playerl = JSON.parse(playerlist);
  for (var i = 0; i < playerl.length; i++) {
    let playername = playerl[i];
    let newplayerobject = {PlayerName:playername,Time:0,Rank:0}
    LeaderboardPlayer.push(newplayerobject);
  }


});

jcmp.AddEvent('Leaderboard_update_end', function(playername, leaderboardplace, time) {
  // update the leaderboard place and time when a player and the race

  for (var i = 0; i < MultiCrew.LeaderboardPlayer.length; i++) {
    let player = MultiCrew.LeaderboardPlayer[i];
      if(player.PlayerName == playername){
        player.Time = time;
        player.Rank = leaderboardplace;
      }
  }


});


jcmp.AddEvent('Leaderboard_update_end_TTS',function(playername,time){
  for (var i = 0; i < MultiCrew.LeaderboardPlayer.length; i++) {
    let player = MultiCrew.LeaderboardPlayer[i];
      if(player.PlayerName == playername){
        player.Time = time;
        player.Rank = undefined; // need to do that the best time is first etc...
      }
  }

})

jcmp.AddEvent('Leaderboard_remove_all', function() {
MultiCrew.LeaderboardPlayer = [];
});
