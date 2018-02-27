'use strict';

jcmp.events.AddRemoteCallable('CreateJsonFile_server', function(player, name) {
  var fs = require('fs');
  var Createfile = `{\n "Name": "RaceName" ,\n"NameWithoutSpace":"${name}",\n "VehicleType": "car",\n "time": {"hour":11 ,"minute":30},\n "weather": "base",\n "defaultVehicle": 0,\n "AddingYatrespawn": 0,\n "CheckpointHash":"0x301477DB",\n "ChekpointType":1,\n "PoiType":10,\n "GhostPOIType":23,\n "nitroenabled":true,\n "raceid":0,\n"multiplepath":false,\n "StartingPoint":[],\n "RaceCheckpoint":[]\n}`;

  if (!fs.existsSync(`./${name}.json`)) {
    fs.writeFileSync(`./${name}.json`, Createfile);
  } else {
    fs.appendFileSync(`./${name}.json`, Createfile);
  }


  createrace.chat.send(player, `Creating JSON file call ${name}`);
});

jcmp.events.AddRemoteCallable('Addname_server', function(player, namewithoutspace, name) {
  setTimeout(function() {
    var fs = require('fs');

    fs.readFile(`./${name}.json`, 'utf-8', function(err, data) {
      if (err) throw err

      var arrayOfObjects = JSON.parse(data)
      arrayOfObjects.Name = namewithoutspace;
      console.log(namewithoutspace);
      fs.writeFileSync(`./${name}.json`, JSON.stringify(arrayOfObjects, null, '\t'), 'utf-8', function(err) {
        if (err) throw err

      })
    })
    createrace.chat.send(player, `You just add the name with space : ${namewithoutspace}`);

  }, 2000);

});

jcmp.events.AddRemoteCallable('Add_vehicle_type_server', function(player, vehicle, name) {

  var fs = require('fs');

  fs.readFile(`./${name}.json`, 'utf-8', function(err, data) {
    if (err) throw err

    var arrayOfObjects = JSON.parse(data)
    arrayOfObjects.VehicleType = vehicle;
    fs.writeFileSync(`./${name}.json`, JSON.stringify(arrayOfObjects, null, '\t'), 'utf-8', function(err) {
      if (err) throw err

    })

  })
  createrace.chat.send(player, `You just add the vehicle type : ${vehicle}`);

});
jcmp.events.AddRemoteCallable('AddVehicleSimpleBasic_server', function(player, type, name) {

  var fs = require('fs');

  fs.readFile(`./${name}.json`, 'utf-8', function(err, data) {
    if (err) throw err

    var arrayOfObjects = JSON.parse(data)
    arrayOfObjects.defaultVehicle = createrace.config.defaulthash[type];
    fs.writeFileSync(`./${name}.json`, JSON.stringify(arrayOfObjects, null, '\t'), 'utf-8', function(err) {
      if (err) throw err

    })

  })
  createrace.chat.send(player, `You just add the vehicle type : ${type} with the default hash : ${createrace.config.defaulthash[type]}`);

});


jcmp.events.AddRemoteCallable('Add_Minute_seconds_server', function(player, hour, minute, name) {

  var fs = require('fs');

  fs.readFile(`./${name}.json`, 'utf-8', function(err, data) {
    if (err) throw err

    var arrayOfObjects = JSON.parse(data)
    arrayOfObjects.time.hour = hour,
      arrayOfObjects.time.minute = minute


    fs.writeFileSync(`./${name}.json`, JSON.stringify(arrayOfObjects, null, '\t'), 'utf-8', function(err) {
      if (err) throw err

    })

  })
  createrace.chat.send(player, `You have set the time for the race to ${hour} hours and ${minute} minute`);

});

jcmp.events.AddRemoteCallable('Add_Weather_server', function(player, weather, name) {

  var fs = require('fs');

  fs.readFile(`./${name}.json`, 'utf-8', function(err, data) {
    if (err) throw err

    var arrayOfObjects = JSON.parse(data)
    arrayOfObjects.weather = weather;
    fs.writeFileSync(`./${name}.json`, JSON.stringify(arrayOfObjects, null, '\t'), 'utf-8', function(err) {
      if (err) throw err

    })

  })
  createrace.chat.send(player, `You just set the weather to ${weather}`);

});

