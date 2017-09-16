Array.prototype.removePlayer = function(player) {

  var index = this.findIndex(function(e) {
    return e.client.steamId === player.client.steamId;
  });

  if (index >= 0) this.splice(index, 1);
  return this;
}

'use strict';

const fs = require('fs');
const path = require('path');

module.exports = class Utility {

  static rreaddir(dir, done, filesOnly) {
    filesOnly = filesOnly || false;
    let pending = 0;
    let files = [];
    fs.readdir(dir, (err, list) => {
      if (err) {
        return done(err, files);
      }
      pending = list.length;

      list.forEach(f => {
        fs.stat(path.join(dir, f), (err, stat) => {
          if (err) {
            console.warn('skipping file because we couldnt stat it in rreaddir: ' + err);
            if (!pending--) {
              return done(undefined, files);
            }

            return;
          }

          if (stat.isDirectory()) {
            if (!filesOnly) {
              files.push(f);
            }

            Utility.rreaddir(f, (err, rlist) => {
              rlist.forEach(rf => files.push(rf));

              pending--;
              if (!pending) {
                return done(undefined, files);
              }
            }, filesOnly);
          } else {
            files.push(f);

            pending--;
            if (!pending) {
              return done(undefined, files);
            }
          }
        });
      });
    });
  }

  static hexToRGB(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return new RGB(r, g, b);
  }

  static randomColor() {
    return require('./utils/randomColor.js')();
  }

  static RGBToHex(rgb) {
    return '#' + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
  }

  static random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static SecondsToMs(n) {
    return 1000 * n;
  }

  static MinToMs(n) {
    return this.SecondsToMs(60) * n;
  }


  /**
   * Returns the player from his id or (part of his) Name
   *
   * @param  {string/number} idOrName Networkid or name of the player (or some digits of the name)
   * @param  {boolean=} [allowDuplicates=false] False: If multiple players have the same Name only the first one found is returned.
   *                      True: Returns an array with all duplicate players with the name
   * @param  {boolean=} [caseSensitive=false] True if case sensitive, false if not
   * @return {Player} An array with the players found with the id or the name,
   *          only contains the first one found if allowDuplicates was false, empty array if no player was found
   */
  static getPlayer(idOrName, opt_allowDuplicates, opt_caseSensitive) {
    let allowDuplicates = opt_allowDuplicates || false;
    let caseSensitive = opt_caseSensitive || false;
    let id = parseInt(idOrName);
    let fnCheck;

    if (typeof idOrName === 'undefined') {
      return [];
    }

    if (isNaN(id)) {
      if (caseSensitive === false) {
        idOrName = idOrName.toLowerCase();
      }

      // define fnCheck to check the players name
      fnCheck = target => {
        let targetName;
        if (caseSensitive === false) {
          //ignore capital letters
          targetName = target.escapedNametagName.toLowerCase();
        } else {
          // do not ignore capital letters
          targetName = target.escapedNametagName;
        }
        if (targetName.includes(idOrName)) {
          return true;
        }
        return false;
      };
    } else {
      fnCheck = target => target.client.networkId === id;
    }

    let playerArray = [];
    for (let i = 0; i < jcmp.players.length; i++) {
      const tempPlayer = jcmp.players[i];
      if (fnCheck(tempPlayer)) {
        playerArray.push(tempPlayer);
        if (allowDuplicates === false) {
          // exit the loop, because we just return the first player found
          break;
        }
      }
    }
    return playerArray;
  }

  /**
   * Loads all files from a directory recursively.
   *
   * @param {string} path - path to the directory
   */
  static loadFilesFromDirectory(path) {
    Utility.rreaddir(path, (err, list) => {
      if (err) {
        console.log(err);
        return;
      }
      list.forEach(f => {
        require(`${path}/${f}`);
      });
      console.info(`${list.length} files loaded from '${path}'.`);
    }, true);
  }

  static loadFilesFromDirectoryRace(path) {
    Utility.rreaddir(path, (err, list) => {
      if (err) {
        console.log(err);
        return;
      }
      list.forEach(f => {
        require(`${path}/${f}`);
        let topush = `${f}: require(${path}/${f});`;
        console.log(f);
        race.game.RaceList.push(topush);

      });
      console.info(`${list.length} files loaded from '${path}'.`);

    }, true);
  }
  static GetRaceData() {
    // thanks to lordFarquaad
    let basePath = __dirname + '/../RaceList/';

    Utility.rreaddir(basePath, function(err, filenames) {
      if (err) throw err;
      filenames.forEach(function(filename) {


        fs.readFile(basePath + filename, 'utf8', function(err, data) {

          if (err) throw err;
          let obj = JSON.parse(data);
          race.game.RaceList.push(obj);
        });
      })
      setTimeout(function() {
        if (race.game.RaceList.length == 0) {
          console.log(`[Race] [ERROR] No Race loaded!`);
        } else {
          console.log(`[Race] ${race.game.RaceList.length} Race loaded!`);
        }
      }, 500);
    });
  }
  /**
   * Checks if the given player is an admin on the server.
   *
   * @param {Player} player - the player to check
   */

  static randomSpawn(baseVec, radius) {
    const half = radius / 2;
    var posx = baseVec.x + race.utils.random(-half, half);
    var posy = baseVec.y;
    var posz = baseVec.z + race.utils.random(-half, half);

    return new Vector3f(posx, posy, posz);
  }

  /*static randomSpawn(baseVec, radius) {
    const half = radius / 2;
    return new Vector3f(baseVec.x + race.utils.random(-half, half), baseVec.y, baseVec.z + race.utils.random(-half, half));
  }*/

  static broadcastToLobby(msg) {
    for (let player of race.game.players.onlobby) {
      race.chat.send(player, msg);
    }
  }

  static inRangeOfPoint(ppos, bpos, radius) {
    return (Math.pow((ppos.x - bpos.x), 2) +
      Math.pow((ppos.y - bpos.y), 2) +
      Math.pow((ppos.z - bpos.z), 2) < Math.pow(radius, 2));
  }

  static findBySteamId(id) {
    var index = jcmp.players.map(function(player) {
      return player.client.steamId;
    }).indexOf(id);
    return jcmp.players[index];
  }

  /*static deleteFromArray(array, value) {
    index = array.indexOf(value);
    array.splice(index, 1);
  }*/

  static IsPointInCircle(v1, v2, radius) {
    //console.log(race.utils.GetDistanceBetweenPointsXY(v1, v2));
    /*if (race.utils.GetDistanceBetweenPointsXZ(v1, v2) <= radius) return true;
    return false;*/
    var comparation = (race.utils.GetDistanceBetweenPointsXZ(v1, v2) <= radius);
    return comparation;
  }

  static IsPointInCircleRender(v1, v2, radius) {

    var comparation = (race.utils.GetDistanceBetweenPointsXZ(v1, v2) <= radius * 0.95 / 2);
    return comparation;
  }

  static GetDistanceBetweenPoints(v1, v2) {
    let dx = v1.x - v2.x;
    let dy = v1.y - v2.y;
    let dz = v1.z - v2.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  static GetDistanceBetweenPointsXZ(v1, v2) {
    let v13f = new Vector3f(v1.x, 0.0, v1.z);
    let v14f = new Vector3f(v2.x, 0.0, v2.z);
    return race.utils.GetDistanceBetweenPoints(v13f, v14f);
  }

  static isAdmin(player) {
    return (race.config.admins.indexOf(player.client.steamId) !== -1);
  }





};
