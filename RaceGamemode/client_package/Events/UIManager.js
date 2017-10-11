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