jcmp.events.AddRemoteCallable('Add_vehicle_hash_server', function(player, hash, name) {

  var fs = require('fs');

  fs.readFile(`./${name}.json`, 'utf-8', function(err, data) {
    if (err) throw err

    var arrayOfObjects = JSON.parse(data)
    arrayOfObjects.defaultVehicle = hash;
    fs.writeFileSync(`./${name}.json`, JSON.stringify(arrayOfObjects, null, '\t'), 'utf-8', function(err) {
      if (err) throw err

    })

  })
  createrace.chat.send(player, `You just set the defaultVehicle hash to ${hash}`);

});

jcmp.events.AddRemoteCallable('Add_Yatrespawn_server', function(player, yatrespawn, name) {

  var fs = require('fs');

  fs.readFile(`./${name}.json`, 'utf-8', function(err, data) {
    if (err) throw err

    var arrayOfObjects = JSON.parse(data)
    arrayOfObjects.AddingYatrespawn = yatrespawn;
    fs.writeFileSync(`./${name}.json`, JSON.stringify(arrayOfObjects, null, '\t'), 'utf-8', function(err) {
      if (err) throw err

    })

  })
  createrace.chat.send(player, `You just set the Yatrespawn to ${yatrespawn}`);

});

jcmp.events.AddRemoteCallable('Add_CheckpointHash_server', function(player, checkpointhash, name) {

  var fs = require('fs');

  fs.readFile(`./${name}.json`, 'utf-8', function(err, data) {
    if (err) throw err

    var arrayOfObjects = JSON.parse(data)
    arrayOfObjects.CheckpointHash = checkpointhash;
    fs.writeFileSync(`./${name}.json`, JSON.stringify(arrayOfObjects, null, '\t'), 'utf-8', function(err) {
      if (err) throw err

    })

  })
  createrace.chat.send(player, `You just set the checkpoint hash to ${checkpointhash}`);

});

jcmp.events.AddRemoteCallable('Add_CheckpointType_server', function(player, checkpointtype, name) {

  var fs = require('fs');

  fs.readFile(`./${name}.json`, 'utf-8', function(err, data) {
    if (err) throw err

    var arrayOfObjects = JSON.parse(data)
    arrayOfObjects.ChekpointType = checkpointtype;
    fs.writeFileSync(`./${name}.json`, JSON.stringify(arrayOfObjects, null, '\t'), 'utf-8', function(err) {
      if (err) throw err

    })

  })
  createrace.chat.send(player, `You just set the checkpoint type to ${checkpointtype}`);

});

jcmp.events.AddRemoteCallable('Add_PoiType_server', function(player, poitype, name) {

  var fs = require('fs');

  fs.readFile(`./${name}.json`, 'utf-8', function(err, data) {
    if (err) throw err

    var arrayOfObjects = JSON.parse(data)
    arrayOfObjects.PoiType = poitype;
    fs.writeFileSync(`./${name}.json`, JSON.stringify(arrayOfObjects, null, '\t'), 'utf-8', function(err) {
      if (err) throw err

    })

  })
  createrace.chat.send(player, `You just set the PoiType to ${poitype}`);

});

jcmp.events.AddRemoteCallable('Add_GhostPoiType_server', function(player, ghostpoitype, name) {

  var fs = require('fs');

  fs.readFile(`./${name}.json`, 'utf-8', function(err, data) {
    if (err) throw err

    var arrayOfObjects = JSON.parse(data)
    arrayOfObjects.GhostPOIType = ghostpoitype;
    fs.writeFileSync(`./${name}.json`, JSON.stringify(arrayOfObjects, null, '\t'), 'utf-8', function(err) {
      if (err) throw err

    })

  })
  createrace.chat.send(player, `You just set the ghostpoitype to ${ghostpoitype}`);

});

jcmp.events.AddRemoteCallable('Add_NitroChange_server', function(player, nitro, name) {

  var fs = require('fs');

  fs.readFile(`./${name}.json`, 'utf-8', function(err, data) {
    if (err) throw err

    var arrayOfObjects = JSON.parse(data)
    arrayOfObjects.nitroenabled = nitro;
    fs.writeFileSync(`./${name}.json`, JSON.stringify(arrayOfObjects, null, '\t'), 'utf-8', function(err) {
      if (err) throw err

    })

  })
  createrace.chat.send(player, `You just set the nitro to ${nitro}`);

});

