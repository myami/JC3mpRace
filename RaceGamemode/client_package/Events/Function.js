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
    }

  };

  return playersCache[id];

}
