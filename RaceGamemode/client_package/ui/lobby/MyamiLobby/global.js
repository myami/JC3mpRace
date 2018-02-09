 var generateThumbUrl = function(raceid) {
    return "./img/racethumb/" + raceid + ".jpg";
}



$("#TypeSelect").hide();
$("#MapSelectdiv").hide();
$("#DivLobbyJoined").hide();
$("#Leaderboard").hide();
$("#MultiCrewDiv").hide();
$("#LoadingPage").hide();


jcmp.ShowCursor();








$("#ClassicType").click(function(){
jcmp.CallEvent('Client/NewTypeSelected',0);
$("#TypeSelect").hide();
});
$("#MultiplePath").click(function(){
jcmp.CallEvent('Client/NewTypeSelected',4);
$("#TypeSelect").hide();
});


$("#TTSType").click(function(){
  jcmp.CallEvent('Client/NewTypeSelected',2);
  $("#TypeSelect").hide();
});

$("#ApoType").click(function(){
  jcmp.CallEvent('Client/NewTypeSelected',3);
  $("#TypeSelect").hide();
});



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
jcmp.AddEvent('CEF/LoadingHide',function(){
  $("#LoadingPage").hide();

})

jcmp.AddEvent('CEF/Race_end_Loading_Page',function(){
  $("#LoadingPage").show();
})
