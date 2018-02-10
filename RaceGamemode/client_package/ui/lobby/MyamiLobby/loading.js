jcmp.AddEvent('CEF/LoadingHide',function(){
  $("#LoadingPage").hide();

});

jcmp.AddEvent('CEF/Race_end_Loading_Page',function(){
  $("#LoadingPage").show();
});
