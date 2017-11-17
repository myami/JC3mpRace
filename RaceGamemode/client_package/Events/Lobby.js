
jcmp.events.AddRemoteCallable('Lobby_Update_all', function(playername, privilege, id) { // array each
  jcmp.ui.CallEvent('Lobby_Update_all', playername, privilege, id);
});

jcmp.events.AddRemoteCallable('Remove_All_Lobby', function() { //Call when we launch a race
  jcmp.ui.CallEvent('Lobby_remove_all');
});

jcmp.events.AddRemoteCallable('Add_Player_On_Lobby_list', function(playername,playernetworkid) { // string Call when a player join the server or finish the race
  jcmp.ui.CallEvent('AddPlayerOnLobbyList', playername,playernetworkid);
});
jcmp.events.AddRemoteCallable('NewLobby', function(id,playername) { // string Call when a player join the server or finish the race
  jcmp.ui.CallEvent('AddNewLobby', id,playername);
});


jcmp.events.AddRemoteCallable('Remove_Lobby_Destroyed', function(playername) {
  jcmp.ui.CallEvent('Lobby_remove_one',playername);
});

jcmp.events.AddRemoteCallable('Lobby_Update_state_Server', function(playername,state) {
  jcmp.ui.CallEvent('Lobby_Update_state',playername,state);
});

jcmp.events.AddRemoteCallable('Add_Player_On_Lobby', function(playername,playernetworkid) { // string Call when a player join the server or finish the race
  jcmp.ui.CallEvent('AddPlayerOnLobby', playername,playernetworkid);
});


jcmp.events.AddRemoteCallable('Lobby_ready', function(data) { // Call when a player join to have the list of all player ingame
  data = JSON.parse(data);
  data.players.forEach(function(p) {
    jcmp.ui.CallEvent('AddPlayerOnLobby', p.name,p.id);
  });

});

jcmp.events.AddRemoteCallable('Lobby_List', function(data) { // Call when a player join to have the list of all player ingame
  data = JSON.parse(data);
  data.players.forEach(function(l) {
  jcmp.ui.CallEvent('AddNewLobby', l.id,l.playername);
  jcmp.ui.CallEvent('Lobby_Update_Player', l.id,l.numberofplayer);
 });

});
jcmp.events.AddRemoteCallable('LobbyStatus_Server',function(status){
  jcmp.ui.CallEvent('PlayerLobbyList',status);
});

jcmp.ui.AddEvent('JoinLobby',function(id){
jcmp.events.CallRemote('Player_Join_Lobby',id);
});
jcmp.ui.AddEvent('RemoveLobby',function(){
jcmp.events.CallRemote('Player_Remove_Lobby');
});

jcmp.ui.AddEvent('CreateLobby',function(){
jcmp.events.CallRemote('Player_Create_Lobby');
});
jcmp.events.AddRemoteCallable('JoinLobby_show_button',function(){
  jcmp.ui.CallEvent('JoinLobby_Show_button');
});
jcmp.events.AddRemoteCallable('DeleteLobby',function(id){
  jcmp.ui.CallEvent('Delete_Lobby',id);
});

jcmp.events.AddRemoteCallable('Lobby_Update_Player',function(id,number){
  jcmp.ui.CallEvent('Lobby_Update_Player',id,number);
});

jcmp.ui.AddEvent('Ready_Player',function(){
jcmp.events.CallRemote('Ready_Player_Server');
});
jcmp.events.AddRemoteCallable('Lobby_Player_Ready',function(playername){
  jcmp.ui.CallEvent('Lobby_Player_Ready',playername);
});

jcmp.events.AddRemoteCallable('AddPlayerLobbyArray',function(id,playername){
  jcmp.ui.CallEvent('AddLobby_List',id,playername);
});
jcmp.events.AddRemoteCallable('Lobby_remove_player',function(playername){
  jcmp.ui.CallEvent('Lobby_remove_Player',playername);
});