jcmp.events.AddRemoteCallable('Add_MaxPlayer_server', function(player, maxplayer, name) {

  var fs = require('fs');

  fs.readFile(`./${name}.json`, 'utf-8', function(err, data) {
    if (err) throw err

    var arrayOfObjects = JSON.parse(data)
    arrayOfObjects.max_player = maxplayer;
    fs.writeFileSync(`./${name}.json`, JSON.stringify(arrayOfObjects, null, '\t'), 'utf-8', function(err) {
      if (err) throw err

    })

  })
  createrace.chat.send(player, `You just set the max player of the race to ${maxplayer}`);

});

jcmp.events.AddRemoteCallable('CreateStartingPoint_server', function(player, name) {
  jcmp.events.CallRemote('Creating_POI_startingPoint', player, JSON.stringify(player.position));

  var fs = require('fs');

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


    fs.writeFileSync(`./${name}.json`, JSON.stringify(arrayOfObjects, null, '\t'), 'utf-8', function(err) {
      if (err) throw err

    })

  });
  createrace.startingpointlength ++ ;
  createrace.chat.send(player, `You just set a new StartingPoint ${createrace.startingpointlength}`);

});

jcmp.events.AddRemoteCallable('CreateCheckpoint_server', function(player, name,cameraposition,camerarotation) {
let camera = JSON.parse(cameraposition);
let camerar = JSON.parse(camerarotation);
  var fs = require('fs');

  fs.readFile(`./${name}.json`, 'utf-8', function(err, data) {
    if (err) throw err


    var arrayOfObjects = JSON.parse(data)
    arrayOfObjects.RaceCheckpoint.push({
      x: camera.x,
      y: camera.y,
      z: camera.z,
      rotx: camerar.x,
      roty: camerar.y,
      rotz: camerar.z,
      id: createrace.id
    })
    jcmp.events.CallRemote('Creating_checkpoint', player, createrace.id);
    createrace.id++;
    fs.writeFileSync(`./${name}.json`, JSON.stringify(arrayOfObjects, null, '\t'), 'utf-8', function(err) {
      if (err) throw err

    })

  });
  createrace.checkpointlength ++ ;
  createrace.chat.send(player, `You just set a checkpoint ${createrace.checkpointlength}`);

});
jcmp.events.AddRemoteCallable('CreateCamera_server', function(player, name,cameraposition,camerarotation) {
let camera = JSON.parse(cameraposition);
let camerar = JSON.parse(camerarotation);
  var fs = require('fs');

  fs.readFile(`./${name}.json`, 'utf-8', function(err, data) {
    if (err) throw err


    var arrayOfObjects = JSON.parse(data)
    arrayOfObjects.CameraView.push({
      x: camera.x,
      y: camera.y,
      z: camera.z,
      rotx: camerar.x,
      roty: camerar.y,
      rotz: camerar.z,
      id: createrace.id
    })
      jcmp.events.CallRemote('Creating_POI_startingPoint', player, JSON.stringify(camera));
    createrace.id++;
    fs.writeFileSync(`./${name}.json`, JSON.stringify(arrayOfObjects, null, '\t'), 'utf-8', function(err) {
      if (err) throw err

    })

  })
  createrace.chat.send(player, `You just set a CameraView`);

});



jcmp.events.AddRemoteCallable('RaceIdNumber_server', function(player, number, name) {

  var fs = require('fs');

  fs.readFile(`./${name}.json`, 'utf-8', function(err, data) {
    if (err) throw err

    var arrayOfObjects = JSON.parse(data)
    arrayOfObjects.raceid = number;
    fs.writeFileSync(`./${name}.json`, JSON.stringify(arrayOfObjects, null, '\t'), 'utf-8', function(err) {
      if (err) throw err

    })

  })
  createrace.chat.send(player, `You just set the id of the race : ${number}`);

});

jcmp.events.AddRemoteCallable('MulticrewChange_server', function(player, bool, name) {

  var fs = require('fs');

  fs.readFile(`./${name}.json`, 'utf-8', function(err, data) {
    if (err) throw err

    var arrayOfObjects = JSON.parse(data)
    arrayOfObjects.multiplepath = bool;
    fs.writeFileSync(`./${name}.json`, JSON.stringify(arrayOfObjects, null, '\t'), 'utf-8', function(err) {
      if (err) throw err

    })

  })
  createrace.chat.send(player, `You just set the multicrew to ${number}`);

});


jcmp.events.Add('PlayerReady', function(player) {

player.respawnPosition = new Vector3f(957,1617,-5782);

  player.Respawn();





});


jcmp.events.Add('PlayerDeath', function(player, killer, reason) {
player.Respawn();

  }


);
