
jcmp.events.AddRemoteCallable('Lobby_Update_all', function(playername, privilege, id) { // array each
  jcmp.ui.CallEvent('Lobby_Update_all', playername, privilege, id);
});

jcmp.events.AddRemoteCallable('Remove_All_Lobby', function() { //Call when we launch a race
  jcmp.ui.CallEvent('Lobby_remove_all');
});

jcmp.events.AddRemoteCallable('Add_Player_On_Lobby_list', function(playername,playernetworkid) { // string Call when a player join the server or finish the race
  jcmp.ui.CallEvent('AddPlayerOnLobbyList', playername,playernetworkid);
});

jcmp.events.AddRemoteCallable('Remove_Lobby_Destroyed', function(playername) {
  jcmp.ui.CallEvent('Lobby_remove_one',playername);
});

jcmp.events.AddRemoteCallable('Lobby_Update_state_Server', function(playername,state) { // state are "OnLobby" or "Ingame"
  jcmp.ui.CallEvent('Lobby_Update_state',playername,state);
    jcmp.events.CallRemote('race_debug', JSON.parse(state));
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
jcmp.events.AddRemoteCallable('LobbyStatus_Server',function(status){
  jcmp.ui.CallEvent('LobbyStatus',status);
})
