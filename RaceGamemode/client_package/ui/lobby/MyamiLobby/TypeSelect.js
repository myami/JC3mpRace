

$("#ClassicType").click(function(){
jcmp.CallEvent('Client/NewTypeSelected',0);
$("#TypeSelect").hide();
  jcmp.CallEvent('ShowLobbyList');

});
$("#MultiplePath").click(function(){
jcmp.CallEvent('Client/NewTypeSelected',4);
$("#TypeSelect").hide();
  jcmp.CallEvent('ShowLobbyList');

});


$("#TTSType").click(function(){
  jcmp.CallEvent('Client/NewTypeSelected',2);
  $("#TypeSelect").hide();
    jcmp.CallEvent('ShowLobbyList');

});


jcmp.AddEvent('CEF/ShowTypeSelectDiv',function(bool){
  if(bool){
    $("#TypeSelect").show();
  }
  else{
    $("#TypeSelect").hide();
  }
});
