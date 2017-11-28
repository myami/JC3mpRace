var ctrlChooseRace = new Vue({
    el: '#chooseRace',
    data: {
        raceList: [],
        searchTrack: '',
        selectedTrack: 0
    },
    methods: {
        generateThumbUrl: generateThumbUrl,
        selectTrack: function(raceid, event) {
            this.selectedTrack = raceid;
            $(".selectedTrack").removeClass("selectedTrack");
            $(event.currentTarget).addClass("selectedTrack");
            
        }
    },
    watch: {
        searchTrack: function(val, oldVal) {
            //console.log(val);

            var findRaces = raceListExample.filter(function(e) {
                return e.name.toLowerCase().startsWith(val.toLowerCase());
            });

            console.log(findRaces);

            this.raceList = orderForChoose(findRaces, 3);
            this.selectedTrack = 0;
        }
    }
});

function orderForChoose(arr, chunk_size) {
    var groups = arr.map( function(e,i){ 
        return i%chunk_size===0 ? arr.slice(i,i+chunk_size) : null; 
    })
    .filter(function(e){ return e; });
    return groups;
}

// Code for example use

var raceListExample = [
    { raceid: 1, name: 'Island race', maxPlayers: 8, type: 'circuit', laps: 2 },
    { raceid: 1, name: 'Island race', maxPlayers: 8, type: 'circuit', laps: 2 },
    { raceid: 1, name: 'Island race', maxPlayers: 8, type: 'circuit', laps: 2 },
    { raceid: 1, name: 'Island race', maxPlayers: 8, type: 'circuit', laps: 2 },
    { raceid: 1, name: 'Hello', maxPlayers: 8, type: 'circuit', laps: 2 },
    { raceid: 1, name: 'Island race', maxPlayers: 8, type: 'circuit', laps: 2 },
    { raceid: 1, name: 'Helena race', maxPlayers: 8, type: 'circuit', laps: 2 },
    { raceid: 1, name: 'Hell race', maxPlayers: 8, type: 'circuit', laps: 2 },
    { raceid: 1, name: 'Island race', maxPlayers: 8, type: 'circuit', laps: 2 },
    { raceid: 1, name: 'History race', maxPlayers: 8, type: 'circuit', laps: 2 },
    { raceid: 1, name: 'Island race', maxPlayers: 8, type: 'circuit', laps: 2 },
    { raceid: 1, name: 'Island race', maxPlayers: 8, type: 'circuit', laps: 2 },
    { raceid: 1, name: 'Island race', maxPlayers: 8, type: 'circuit', laps: 2 },
    { raceid: 1, name: 'Island race', maxPlayers: 8, type: 'circuit', laps: 2 },
    { raceid: 1, name: 'Island race', maxPlayers: 8, type: 'circuit', laps: 2 },
    { raceid: 1, name: 'Island race', maxPlayers: 8, type: 'circuit', laps: 2 }
];

ctrlChooseRace.raceList = orderForChoose(raceListExample,3);
