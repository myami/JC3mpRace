
jcmp.events.AddRemoteCallable('Lobby_Update_Player',function(id,number){ // Update the length of the lobby
  jcmp.ui.CallEvent('Lobby_Update_Player',id,number);
});

jcmp.events.AddRemoteCallable('Lobby_ready', function(data) { // When a player join the server to see everyone
  data = JSON.parse(data);
  data.players.forEach(function(p) {
    jcmp.ui.CallEvent('AddPlayerOnMainMenu', p.name);
  });
});

jcmp.events.AddRemoteCallable('Add_Player_On_Lobby', function(playername) { // When a player join the server to add himself to the list of other
  jcmp.ui.CallEvent('AddPlayerOnMainMenu', playername);
});

jcmp.events.AddRemoteCallable('AddPlayerLobbyArray_All',function(data){ // create a tr enter on lobby
  data = JSON.parse(data);
  data.players.forEach(function(p) {
    jcmp.ui.CallEvent('AddLobby_List', id,p.name);
  });
});

jcmp.events.AddRemoteCallable('AddPlayerLobbyArray',function(id,playername){ // create a tr enter on lobby
  jcmp.ui.CallEvent('AddLobby_List',id,playername);

});

jcmp.events.AddRemoteCallable('Lobby_remove_player',function(playername){ //Remove a player from the playerlobbylist
  jcmp.ui.CallEvent('Lobby_remove_one',playername);
});

jcmp.events.AddRemoteCallable('Lobby_List', function(data) { // Call when a player join to have the list of all lobby already created
  data = JSON.parse(data);
  data.lobby.forEach(function(l) {
  jcmp.ui.CallEvent('AddNewLobby', l.id,l.playername);
  jcmp.ui.CallEvent('Lobby_Update_Player', l.id,l.numberofplayer);
 });

});

jcmp.events.AddRemoteCallable('NewLobby', function(id,playername) { // string Call when a player join the server or finish the race
  jcmp.ui.CallEvent('AddNewLobby', id,playername);
});

jcmp.ui.AddEvent('Ready_Player',function(){ // When a player click on the ready button
jcmp.events.CallRemote('Ready_Player_Server');
});

jcmp.events.AddRemoteCallable('Lobby_Player_Ready',function(playername){ // sync to all player that playername is ready
  jcmp.ui.CallEvent('Lobby_Player_Ready',playername);
});

jcmp.events.AddRemoteCallable('DeleteLobby',function(id){ // Remove the lobby from the list
  jcmp.ui.CallEvent('Delete_Lobby',id);
});

jcmp.ui.AddEvent('JoinLobby',function(id){ // Player Join lobby
jcmp.events.CallRemote('Player_Join_Lobby',id);
jcmp.ui.CallEvent('PlayerLobbyList',true);

});

jcmp.ui.AddEvent('RemoveLobby',function(){ // Player Remove lobby
jcmp.events.CallRemote('Player_Remove_Lobby');
lobbylist.hidden = false;

});

jcmp.ui.AddEvent('CreateLobby',function(){ // Player Create lobby
jcmp.events.CallRemote('Player_Create_Lobby');
jcmp.ui.CallEvent('PlayerLobbyList',true);
lobbylist.hidden = true;

});

jcmp.ui.AddEvent('ServerList',function(boolean){ // Show the lobby/Server list or hide
  jcmp.ui.CallEvent('ServerList',boolean);
});

jcmp.ui.AddEvent('PlayerListLobby',function(boolean){ // Show the lobby/Server list or hide
  jcmp.ui.CallEvent('PlayerLobbyList',boolean);
});

jcmp.events.AddRemoteCallable('Lobby_hide',function(){ // hide the lobby (Start of a race)
jcmp.ui.CallEvent('ServerList',false);
jcmp.ui.CallEvent('PlayerLobbyList',false);
jcmp.ui.CallEvent('AllPlayerList',false);
});


jcmp.events.AddRemoteCallable('Lobby_show',function(newplayer){ // show the lobby (End of a race)
  if (newplayer){
    jcmp.ui.CallEvent('ServerList',true);
    jcmp.ui.CallEvent('PlayerLobbyList',false);
    jcmp.ui.CallEvent('AllPlayerList',true);
  }
  else{
    jcmp.ui.CallEvent('PlayerLobbyList',true);
    jcmp.ui.CallEvent('AllPlayerList',true);
  }
});

jcmp.events.AddRemoteCallable('Lobby_Update_state',function(playername,state){ // hide the lobby (Start of a race)
jcmp.ui.CallEvent('Lobby_Update_state',playername,state)
});
