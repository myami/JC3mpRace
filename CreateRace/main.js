

global.createrace = {
    commands: jcmp.events.Call('get_command_manager')[0],
    chat: jcmp.events.Call('get_chat')[0],
    utils: require('./gm/utility'),
    id : 0

};



process.on('uncaughtException', e => console.error(e.stack || e));


// load all commands from the 'commands' directory
createrace.commands.loadFromDirectory(`${__dirname}/commands`, (f, ...a) => require(f)(...a));
// load all event files from the 'events' directory
createrace.utils.loadFilesFromDirectory(`${__dirname}/events`);
