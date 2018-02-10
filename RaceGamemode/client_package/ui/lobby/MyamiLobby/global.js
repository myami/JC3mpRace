 var generateThumbUrl = function(raceid) {
    return "./img/racethumb/" + raceid + ".jpg";
}


// At startup hide all exept the lobby list and show the cursor
$("#TypeSelect").hide();
$("#MapSelectdiv").hide();
$("#DivLobbyJoined").hide();
$("#Leaderboard").hide();
$("#MultiCrewDiv").hide();
$("#LoadingPage").hide();
jcmp.ShowCursor();










// need to be here to acces all div
jcmp.AddEvent('RaceFinishShowLobby',function(){
  setTimeout(function() {
    $("#LoadingPage").hide();
    $("#ListOfPlayerOnServer").show();
    $("#DivLobbyJoined").show();
    console.log("Lobby loaded");
    jcmp.ShowCursor();

  }, 5000);

});


jcmp.AddEvent('Race_Start',function(){
  $("#TypeSelect").hide();
  $("#DivServerLobbyList").hide();
  $("#ListOfPlayerOnServer").hide();
  $("#Leaderboard").hide();
  $("#MapSelectdiv").hide();
  $("#DivLobbyJoined").hide();
  $("#LoadingPage").show();
  jcmp.HideCursor();

});
