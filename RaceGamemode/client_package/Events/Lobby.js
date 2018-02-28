

jcmp.events.AddRemoteCallable('Client/PlayerJoinLobby',function(id ,obj){
  jcmp.ui.CallEvent('CEF/PlayerJoinLobby', id,obj); // Show the UI of the lobby with the id

});
jcmp.events.AddRemoteCallable('Client/LobbyCreated',function(Obj){
  jcmp.ui.CallEvent('CEF/LobbyCreated', Obj); // Show the UI of the lobby with the id

});

jcmp.events.AddRemoteCallable('Client/UpdateLengthLobby',function(id,newlength){
  jcmp.ui.CallEvent('CEF/UpdateLengthLobby', id,newlength); // Show the UI of the lobby with the id

});

jcmp.events.AddRemoteCallable('Client/AddPlayerOnLobbyMenu',function(id,playername){
  jcmp.ui.CallEvent('CEF/AddPlayerOnLobbyMenu', id,playername); // Add player to the lobby UI

});
jcmp.events.AddRemoteCallable('Client/PlayerRemoveLobby',function(id,playername){

  jcmp.ui.CallEvent('CEF/PlayerRemoveLobby',id,playername); // Remove player from the lobby ui

});
jcmp.events.AddRemoteCallable('Client/ShowLobbyList',function(boolean){
  jcmp.ui.CallEvent('CEF/ShowLobbyList', boolean); // Remove player from the lobby ui

});

jcmp.events.AddRemoteCallable('Client/PlayerReady_Lobby',function(id,playername){
  jcmp.ui.CallEvent('CEF/PlayerReady_Lobby', id,playername);

});
jcmp.events.AddRemoteCallable('Client/TypeOfRaceSelected',function(id,type){
  jcmp.ui.CallEvent('CEF/TypeOfRaceSelected', id,type);

});
jcmp.events.AddRemoteCallable('Client/TypeOfRace',function(type){
  jcmp.ui.CallEvent('CEF/TypeOfRace',type);

});
jcmp.events.AddRemoteCallable('Client/MapOfRaceSelected',function(id,map,int){
  jcmp.ui.CallEvent('CEF/MapOfRaceSelected', id,map,int);

});
jcmp.events.AddRemoteCallable('Client/MapOfRace',function(map,int){
  jcmp.ui.CallEvent('CEF/MapOfRace',map,int);

});




jcmp.ui.AddEvent('Client/Player_Remove_Lobby_Test', function() { // Remove the player to the lobby
  jcmp.events.CallRemote('Server/Player_Remove_Lobby_Test');
});

jcmp.ui.AddEvent('Client/Player_Join_Lobby_Test', function(id) { // Add a player to the lobby
  jcmp.events.CallRemote('Server/Player_Join_Lobby_Test',id);
});

jcmp.ui.AddEvent('Client/Player_Created_Lobby_Test', function() { // Create a lobby
  jcmp.events.CallRemote('Server/Player_Create_Lobby_Test');
});

jcmp.ui.AddEvent('Client/NewMapSelected', function(int) { // Admin change map
  jcmp.events.CallRemote('Server/MapRace_Test',int);
});

jcmp.ui.AddEvent('Client/NewTypeSelected', function(int) { // Admin change type
  jcmp.events.CallRemote('Server/TypeOfRace_Test',int);
});



jcmp.ui.AddEvent('LaunchRace', function() { // Launch the race
  jcmp.events.CallRemote('LaunchRace');
});
jcmp.events.AddRemoteCallable('Client/MapList',function(obj){
  jcmp.ui.CallEvent('CEF/MapList',obj);
});

jcmp.events.AddRemoteCallable('Race_end_Loading_Page',function(){
  jcmp.ui.CallEvent('CEF/Race_end_Loading_Page');
  PlayerCameraHomeCEF();


});

