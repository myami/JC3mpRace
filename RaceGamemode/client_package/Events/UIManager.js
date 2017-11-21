var menuvehicle = new WebUIWindow("race menuvehicle", "package://race/ui/menuvehicle.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
menuvehicle.autoResize = true;
var deathUI = new WebUIWindow("race deathui", "package://race/ui/deathui.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
deathUI.autoResize = true;
deathUI.captureMouseInput = false;
var text = new WebUIWindow("race text", "package://race/ui/text.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
text.autoResize = true;

var vote = new WebUIWindow("race vote", "package://race/ui/vote.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
vote.autoResize = true;

var adminchoice = new WebUIWindow("race adminchoice", "package://race/ui/admin.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
adminchoice.autoResize = true;

var leaderboard = new WebUIWindow("race leaderboard", "package://race/ui/leaderboard.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
adminchoice.autoResize = true;
var multicrew = new WebUIWindow("race multicrew", "package://race/ui/multicrew.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
multicrew.autoResize = true;

var lobbylist = new WebUIWindow("race lobbylist", "package://race/ui/lobby/lobbylist.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
lobbylist.autoResize = true;
var playerlist = new WebUIWindow("race playerlist", "package://race/ui/lobby/playerlist.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
playerlist.autoResize = true;
var playerlistlobby = new WebUIWindow("race playerlistlobby", "package://race/ui/lobby/playerlistlobby.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
playerlistlobby.autoResize = true;
var mapselect = new WebUIWindow("race mapselect", "package://race/ui/lobby/mapselect.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
mapselect.autoResize = true;
var typeselect = new WebUIWindow("race typeselect", "package://race/ui/lobby/typeselect.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
typeselect.autoResize = true;
