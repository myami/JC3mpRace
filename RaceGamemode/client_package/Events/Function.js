function lerp(a, b, t) {
  return (a.add((b.sub(a)).mul(new Vector3f(t, t, t))));
}

function vq(v, q) {
  return vx(vy(v, q), q);
}

function vx(v, q) {
  return new Vector3f(v.x,
    v.y * Math.cos(q.x) + v.z * Math.sin(q.x),
    v.y * Math.sin(q.x) - v.z * Math.cos(q.x));
}

function vy(v, q) {
  return new Vector3f(v.x * Math.cos(q.y) + v.z * Math.sin(q.y),
    v.y, -v.x * Math.sin(q.y) + v.z * Math.cos(q.y));
}

function vz(v, q) {
  return new Vector3f(v.x * Math.cos(q.z) + v.y * Math.sin(q.z),
    v.x * Math.sin(q.z) - v.y * Math.cos(q.z),
    v.z);
}

function hex2rgba(colour) {
  colour = colour.replace('#', '');

  const r = parseInt(colour.substring(0, 2), 16);
  const g = parseInt(colour.substring(2, 4), 16);
  const b = parseInt(colour.substring(4, 6), 16);

  return new RGBA(r, g, b, 255);
}


function dist(start, end) {
  return end.sub(start).length;
}


function GetDistanceBetweenPoints(v1, v2) {
  let dx = v1.x - v2.x;
  let dy = v1.y - v2.y;
  let dz = v1.z - v2.z;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function GetDistanceBetweenPointsXY(v1, v2) {
  let v13f = new Vector3f(v1.x, v1.y, 0.0);
  let v14f = new Vector3f(v2.x, v2.y, 0.0);
  return GetDistanceBetweenPoints(v13f, v14f);
}

function IsPointInCircle(v1, v2, radius) {
  if (GetDistanceBetweenPointsXY(v1, v2) <= radius) return true;
  return false;
}

function createCache(id, name, colour,isadmin) {

  playersCache[id] = {
    id: id,
    name: name,
    colour: colour,
    colour_rgb: hex2rgba(colour),
    flags: {
      isAdmin: isadmin
    },
    nametag: {
      textMetric: null,
      textPos: null,
      shadowPos: null,
      iconPos: null,
      healthBarPos: null,
      healthBarBackPos: null,
      healthBarShadowPos: null
    }
  };

  return playersCache[id];

}


function RenderNametag(renderer, playerCache, distance) {

  if (typeof playerCache !== 'undefined') {
    let distscale = (distance * 2.4);

    // build the name metric if needed
    if (playerCache.nametag.textMetric === null) {

      const metric = renderer.MeasureText(playerCache.name, 100, 'Arial');
      playerCache.nametag.textMetric = metric;
      playerCache.nametag.textPos = new Vector3f(-(metric.x / 2), -400, 0);
      playerCache.nametag.shadowPos = new Vector3f(-(metric.x / 2) + 5, -395, 1);
      playerCache.nametag.iconPos = new Vector3f(-(metric.x / 2) - 100, -363, 0);

    }

    if (distscale >= 350) {
      distscale = 350;
    }
    // adjust position based on distance
    playerCache.nametag.textPos.y = (-400 + distscale);
    playerCache.nametag.shadowPos.y = (-395 + distscale);
    playerCache.nametag.iconPos.y = (-363 + distscale);

    // draw player name
    renderer.DrawText(playerCache.name, playerCache.nametag.textPos, nameTagTextSize, playerCache.colour_rgb, 100, 'Arial');
    renderer.DrawText(playerCache.name, playerCache.nametag.shadowPos, nameTagTextSize, black, 100, 'Arial');


  }
}
