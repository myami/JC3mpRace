 var generateThumbUrl = function(raceid) {
    return "./img/racethumb/" + raceid + ".jpg";
}
$("#TypeSelect").hide();
$("#MapSelectdiv").hide();
$("#DivLobbyJoined").hide();
$("#Leaderboard").hide();
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
$("#btnJoin").click(function(){
  jcmp.CallEvent('Client/Player_Join_Lobby_Test',LobbyMain.currentSelected);
  console.log("PlayerJoinLobby" + LobbyMain.currentSelected);
  $("#DivServerLobbyList").hide();
  $("#btnJoin").hide();
  $("#btnCreate").hide();
  $("#DivLobbyJoined").show();




});


$("#ClassicType").click(function(){
jcmp.CallEvent('Client/NewTypeSelected',0);
$("#TypeSelect").hide();
});

$("#MultiCrewType").click(function(){
  jcmp.CallEvent('Client/NewTypeSelected',1);
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

$("#btnSelectMap").click(function(){
  jcmp.CallEvent('Client/NewMapSelected',MapSelected.selectedTrack);
  $("#MapSelectdiv").hide();
});

jcmp.AddEvent('RaceFinishShowLobby',function(){
  $("#DivServerLobbyList").hide();
  $("#ListOfPlayerOnServer").show();
  $("#Leaderboard").show();
  $("#DivLobbyJoined").show();
  jcmp.ShowCursor();
})

jcmp.AddEvent('Race_Start',function(){
  jcmp.HideCursor();
})
