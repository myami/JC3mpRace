jcmp.events.AddRemoteCallable('race_vehicle_choice_menu', function(type) {
  // set the vehicle type : car,boats,helicopter,motorbike,airplanes
  //jcmp.ui.CallEvent('CreateMenu',type);
});

jcmp.events.AddRemoteCallable('race_vehicle_choice_menu_remove', function() {
  // delete the generated menu
  jcmp.ui.CallEvent('DeleteMenu');

});

jcmp.ui.AddEvent('HashVehicle_menu', function(hash) {
  jcmp.events.CallRemote('spawnVehicle', hash); // send the hash to the server
});
