
jcmp.events.Add('Kart_Race_Checkpoint', function(player) {
  const Race = player.race.game;
  const partner = player.race.partnerplayer[0];
  if (player.race.partnerplayer[0].name == player.name) { // no checkpoint for the driver
    return;
  }
  let checkpointcoordinate = new Vector3f(Race.raceCheckpoint[player.race.checkpoints].x, Race.raceCheckpoint[player.race.checkpoints].y + Race.AddingYatrespawn, Race.raceCheckpoint[player.race.checkpoints].z);
  player.respawnPosition = race.utils.randomSpawn(checkpointcoordinate, 10);
  partner.respawnPosition = race.utils.randomSpawn(checkpointcoordinate, 10);
  player.race.playerrotationspawn = new Vector3f(Race.raceCheckpoint[player.race.checkpoints].rotx, Race.raceCheckpoint[player.race.checkpoints].roty, Race.raceCheckpoint[player.race.checkpoints].rotz);
  player.race.checkpoints++;

  if (player.race.checkpoints == Race.raceCheckpoint.length) { // if it's egal it's mean it's the last checkpoint
    race.chat.send(player, "[SERVER] You finished the race! Well done!!");
    jcmp.events.Call('Kart_race_end_point', player);
    return;
    // whas last checkpoint
  }
  if (player.race.checkpoints == Race.raceCheckpoint.length - 1) { // last checkpoint
    let lastnextcheckpoint = Race.raceCheckpoint[player.race.checkpoints];
    jcmp.events.CallRemote('race_checkpoint_client', player, JSON.stringify(lastnextcheckpoint), Race.id, Race.PoiType, Race.checkpointhash, Race.ChekpointType);
    console.log("last checkpointMC");
    jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
    jcmp.events.CallRemote('Checkpoint_current_client', partner, player.race.checkpoints);
    return;
    // change the poi text to last checkpoint
  }
  RandomBonus(player); // here for now will be replace per gameobject
  let positionnextcheckpoint = Race.raceCheckpoint[player.race.checkpoints];
  let positionghostcheckpoint = Race.raceCheckpoint[player.race.checkpoints + 1];
  jcmp.events.CallRemote('race_checkpoint_client', player, JSON.stringify(positionnextcheckpoint), Race.id, Race.PoiType, Race.checkpointhash, Race.ChekpointType, JSON.stringify(positionghostcheckpoint));
  jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
  jcmp.events.CallRemote('Checkpoint_current_client', partner, player.race.checkpoints);


});


jcmp.events.Add('Kart_race_end_point', function(player) {

  player.race.hasfinish = true;
  const Race = player.race.game;
  clearInterval(player.race.timerinterval);

  if (Race.type == "apo"){ // for just one line don't need to create a new checkpoint system and endpoint
    clearInterval(Race.intervalapo);
  }

  Race.leaderboard.push(player);
  let playern = player.networkId;
  Race.players.forEach(player => {
    if (player.race.ingame)
      Race.leaderboard = player.race.game.leaderboard;
  })

  for (var i = 0; i < Race.leaderboard.length; i++) {
    const player = Race.leaderboard[i];

    if (player.networkId == playern) {
      let leaderboardplace = i + 1;
      // send the leaderboardplace to the client
      let minute = Math.floor(player.race.time / 60);
      let seconds = player.race.time % 60
      let playername = player.name;
      race.chat.broadcast(`[SERVER] ${playername} is ${leaderboardplace} with a time of ${minute} minutes and ${seconds} seconds!`, race.config.colours.red);
      jcmp.events.CallRemote('Player_data_Announce', player, leaderboardplace, player.race.time);
      Race.UpdateEndLeaderboard(playername, leaderboardplace, minute, seconds);
      setTimeout(function() {
        jcmp.events.Call('race_player_leave_game', player)
        player.race.time = 0;
      }, 2000);

    }

  }

});


function RandomBonus(player){
// take a random number between 0 and 1 if it's one give a bonus to the player
  let playerchance = race.utils.random(0,1);
  if (playerchance == 1 ){
    // player have a bonus
    let bonusindex = race.utils.random(0,race.Bonus.length);
    let bonus = race.Bonus[bonusindex];
    race.chat.send(player,`You just have ${bonus} as bonus press K to launch it`);
    player.race.bonus = bonus;
  }
  else{
    // no bonus
  }

}

jcmp.events.AddRemoteCallable('BonusLaunch', function(player) { // K button for launching bonus
  if(player.race.bonus == ""){
    return race.chat.send(player,"You have no bonus")
  }
  if (player.race.bonus == "AllDie"){
    AllDie(player);
  }
  if (player.race.bonus == "DiePlayerAround"){
    DiePlayerAround(player);
  }
  if (player.race.bonus == "LaunchBomb"){
    LaunchBomb(player);
  }
  if (player.race.bonus == "SlowAll"){
    SlowAll(player);
  }
  if (player.race.bonus == "SpeedBoost"){
    SpeedBoost(player);
  }


});

function AllDie(player){
  const Race = player.race.game;
    for (var i = 0; i < Race.players.length; i++) {
      const playertarget = Race.player[i];
      if (playertarget.networkId != player.networkId){
        playertarget.health = 0;
        race.chat.send(playertarget,`${player.name} Have launch on everyone the AllDie Bonus`);
      }
    }
    player.race.bonus = "";
}
function DiePlayerAround(player){
  const Race = player.race.game;
  for (var i = 0; i < Race.players.length; i++) {
    const playertarget = Race.player[i];
      if(race.utils.IsPointInCircle(playertarget.position,player.position,30)){ // 30 is the radius
        playertarget.health = 0;
          race.chat.send(playertarget,`${player.name} Have launch the bonus DiePlayerAround and you was closed to him`);
      }

  }
player.race.bonus = "";
}

function LaunchBomb(player){
  let gameobjectposition = new Vector3f(player.position.x +10,player.position.y + 5 ,player.position.z +5)
  let object = new GameObject('barrel',gameobjectposition);
  object.ApplyForce(new Vector3f(10, 5, 5), 1); // Not sure for the number should spawn on the front of the player vehicle and go in front like a golf ball
  player.race.bonus = "";
}
function SlowAll(player){
  const Race = player.race.game;
  for (var i = 0; i < Race.players.length; i++) {
    const playertarget = Race.player[i];
      if (playertarget.networkId != player.networkId){
        //https://just-cause.mp/docs/server/classes/CarHandlingEngine
        // then settimeout to set it to default after a few seconds
      }

  }
  player.race.bonus = "";
}
function SpeedBoost(player){
  //player.vehicle
  // https://just-cause.mp/docs/server/classes/CarHandlingEngine
  // then settimeout to set it to default after a few seconds
  player.race.bonus = "";
}
