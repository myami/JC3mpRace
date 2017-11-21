
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
  jcmp.ui.CallEvent('AddNewLobby', l.id,l.PlayerCreated);
  jcmp.ui.CallEvent('Lobby_Update_Player', l.id,l.numberofplayer);
 });

});

jcmp.events.AddRemoteCallable('NewLobby', function(id,playername) { // string Call when a player join the server or finish the race
  jcmp.ui.CallEvent('AddNewLobby', id,playername);
  // don't need Lobby_Update_Player because it's create automaticly with the number 1
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
lobbylist.hidden = true;
playerlistlobby.hidden = false;

});

jcmp.ui.AddEvent('RemoveLobby',function(){ // Player Remove lobby
jcmp.events.CallRemote('Player_Remove_Lobby');
lobbylist.hidden = false;
playerlistlobby.hidden = true;
jcmp.ui.CallEvent('TypeSelectedHide');
jcmp.ui.CallEvent('MapSelectedHide');
jcmp.ui.CallEvent('ShowLaunchRace',false);
jcmp.ui.CallEvent('ActiveCreateLobbyButton');

});

jcmp.ui.AddEvent('CreateLobby',function(){ // Player Create lobby
jcmp.events.CallRemote('Player_Create_Lobby');
jcmp.ui.CallEvent('PlayerLobbyList',true);
jcmp.ui.CallEvent('TypeOfRace',true); // show the menu to select a type of race
lobbylist.hidden = true;
playerlistlobby.hidden = false;


});

jcmp.ui.AddEvent('ServerLists',function(boolean){ // Show the lobby/Server list or hide
  jcmp.ui.CallEvent('ServerLists',boolean);

});

jcmp.ui.AddEvent('PlayerListLobby',function(boolean){ // Show the lobby/Server list or hide
  jcmp.ui.CallEvent('PlayerLobbyList',boolean);
});

jcmp.events.AddRemoteCallable('Lobby_hide',function(){ // hide the lobby (Start of a race)
//jcmp.ui.CallEvent('ServerLists',false);
jcmp.ui.CallEvent('PlayerLobbyList',false);
jcmp.ui.CallEvent('AllPlayerList',false);

});


jcmp.events.AddRemoteCallable('Lobby_show',function(newplayer){ // show the lobby (End of a race or player join the server)
  if (newplayer){
    jcmp.events.CallRemote('race_debug', "it is a newplayer");
  // jcmp.ui.CallEvent('ServerLists',true); // callstack size here
    jcmp.ui.CallEvent('PlayerLobbyList',false);
    jcmp.ui.CallEvent('AllPlayerList',true);
  }
  else{
    jcmp.events.CallRemote('race_debug', "it is not a newplayer");
    jcmp.ui.CallEvent('PlayerLobbyList',true);
    jcmp.ui.CallEvent('AllPlayerList',true);
  //  jcmp.ui.CallEvent('ServerLists',false);

  }
  jcmp.localPlayer.controlsEnabled = false;


});

jcmp.events.AddRemoteCallable('Lobby_Update_state',function(playername,state){ // hide the lobby (Start of a race)
jcmp.ui.CallEvent('Lobby_Update_state',playername,state)
});

jcmp.ui.AddEvent('TypeOfRace',function(int){ // send the type of race
  jcmp.events.CallRemote('TypeOfRace',int);
  jcmp.ui.CallEvent('ShowMaplist'); // show the menu of map

});

jcmp.ui.AddEvent('MapRace',function(int){ // send the map for the race
  jcmp.events.CallRemote('MapRace',int);
  jcmp.ui.CallEvent('ShowLaunchRace',true);
});

jcmp.events.AddRemoteCallable('Race_List_Select', function(index, name) { // send to the player that create the lobby all the map for making a list
  jcmp.print("" + index + name);
  jcmp.ui.CallEvent('Race_List_Select', index, name);
});
jcmp.ui.AddEvent('LaunchRace',function(){ // Launch the race
jcmp.events.CallRemote('LaunchRace');

});

jcmp.events.AddRemoteCallable('ShowSelectRace', function(index, name) { // send to the player that create the lobby all the map for making a list
  jcmp.ui.CallEvent('MapSelected',index , name); // show the menu to select a type of race
});

jcmp.events.AddRemoteCallable('ShowSelectType', function(int) { // send to the player that create the lobby all the map for making a list
  jcmp.ui.CallEvent('TypeSelected',int); // show the menu to select a type of race
});
