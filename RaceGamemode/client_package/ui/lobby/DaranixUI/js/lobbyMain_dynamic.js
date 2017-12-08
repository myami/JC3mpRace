// -- All dynamic elements rendered on the modal 'Lobby main' -- //

var lobbyMain = new Vue({
    el: '#lobbyList',
    data: {
        lobbies: [],
        currentSelected: null,
        oldSelected: null
    },
    methods: {
        selectRace: function(raceid, event) {
            this.currentSelected = raceid;
            $("#btnJoin").removeAttr("disabled");
            this.oldSelected = event.currentTarget;
        },
        generateThumbUrl: generateThumbUrl
    }
});

function joinLobby() {

    $("#lobbyMain").modal('hide');

    $("#lobbyJoined").modal({
        backdrop: 'static',
        keyboard: false
    });

}

// Example for design purposes

var exampleLobbies = [
    {raceid: 1, hostName: 'Daranix', players: 1, maxPlayers: 8, mapname: 'Island race'},
    {raceid: 1, hostName: 'Daranix', players: 1, maxPlayers: 8, mapname: 'Island race'},
    {raceid: 1, hostName: 'Daranix', players: 1, maxPlayers: 8, mapname: 'Island race'},
    {raceid: 1, hostName: 'Daranix', players: 1, maxPlayers: 8, mapname: 'Island race'},
    {raceid: 1, hostName: 'Daranix', players: 1, maxPlayers: 8, mapname: 'Island race'},
    {raceid: 1, hostName: 'Daranix', players: 1, maxPlayers: 8, mapname: 'Island race'},
    {raceid: 1, hostName: 'Daranix', players: 1, maxPlayers: 8, mapname: 'Island race'},
    {raceid: 1, hostName: 'Daranix', players: 1, maxPlayers: 8, mapname: 'Island race'},
    {raceid: 1, hostName: 'Daranix', players: 1, maxPlayers: 8, mapname: 'Island race'}
];
// when creating a lobby push into the lobby var the raceid,hostname,numberof player ,max players and mapname

lobbyMain.lobbies = exampleLobbies;
