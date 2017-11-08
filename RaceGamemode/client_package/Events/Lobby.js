
jcmp.events.AddRemoteCallable('Lobby_Update_all', function(playername, privilege, id) { // array each
  jcmp.ui.CallEvent('Lobby_Update_all', playername, privilege, id);
});

jcmp.events.AddRemoteCallable('Remove_All_Lobby', function() { //Call when we launch a race
  jcmp.ui.CallEvent('Lobby_remove_all');
});

jcmp.events.AddRemoteCallable('Add_Player_On_Lobby_list', function(playername,playernetworkid) { // string Call when a player join the server or finish the race
  jcmp.ui.CallEvent('AddPlayerOnLobbyList', playername,playernetworkid);
});

jcmp.events.AddRemoteCallable('Remove_One_Lobby', function(playername) { // string
  jcmp.ui.CallEvent('Lobby_remove_one',playername);
});

jcmp.events.AddRemoteCallable('Lobby_Update_privilege_Server', function(playername,privilege) { // string
  jcmp.ui.CallEvent('Lobby_Update_privilege',playername,privilege);
});

jcmp.events.AddRemoteCallable('Add_Player_On_Lobby', function(playername,playernetworkid) { // string Call when a player join the server or finish the race
  jcmp.ui.CallEvent('AddPlayerOnLobby', playername,playernetworkid);
});
