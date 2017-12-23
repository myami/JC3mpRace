var MultiCrew = new Vue({
    el: '#MultiCrew',
    data: {
      PlayerRequest: "",
      MyName: "",
      imlead: false,
      Lead:{Name:"",Protector:true},
      Other:{Name:"",Protector:false}
    },
    methods: {
      YesRequest: function(){
        jcmp.CallEvent('ValidateRequest', MultiCrew.PlayerRequest);
        MultiCrew.Partner = PlayerRequest;
        MultiCrew.Lead.Name = MultiCrew.PlayerRequest;
        MultiCrew.Other.Name =   MultiCrew.MyName;
        $("#Request").hide();
        jcmp.HideCursor();
      },
      NoRequest: function(){
        jcmp.CallEvent('RefuseRequest', playerthatrequest);
        $("#Request").hide();
        jcmp.HideCursor();
      },
      SelectRole:function(int){
        if(int == 0){ // protected
          MultiCrew.Lead.Protector = false;
          MultiCrew.Other.Protector = true;
          jcmp.CallEvent('Client/MultiCrew_SelectRole',0);
        }
        if (int == 1){ // protector
          MultiCrew.Lead.Protector = true;
          MultiCrew.Other.Protector = false;
          jcmp.CallEvent('Client/MultiCrew_SelectRole',1);
        }
      }

    }

});

jcmp.AddEvent('CEF/MultiCrew_SelectRoleReceived',function(int){ // second player received it
  if(int == 0){ // protected
    MultiCrew.Lead.Protector = false;
    MultiCrew.Other.Protector = true;
  }
  if (int == 1){ // protector
    MultiCrew.Lead.Protector = true;
    MultiCrew.Other.Protector = false;
  }
});

jcmp.AddEvent('PartnerRequest_CEF', function(playername) {
  MultiCrew.PlayerRequest = playername;
  $("#Request").show(); // show the modal or popup
  jcmp.ShowCursor()
});

jcmp.AddEvent('MyName', function(playername) {
  MultiCrew.MyName = playername;

});
