var MultiCrew = new Vue({
    el: '#MultiCrewDiv',
    data: {
      PlayerRequest: " ",
      MyName: " ",
      imlead: false,
      Lead:{Name:"",Protector:true},
      Other:{Name:"",Protector:false}
    },
    methods: {
      YesRequest: function(){
        jcmp.CallEvent('ValidateRequest', this.PlayerRequest);
        this.Lead.Name = this.PlayerRequest;
        this.Other.Name =   this.MyName;
        $("#Request").hide();
        jcmp.HideCursor();
      },
      NoRequest: function(){
        jcmp.CallEvent('RefuseRequest', this.PlayerRequest);
        $("#Request").hide();
        jcmp.HideCursor();
      },
      SelectRole:function(int){
        if(int == 0){ // protected
          this.Lead.Protector = true;
          this.Other.Protector = false;
          jcmp.CallEvent('Client/MultiCrew_SelectRole',0);
        }
        if (int == 1){ // protector
          this.Lead.Protector = false;
          this.Other.Protector = true;
          jcmp.CallEvent('Client/MultiCrew_SelectRole',1);
        }
      },
      LeadRole: function(){
        if (!this.Lead.Protector){
          return 'Protector';
        }
        else{
          return 'Protected';
        }
      },
      OtherRole: function(){
        if (!this.Other.Protector){
          return 'Protector';
        }
        else{
          return 'Protected';
        }
      },
      NameUI: function(){
        if (this.imlead){
          return this.Other.Name;
        }
        else{
          return this.Lead.Name;
        }
      }

    }

});

jcmp.AddEvent('CEF/MultiCrew_SelectRoleReceived',function(int){ // second player received it
  if(int == 0){ // protected
    MultiCrew.Lead.Protector = true;
    MultiCrew.Other.Protector = false;
  }
  if (int == 1){ // protector
    MultiCrew.Lead.Protector = false;
    MultiCrew.Other.Protector = true;
  }
});

jcmp.AddEvent('PartnerRequest_CEF', function(playername) {
  MultiCrew.PlayerRequest = playername;
  $("#Request").show(); // show the modal or popup
  $("#MultiCrewDiv").show();

  jcmp.ShowCursor()
  console.log("request receive");
});

jcmp.AddEvent('MyName', function(playername) {
  MultiCrew.MyName = playername;
});
jcmp.AddEvent('Imlead',function(){
  MultiCrew.imlead = true;
})
