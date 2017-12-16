var generateThumbUrl = function(raceid) {
  //console.log(raceid + "generateThumbUrl");
  //  return "./img/racethumb/" + raceid + ".jpg";
}

Vue.component('generateThumbUrl', {
  template: '<img :src="generateThumbUrl(lobby.RaceID)" width="100%">',
  data :{
    generateThumbUrl: function(raceid) {
    return "./img/racethumb/" + raceid + ".jpg";
    }
  }
})
