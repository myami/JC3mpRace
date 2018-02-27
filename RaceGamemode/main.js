

global.race = {
  commands: jcmp.events.Call('get_command_manager')[0],
  chat: jcmp.events.Call('get_chat')[0],
  config: require('./gm/config'),
  utils: require('./gm/utility'),
  workarounds: require('./gm/_workarounds'),
  workarounds2: require('./gm/_workarounds2.js'),
  RaceBeta: require('./gm/raceBeta.js'),
  game: {
    players: {
      onlobby: [],
      ingame: []
    },
    lobbys:[],
    lobbycount:0,
    toStart: false,
    StartTimer: null,
    TimerArea: 2,
    games: [],
    gamesCount: 0,
    RaceList: [],
    timeToStart: 0,
    RacePeopleDie: [],
    RaceLaunch: true

  }
};



process.on('uncaughtException', e => console.error(e.stack || e));


// load all commands from the 'commands' directory
race.commands.loadFromDirectory(`${__dirname}/commands`, (f, ...a) => require(f)(...a));
// load all event files from the 'events' directory
race.utils.loadFilesFromDirectory(`${__dirname}/events`);

race.utils.GetRaceData();



setTimeout(function() {
  for (var i = 0; i < race.game.RaceList.length; i++) {
    console.log(`Index: ${i} , Name of the race: ${race.game.RaceList[i].Name}`);
  }
}, 1000);

setInterval(function() {
  race.chat.broadcast("[SERVER] Press 'E' if you're vehicle is destroy or blocked it will tp you to the last checkpoint or press 'B'and wait a few seconds ");
}, 500000);
