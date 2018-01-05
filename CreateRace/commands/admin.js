'use strict';

module.exports = ({
  Command,
  manager
}) => {
  manager.category('admin', 'sample commands for creating race')

    .add(new Command('startingpoint').description('Save a position to file for starting point').parameter('name', 'string', 'Name of the race').handler(function(player, name) {
      var fs = require('fs');
      jcmp.events.CallRemote('Creating_POI_startingPoint', player, JSON.stringify(player.position));

      fs.readFile(`./${name}.json`, 'utf-8', function(err, data) {
        if (err) throw err

        var arrayOfObjects = JSON.parse(data)
        arrayOfObjects.StartingPoint.push({
          x: player.position.x,
          y: player.position.y,
          z: player.position.z,
          rotx: player.rotation.x,
          roty: player.rotation.y,
          rotz: player.rotation.z
        })

        console.log(arrayOfObjects)

        fs.writeFile(`./${name}.json`, JSON.stringify(arrayOfObjects, null, '\t'), 'utf-8', function(err) {
          if (err) throw err
          console.log('Done!')
        })
      })

      jcmp.events.Call('toast_show', null, {
        heading: 'Add Startingpoint',
        text: `You just add a startingpoint on the race: ${name}`,
        icon: 'info',
        loader: true,
        loaderBg: '#9EC600',
        position: 'top-right',
        hideAfter: 5000
      });
      createrace.chat.send(player, "Position saved sucesfully");
    }))

    .add(new Command('checkpoint').description('Save a position to file for checkpoint').parameter('name', 'string', 'Name of the race').handler(function(player, name) {
        jcmp.events.CallRemote('CreateCheckpointFromCommands', player, name);

    }))




    .add(new Command('resetraceid').description('Reset the race id for checkpoint').handler(function(player) {

      createrace.id = 0;
      jcmp.events.Call('toast_show', null, {
        heading: 'ID reset',
        text: "You have reset the id",
        icon: 'info',
        loader: true,
        loaderBg: '#9EC600',
        position: 'top-right',
        hideAfter: 5000
      });
      createrace.chat.send(player, "ID changed to 0");
    }))

    .add(new Command('CreateStartingPoint').description('Create starting point').parameter('column', 'number', 'columns to spawn').parameter('height', 'number', 'height to spawn').parameter('offsetx', 'number', 'offset on X').parameter('offsetz', 'number', 'offset on Z').parameter('hash', 'number', 'vehicle hash').handler(function(player, column, height, offsetx, offsetz, hash) {
      let columns = column;
      let heights = height;
      let offsetxs = offsetx;
      let offsetzs = offsetz;
      for (var c = 0; c < columns; c++) {
        for (var h = 0; h < heights; h++) {
          let carposition = new Vector3f(player.position.x + offsetxs * c, player.position.y, player.position.z + offsetzs * h);
          let rotation = new Vector3f(player.rotation.x, player.rotation.y, player.rotation.z);
          const vehicle = new Vehicle(hash, carposition, rotation);
        }
      }

    }))
    .add(new Command('ShowMenu').description('Start the processus of creating a race').handler(function(player) {
      jcmp.events.CallRemote('ShowMenuServer', player);
      createrace.id = 0;

    }))

    .add(new Command('respawn').description('Respawn').handler(function(player) {
    player.Respawn();

    }))
    .add(new Command('HideMenu').description('Hide the menu').handler(function(player) {
      jcmp.events.CallRemote('HideMenuServer', player);

    }))
	  .add(new Command('saveposp').description('Save a position to file').handler(function(player) {

  var fs = require('fs');
 var text = `"x": ${player.position.x},"y": ${player.position.y},"z": ${player.position.z},"rotx": ${player.rotation.x},"roty": ${player.rotation.y},"rotz": ${player.rotation.z}`;
  if(!fs.existsSync('./saveposp.txt')) {
    fs.writeFileSync("./saveposp.txt", text + ",\n");
  } else {
    fs.appendFileSync("./saveposp.txt", text+ ",\n");
  }
}))



    .add(new Command('CreateFile').description('Create the Json file ').parameter('name', 'string', 'Name of the race without space').handler(function(player, name) {
      var fs = require('fs');
      var Createfile = `{\n "Name": "" \n,"NameWithoutSpace":"${name}",\n "VehicleType": "car",\n "time": {"hours":11 ,"minute":30},\n "weather": "base",\n "defaultVehicle": 0,\n "AllDefault":true,\n "AddingYatrespawn": 0,\n "CheckpointHash":"0x301477DB",\n "ChekpointType":1,\n "PoiType":10,\n "GhostPOIType":23,\n "nitroenabled":true,\n "max_player":20,\n "StartingPoint":[],\n "RaceCheckpoint":[]\n}`;

      if (!fs.existsSync(`./${name}.json`)) {
        fs.writeFileSync(`./${name}.json`, Createfile);
      } else {
        fs.appendFileSync(`./${name}.json`, Createfile);
      }
      jcmp.events.Call('toast_show', null, {
        heading: 'Create file',
        text: `You just create the file race call ${name}`,
        icon: 'info',
        loader: true,
        loaderBg: '#9EC600',
        position: 'top-right',
        hideAfter: 5000
      });
      createrace.chat.send(player, `Creating JSON file call ${name}`);
    }))


};
