var LeaderBoard = new Vue({
    el: '#Leaderboard',
    data: {

    },
    methods: {

    }

});
  // ALL NEED REWRITE

jcmp.AddEvent('AddPlayerOnLeaderboard', function(playerlist) {
  let playerl = JSON.parse(playerlist);
  for (var i = 0; i < playerl.length; i++) {
    let playername = playerl[i];
    let namewithoutspace = playername.split(" ").join("");
    var $submenu = $("<tr></tr>").attr("id", namewithoutspace);
    var $name = $("<td></td>").attr({
      "id": namewithoutspace + "1"
    });
    $($name).text(playername);
    var $place = $("<td></td>").attr({
      "id": namewithoutspace + "2"
    });
    $($place).text(" ");
    var $time = $("<td></td>").attr({
      "id": namewithoutspace + "3"
    });


    $($submenu).append($name);
    $($submenu).append($place);
    $($submenu).append($time);
    $("#tableLeaderboard").append($submenu);
  }


});

jcmp.AddEvent('Leaderboard_update_end', function(playername, leaderboardplace, minute, seconds) {
  // update the leaderboard place and time when a player and the race
  $('tr').each(function() {
    let idname = $(this).attr('id');
    let namewithoutspace = playername.split(" ").join("");
    if (idname == namewithoutspace) {
      $("#" + namewithoutspace + "2").text(`${leaderboardplace}`);
      $("#" + namewithoutspace + "3").text(`${minute} M ${seconds} s`);

    }


  });

});
jcmp.AddEvent('Leaderboard_update_end_TTS',function(playername,minute,seconds){
  $('tr').each(function() {
    let idname = $(this).attr('id');
    let namewithoutspace = playername.split(" ").join("");
    if (idname == namewithoutspace) {
      $("#" + namewithoutspace + "3").text(`${minute} M ${seconds} s`);

    }


  });

})

jcmp.AddEvent('Leaderboard_remove_all', function() {
  $('tr').each(function() {
    let idname = $(this).attr('id');
    console.log(idname);
    if (idname == "toplist") {
      return;
    }
    $(this).remove();
    console.log(this + "removed");

  });
});
