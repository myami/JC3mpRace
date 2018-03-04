var deathUI = new WebUIWindow("Race/DeathUI", "package://race/ui/deathui.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
deathUI.autoResize = true;
deathUI.captureMouseInput = false;





 // Lobby


var lobbylist = new WebUIWindow("Race/ListOfLobby", "package://race/ui/lobby/MyamiLobby/LobbyList.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
lobbylist.autoResize = true;

var lobbyLoading = new WebUIWindow("Race/LoadingPage", "package://race/ui/lobby/MyamiLobby/loading.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
lobbyLoading.autoResize = true;

var lobbyJoin = new WebUIWindow("Race/LobbyJoin", "package://race/ui/lobby/MyamiLobby/LobbyJoin.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
lobbyJoin.autoResize = true;

var lobbyPlayerServer = new WebUIWindow("Race/LobbyJoin", "package://race/ui/lobby/MyamiLobby/PlayerServer.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
lobbyPlayerServer.autoResize = true;


var Ingame = new WebUIWindow("Race/InGame", "package://race/ui/lobby/MyamiLobby/Ingame.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
Ingame.autoResize = true;

var MapSelect = new WebUIWindow("Race/MapSelect", "package://race/ui/lobby/MyamiLobby/MapSelect.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
MapSelect.autoResize = true;

var TypeSelect = new WebUIWindow("Race/TypeSelect", "package://race/ui/lobby/MyamiLobby/TypeSelect.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
TypeSelect.autoResize = true;
