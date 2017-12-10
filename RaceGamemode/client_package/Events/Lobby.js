jcmp.events.AddRemoteCallable('Lobby_Update_Player', function(id, number) { // Update the length of the lobby
  jcmp.ui.CallEvent('Lobby_Update_Player', id, number);
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

jcmp.events.AddRemoteCallable('AddPlayerLobbyArray_All', function(data) { // create a tr enter on lobby
  data = JSON.parse(data);
  data.players.forEach(function(p) {
    jcmp.ui.CallEvent('AddLobby_List', id, p.name);
  });
});

jcmp.events.AddRemoteCallable('AddPlayerLobbyArray', function(id, playername) { // create a tr enter on lobby
  jcmp.ui.CallEvent('AddLobby_List', id, playername);

});

jcmp.events.AddRemoteCallable('Lobby_remove_player', function(playername) { //Remove a player from the playerlobbylist
  jcmp.ui.CallEvent('Lobby_remove_one', playername);
});

jcmp.events.AddRemoteCallable('Lobby_List', function(data) { // Call when a player join to have the list of all lobby already created
  data = JSON.parse(data);
  data.lobby.forEach(function(l) {
    jcmp.ui.CallEvent('AddNewLobby', l.id, l.PlayerCreated);
    jcmp.ui.CallEvent('Lobby_Update_Player', l.id, l.numberofplayer);
  });

});

jcmp.events.AddRemoteCallable('NewLobby', function(id, playername) { // string Call when a player join the server
  jcmp.ui.CallEvent('AddNewLobby', id, playername);
  // don't need Lobby_Update_Player because it's create automaticly with the number 1
});

jcmp.ui.AddEvent('Ready_Player', function() { // When a player click on the ready button
  jcmp.events.CallRemote('Ready_Player_Server');
});

jcmp.events.AddRemoteCallable('Lobby_Player_Ready', function(playername) { // sync to all player that playername is ready
  jcmp.ui.CallEvent('Lobby_Player_Ready', playername);
});

jcmp.events.AddRemoteCallable('DeleteLobby', function(id) { // Remove the lobby from the list
  jcmp.ui.CallEvent('Delete_Lobby', id);
});

jcmp.ui.AddEvent('JoinLobby', function(id) { // Player Join lobby
  jcmp.events.CallRemote('Player_Join_Lobby', id);
  jcmp.ui.CallEvent('PlayerLobbyList', true);
  jcmp.ui.CallEvent('TypeSelectedHide');
  jcmp.ui.CallEvent('ShowMaplist', false);

  lobbylist.hidden = true;
  playerlistlobby.hidden = false;


});

jcmp.ui.AddEvent('RemoveLobby', function() { // Player Remove lobby
  jcmp.events.CallRemote('Player_Remove_Lobby');
  lobbylist.hidden = false;
  playerlistlobby.hidden = true;
  jcmp.ui.CallEvent('TypeSelectedHide');
  jcmp.ui.CallEvent('MapSelectedHide');
  jcmp.ui.CallEvent('ShowLaunchRace', false);
  jcmp.ui.CallEvent('PlayerLobbyList', false);
  jcmp.ui.CallEvent('TypeOfRace', false);
  jcmp.ui.CallEvent('ShowMaplist', false);
  jcmp.ui.CallEvent('ActiveCreateLobbyButton');

});

jcmp.ui.AddEvent('CreateLobby', function() { // Player Create lobby
  jcmp.events.CallRemote('Player_Create_Lobby');
  jcmp.ui.CallEvent('PlayerLobbyList', true);
  jcmp.ui.CallEvent('TypeOfRace', true); // show the menu to select a type of race
  lobbylist.hidden = true;
  playerlistlobby.hidden = false;
  typeselect.hidden = false;



});

jcmp.ui.AddEvent('ServerLists', function(boolean) { // Show the lobby/Server list or hide
  jcmp.ui.CallEvent('ServerLists', boolean);

});

jcmp.ui.AddEvent('PlayerListLobby', function(boolean) { // Show the lobby/Server list or hide
  jcmp.ui.CallEvent('PlayerLobbyList', boolean);
});

jcmp.events.AddRemoteCallable('Lobby_hide', function() { // hide the lobby (Start of a race)
  //jcmp.ui.CallEvent('ServerLists',false);
  jcmp.ui.CallEvent('PlayerLobbyList', false);
  jcmp.ui.CallEvent('AllPlayerList', false);

});


jcmp.events.AddRemoteCallable('Lobby_show', function(newplayer) { // show the lobby (End of a race or player join the server)
  if (newplayer) {
    jcmp.events.CallRemote('race_debug', "it is a newplayer");
    // jcmp.ui.CallEvent('ServerLists',true); // callstack size here
    jcmp.ui.CallEvent('PlayerLobbyList', false);
    jcmp.ui.CallEvent('AllPlayerList', true);
  } else {
    jcmp.events.CallRemote('race_debug', "it is not a newplayer");
    jcmp.ui.CallEvent('PlayerLobbyList', true);
    jcmp.ui.CallEvent('AllPlayerList', true);
    //  jcmp.ui.CallEvent('ServerLists',false);

  }
  jcmp.localPlayer.controlsEnabled = false;


});

jcmp.events.AddRemoteCallable('Lobby_Update_state', function(playername, state) { // hide the lobby (Start of a race)
  jcmp.ui.CallEvent('Lobby_Update_state', playername, state)
});

jcmp.ui.AddEvent('TypeOfRace', function(int) { // send the type of race
  jcmp.events.CallRemote('TypeOfRace', int);
  jcmp.ui.CallEvent('ShowMaplist', true); // show the menu of map
  mapselect.hidden = false;


});

jcmp.ui.AddEvent('MapRace', function(int) { // send the map for the race
  jcmp.events.CallRemote('MapRace', int);
  jcmp.ui.CallEvent('ShowLaunchRace', true);
});

jcmp.events.AddRemoteCallable('Race_List_Select', function(index, name) { // send to the player that create the lobby all the map for making a list
  jcmp.print("" + index + name);
  jcmp.ui.CallEvent('Race_List_Select', index, name);
});
jcmp.ui.AddEvent('LaunchRace', function() { // Launch the race
  jcmp.events.CallRemote('LaunchRace');
});

jcmp.events.AddRemoteCallable('ShowSelectRace', function(index, name) { // send to the player that create the lobby all the map for making a list
  jcmp.ui.CallEvent('MapSelected', index, name); // show the menu to select a type of race
});

jcmp.events.AddRemoteCallable('ShowSelectType', function(int) { // send to the player that create the lobby all the map for making a list
  jcmp.ui.CallEvent('TypeSelected', int); // show the menu to select a type of race
});

jcmp.events.AddRemoteCallable('EndRaceShowOwnerTypeSelect', function() { // send to the player that create the lobby all the map for making a list
  jcmp.ui.CallEvent('TypeOfRace', true); // show the menu to select a type of race
});




// Myami TEST Lobby



jcmp.events.AddRemoteCallable('PlayerJoinLobby',function(id ,obj){
  jcmp.ui.CallEvent('PlayerJoinLobby', id,obj); // Show the UI of the lobby with the id

});
jcmp.events.AddRemoteCallable('LobbyCreated',function(Obj){
  jcmp.ui.CallEvent('LobbyCreated', Obj); // Show the UI of the lobby with the id

});

jcmp.events.AddRemoteCallable('UpdateLengthLobby',function(id,newlength){
  jcmp.ui.CallEvent('UpdateLengthLobby', id,newlength); // Show the UI of the lobby with the id

});

jcmp.events.AddRemoteCallable('AddPlayerOnLobbyMenu',function(id,playername){
  jcmp.ui.CallEvent('AddPlayerOnLobbyMenu', id,playername); // Add player to the lobby UI

});
jcmp.events.AddRemoteCallable('PlayerRemoveLobby',function(id,playername){
  jcmp.ui.CallEvent('PlayerRemoveLobby', id,playername); // Remove player from the lobby ui

});
jcmp.events.AddRemoteCallable('ShowLobbyList',function(boolean){
  jcmp.ui.CallEvent('ShowLobbyList', boolean); // Remove player from the lobby ui

});

jcmp.events.AddRemoteCallable('PlayerReady_Lobby',function(id,playername){
  jcmp.ui.CallEvent('PlayerReady_Lobby', id,playername);

});
jcmp.events.AddRemoteCallable('TypeOfRaceSelected',function(id,type){
  jcmp.ui.CallEvent('TypeOfRaceSelected', id,type);

});
jcmp.events.AddRemoteCallable('TypeOfRace',function(type){
  jcmp.ui.CallEvent('TypeOfRace',type);

});
jcmp.events.AddRemoteCallable('MapOfRaceSelected',function(id,map){
  jcmp.ui.CallEvent('MapOfRaceSelected', id,map);

});
jcmp.events.AddRemoteCallable('MapOfRace',function(map){
  jcmp.ui.CallEvent('MapOfRace',map);

});



jcmp.ui.AddEvent('Player_Remove_Lobby_Test', function() { // Remove the player to the lobby
  jcmp.events.CallRemote('Player_Remove_Lobby_Test');
});

jcmp.events.AddRemoteCallable('AddPlayerOnTheList',function(obj){
  jcmp.ui.CallEvent('AddPlayerOnTheList',obj);

});
jcmp.events.AddRemoteCallable('AddPlayerOnTheListJoin',function(obj){
  jcmp.ui.CallEvent('AddPlayerOnTheListJoin',obj);

});
jcmp.events.AddRemoteCallable('UpdatePlayerOnTheServer',function(networkid,IsinLobby,lobbyid){
  jcmp.ui.CallEvent('UpdatePlayerOnTheServer',networkid,IsinLobby,lobbyid);

});
jcmp.events.AddRemoteCallable('RemovePlayer',function(networkid){
  jcmp.ui.CallEvent('RemovePlayer',networkid);

});
