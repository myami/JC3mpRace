var MapSelected = new Vue({
    el: '#MapSelect',
    data: {
      raceList: [],
      selectedTrack: 0
    },
    methods: {
      generateThumbUrls: generateThumbUrl,
      selectTrack: function(raceid, event) {
        $("#btnSelectMap").removeAttr("disabled");
          this.selectedTrack = raceid;
          jcmp.CallEvent('Client/NewMapSelected',this.selectedTrack);
          $("#MapSelectdiv").hide();
      },

    }

});

jcmp.AddEvent('CEF/MapList',function(obj){
  let mapdata = JSON.parse(obj);
  let mapobj = {
    raceid: mapdata.raceid, name: mapdata.name, type: mapdata.type,
  }
  console.log(mapobj);
  MapSelected.raceList.push(mapobj);
});
