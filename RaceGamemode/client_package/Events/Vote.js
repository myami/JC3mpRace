jcmp.ui.AddEvent('Update_All_Client', function(name, value) {
  jcmp.events.CallRemote('Update_All_Client_server', name, value);
});

jcmp.events.AddRemoteCallable('Update_All_Client_toeveryone', function(name, value) {
  jcmp.ui.CallEvent('UpdateUIforvote', name, value);
});

jcmp.events.AddRemoteCallable('Race_name_index_client_vote', function(index, namew, name) {
  jcmp.print("" + index + name);
  jcmp.ui.CallEvent('Race_name_index_cef_vote', index, namew, name);
});

jcmp.events.AddRemoteCallable('Race_name_vote_data', function() {
  jcmp.ui.CallEvent('Send_best_vote_index');
});
jcmp.ui.AddEvent('Race_send_index_cef', function(index) { // from the voting system
  jcmp.events.CallRemote('Race_index_received_vote', index);
});
jcmp.events.AddRemoteCallable('Open_voting_menu_client', function(time) {
  jcmp.ui.CallEvent('Open_vote_menu', time);
});






////////////////////////// ADMIN MENU ////////////////////////////////////////



jcmp.ui.AddEvent('Race_Index_cef', function(index) {
  jcmp.events.CallRemote('Race_index_received_admin', index);
});
jcmp.events.AddRemoteCallable('Race_name_index_client_admin', function(index, namew, name) {
  jcmp.ui.CallEvent('Race_name_index_cef_admin', index, namew, name);
});
jcmp.events.AddRemoteCallable('Open_admin_menu_client', function() {
  jcmp.ui.CallEvent('Open_admin_menu');
});
