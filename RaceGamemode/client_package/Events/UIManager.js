
var deathUI = new WebUIWindow("race deathui", "package://race/ui/deathui.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
deathUI.autoResize = true;
deathUI.captureMouseInput = false;
 // Lobby


var lobbylist = new WebUIWindow("ListOfLobby", "package://race/ui/lobby/MyamiLobby/LobbyList.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
lobbylist.autoResize = true;

var lobbyLoading = new WebUIWindow("LoadindPage", "package://race/ui/lobby/MyamiLobby/loading.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
lobbyLoading.autoResize = true;

var lobbyJoin = new WebUIWindow("LobbyJoin", "package://race/ui/lobby/MyamiLobby/LobbyJoin.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
lobbyJoin.autoResize = true;

var lobbyPlayerServer = new WebUIWindow("LobbyJoin", "package://race/ui/lobby/MyamiLobby/PlayerServer.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
lobbyPlayerServer.autoResize = true;


var Ingame = new WebUIWindow("Ingame", "package://race/ui/lobby/MyamiLobby/Ingame.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
Ingame.autoResize = true;