jcmp.events.AddRemoteCallable('Race_Reset_UI_Lobby',function(){
  lobbytest.Reload(true);
});

jcmp.ui.AddEvent('ShowLobbyList', function() {
  jcmp.ui.CallEvent('CEF/ShowLobbyMenu');
});

jcmp.ui.AddEvent('ShowServerList', function() {
  jcmp.ui.CallEvent('CEF/ShowServerList');
});

jcmp.ui.AddEvent('LoadingHide', function() {
  jcmp.ui.CallEvent('CEF/LoadingHide');
   jcmp.localPlayer.camera.position = jcmp.localPlayer.position;
    jcmp.localPlayer.camera.attachedToPlayer = true;
    jcmp.localPlayer.frozen = false;


});
jcmp.ui.AddEvent('ImHost', function(bool) {
  jcmp.ui.CallEvent('CEF/ImHost',bool);
});

jcmp.ui.AddEvent('ShowMapSelectDiv', function(bool) {
  jcmp.ui.CallEvent('CEF/ShowMapSelectDiv',bool);
});

jcmp.ui.AddEvent('ShowTypeSelectDiv', function(bool) {
  jcmp.ui.CallEvent('CEF/ShowTypeSelectDiv',bool);
});

jcmp.ui.AddEvent('DeleteLobby', function() {
  jcmp.events.CallRemote('DeleteLobby');
});
jcmp.events.AddRemoteCallable('Client/DeleteLobby',function(id){
  jcmp.ui.CallEvent('CEF/DeleteLobby',id);
    jcmp.ui.CallEvent('CEF/HideLobbyMenu',id);
});

jcmp.ui.AddEvent('LobbyIsRemovedP', function() {
  jcmp.events.CallRemote('LobbyIsRemovedP');
});
jcmp.events.AddRemoteCallable('Client/isAdmin',function(){
  jcmp.ui.CallEvent('CEF/ShowUILobbyCreated');

});

jcmp.events.AddRemoteCallable('PlayerMeLobby',function(name){
  jcmp.ui.CallEvent('CEF/PlayerMeLobby',name);

});
jcmp.ui.AddEvent('CEF/ReadyButton', function() {
  jcmp.events.CallRemote('Server/ReadyButton');
});
jcmp.events.AddRemoteCallable('Client/PlayerIsReady',function(id,name){
  jcmp.ui.CallEvent('CEF/PlayerIsReady',id,name);

});

jcmp.events.AddRemoteCallable('Client/LobbyPlayerIngame',function(id,name){
  jcmp.ui.CallEvent('CEF/PlayerIngame',id,name);

});

jcmp.events.AddRemoteCallable('Client/LobbyJoinNotIngame',function(id,name){
  jcmp.ui.CallEvent('CEF/PlayerNotIngame',id,name);

});

jcmp.ui.AddEvent('CEF/NotReadyButton', function() {
  jcmp.events.CallRemote('Server/NotReadyButton');
});

jcmp.events.AddRemoteCallable('Client/PlayerIsNotReady',function(id,name){
  jcmp.ui.CallEvent('CEF/PlayerIsNotReady',id,name);

});

jcmp.events.AddRemoteCallable('ShowRaceMenu',function(bool){
  jcmp.ui.CallEvent('ShowRaceMenu',bool);
  if (bool == false){
    jcmp.localPlayer.camera.position = jcmp.localPlayer.position;
     jcmp.localPlayer.camera.attachedToPlayer = true;
     jcmp.localPlayer.frozen = false;

  }

});


jcmp.events.AddRemoteCallable('race_end_timer_lobby',function(id,name,minute,seconde){
  jcmp.ui.CallEvent('CEF/race_end_timer_lobby',id,name,minute,seconde);

});

jcmp.events.AddRemoteCallable('Race_Leaderboard_Rank',function(id,name,rank){
  jcmp.ui.CallEvent('CEF/Race_Leaderboard_Rank',id,name,rank);

});
