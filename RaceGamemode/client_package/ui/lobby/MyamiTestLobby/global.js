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







$("#btnCreate").click(function(){
  let name = "TestLobby";
  jcmp.CallEvent('Client/Player_Created_Lobby_Test',name);
  console.log("Lobby created with the name : " + name);
  $("#btnJoin").hide();
  $("#DivServerLobbyList").hide();
  $("#btnCreate").hide();
  $("#DivLobbyJoined").show();

});



$("#ClassicType").click(function(){
jcmp.CallEvent('Client/NewTypeSelected',0);
$("#TypeSelect").hide();
});
$("#MultiplePath").click(function(){
jcmp.CallEvent('Client/NewTypeSelected',4);
$("#TypeSelect").hide();
});


$("#MultiCrewType").click(function(){
  jcmp.CallEvent('Client/NewTypeSelected',1);
  $("#TypeSelect").hide();
  $("#MultiCrewDiv").show();
  $("#MultiCrewUI").hide(); // appear when the race start
  $("#SelectWho").hide(); // appear after you made a request
  $("#Request").hide(); // Appear when you want to do a request to a player




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

})

jcmp.AddEvent('Race_Start',function(){
  jcmp.HideCursor();

});

jcmp.AddEvent('CEF/Race_end_Loading_Page',function(){
  $("#LoadingPage").show();
})
