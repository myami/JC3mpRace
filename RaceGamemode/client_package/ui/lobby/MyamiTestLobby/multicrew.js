var MultiCrew = new Vue({
    el: '#MultiCrew',
    data: {
      PlayerRequest: "",
      Partner: "",
      MyName: "",
      imlead: false,
      imtheprotector:false,
      imtheprotected:false
    },
    methods: {
      YesRequest: function(){
        jcmp.CallEvent('ValidateRequest', playerthatrequest);
        MultiCrew.Partner = PlayerRequest;
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

        }
        if (int == 1){ // protector

        }
      }

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
