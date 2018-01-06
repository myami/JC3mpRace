//POI
let pois = [];
let poisg = [];
//checkpoint
let chks = [];
let chksghost = [];
// player
let playeringame = false;
let countdowninprogress = false;
let playerpassager = false;
let typeofrace = undefined;
const playersCache = [];
//Spectator
let tracked_player = null;
let tracked_id = null;
let currentindex = 0;
let to_pos = new Vector3f(0, 0, 0);
let to_rot = new Vector3f(0, 0, 0);
let spectate = false;
let cameraview = false;
let cm_pos = new Vector3f(0, 0, 0);
// NameTags
const up = new Vector3f(0, 1, 0);
const scaleFactor = new Vector3f(0.0001, 0.0001, 0.0001);
const minScale = new Vector3f(0.001, 0.001, 0.001);
const maxScale = new Vector3f(0.008, 0.008, 0.008);
const maxScaleGroup = new Vector3f(0.014, 0.014, 0.014);
const nameTagTextSize = new Vector2f(100000, 1000000);
const healthBarSize = new Vector2f(394, 14);
const healthBarPos = new Vector3f(-(healthBarSize.x / 2), -277, 0);
const healthBarBackPos = new Vector3f(-(healthBarSize.x / 2), -277, 0.05);
const healthBarShadowSize = new Vector2f(400, 20);
const healthBarShadowPos = new Vector3f(-(healthBarShadowSize.x / 2), -280, 0.1);
// colours
const white = new RGBA(255, 255, 255, 255);
const black = new RGBA(0, 0, 0, 255);
const red = new RGBA(255, 0, 0, 255);
const darkred = new RGBA(40, 0, 0, 255);
