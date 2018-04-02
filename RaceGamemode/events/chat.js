'use strict';

jcmp.events.Add('chat_message', (player, message) => {
  if (typeof player.race === 'undefined')
    return `${player.escapedNametagName}: ${message}`;

  console.log(`${player.escapedNametagName}: ${message}`);
  return `${race.utils.isAdmin(player) ? '<div class="admin-logo"></div>' : ''}[${player.race.colour}] ${player.escapedNametagName}[#FFFFFF]: ${message}`;
});

jcmp.events.AddRemoteCallable('chat_ready', player => {
  race.chat.send(player, 'Spawning might take a while. Please wait and enjoy the view.', race.config.colours.purple);

});
