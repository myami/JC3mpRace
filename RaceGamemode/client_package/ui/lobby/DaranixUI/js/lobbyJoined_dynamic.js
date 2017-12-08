function leaveLobby() {
    $("#lobbyJoined").modal('hide');

    $("#lobbyMain").modal({
        backdrop: 'static',
        keyboard: false
    });

    //jcmp.CallEvent('onLeaveLobby');
}

var ctrlLobbyJoined = new Vue({
    el: '#ctrlJoined',
    data: {
        imhost: true,
        playerList: [],
        map: {}
    },
    methods: {
        lobbyKick: function(networkId) {
            // Event to kick the player
            //jcmp.CallEvent('KickPlayer',networkId);
        },
        generateThumbUrl: generateThumbUrl,
        startRace: function() {
            // Event to start the race
            //jcmp.CallEvent('LaunchRace');
        },
        chooseRace: function() {
            // Load modal with the races on the game
            $("#chooseRace").modal('show');
        }
    }
});

// This is for example purposes ONLY
var examplePlayerList = [
    {name: 'Daranix', isyou: true, networkId: 1},
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Test', isyou: false, networkId: 3 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 },
    {name: 'Peter', isyou: false, networkId: 2 }
];

ctrlLobbyJoined.playerList = examplePlayerList;
ctrlLobbyJoined.map = {
        raceid: 1,
        name: 'Island race',
        maxPlayers: 8,
        type: 'circuit',
        laps: 2
}
