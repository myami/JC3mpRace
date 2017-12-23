var MapSelected = new Vue({
    el: '#MapSelect',
    data: {
      raceList: [],
      selectedTrack: 0
    },
    methods: {
    //  generateThumbUrl: generateThumbUrl,
      selectTrack: function(raceid, event) {
          this.selectedTrack = raceid;
          $(".selectedTrack").removeClass("selectedTrack");
          $(event.currentTarget).addClass("selectedTrack");
      }
    }

});
