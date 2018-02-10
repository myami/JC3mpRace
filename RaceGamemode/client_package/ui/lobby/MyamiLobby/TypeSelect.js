

$("#ClassicType").click(function(){
jcmp.CallEvent('Client/NewTypeSelected',0);
$("#TypeSelect").hide();
});
$("#MultiplePath").click(function(){
jcmp.CallEvent('Client/NewTypeSelected',4);
$("#TypeSelect").hide();
});


$("#TTSType").click(function(){
  jcmp.CallEvent('Client/NewTypeSelected',2);
  $("#TypeSelect").hide();
});


jcmp.AddEvent('CEF/ShowTypeSelectDiv',function(bool){
  if(bool){
    $("#TypeSelect").show();
  }
  else{
    $("#TypeSelect").hide();
  }
});
