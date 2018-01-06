jcmp.ui.AddEvent('MC_Passenger_click',function(MacroChat){
jcmp.events.CallRemote('MC_Passenger_click_Server',MacroChat);
});


jcmp.events.AddRemoteCallable('PlayerPassager',function(statue){
  playerpassager = statue;
});
jcmp.events.AddRemoteCallable('PartnerRequest',function(playername,myname){
  jcmp.ui.CallEvent('PartnerRequest_CEF',playername);
  jcmp.ui.CallEvent('MyName',myname);
  jcmp.events.CallRemote('race_debug', `${playername} ${myname} PartnerRequest`);
});
jcmp.ui.AddEvent('ValidateRequest',function(playerrequest){
  jcmp.events.CallRemote('ValidateRequest_Server',playerrequest);
})
jcmp.ui.AddEvent('RefuseRequest',function(playerrequest){
jcmp.events.CallRemote('RefuseRequest_Server',playerrequest);
})
jcmp.events.AddRemoteCallable('PartnerNameUI_Client',function(playername){
  jcmp.ui.CallEvent('PartnerNameUI',playername);
});
