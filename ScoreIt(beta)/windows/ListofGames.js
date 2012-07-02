/**
 * @author Yakira Bristol
 */
(function() {
	ScoreIt.ui.createGamesWindow = function() {
		var baseRow = {
			hasChild : false,
			color : '#000',
			backgroundColor : '#fff',
			font : {
				fontWeight : 'bold'
			}
		};
		baseRow[ScoreIt.ui.backgroundSelectedProperty + 'Color'] = ScoreIt.ui.backgroundSelectedColor;

		var createGameRow = function(params) {
			return ScoreIt.extend(Ti.UI.createTableViewRow(params), baseRow);
		};
		/*
		 var row = Ti.UI.createTableViewRow();
		 var sview = Ti.UI.createView();
		 var label = Ti.UI.createLabel({
		 text: 'This is a test row'
		 });
		 sview.add(label);
		 row.add(sview);*/

		var games = [];
		var data = [];

		for(var i = 0; i < 4; i++) {
			var title = 'Game ' + (i + 1);
			var row = Ti.UI.createTableViewRow({
				id : title,
				height : 65
			});
			var sview = Ti.UI.createView({
				backgroundImage : ScoreIt.path.R + 'nimages/lback.png',
				left : 10,
				right : 10,
				top : 5,
				bottom : 5,
				borderRadius : 5
			});
			var label = Ti.UI.createLabel({
				text : title,
				color : 'white',
				bottom : 30,
				left : 10
			});

			var date = Ti.UI.createLabel({
				text : 'May 7, 2012',
				color : 'white',
				top : 20,
				left : 10
			});
			sview.add(label);
			sview.add(date);
			row.add(sview);

			data[i] = row;
		}
		/*
		 var data = [
		 createGameRow({title: 'Game 1'}),
		 createGameRow({title: 'Game 2'}),
		 createGameRow({title: 'Game 3'}),
		 createGameRow({title: 'Game 4'}),
		 row
		 ];*/

		var gamesWindow = Ti.UI.createWindow({
			id : 'win1',
			title : 'Available Games',
			barColor : '#414444',
			navBarHidden : false,
			backgroundImage : 'nimages/woodb.png'
		});
		var tableView = Ti.UI.createTableView({
			top : 80,
			backgroundColor : 'transparent',
			separatorColor : 'transparent'
		});
		gamesWindow.add(tableView);

		var gamesButton = Ti.UI.createButton({
			title : 'Get Games',
			width : '100dp',
			height : '40dp',
			top : 20
		});
		/*gamesButton.addEventListener('click', function(){
		var date = new Date();
		var startd = new Date(date.getFullYear(), date.getMonth() - date.getMonth(), 1);
		var endd = new Date(date.getFullYear(), date.getMonth() + 4, date.getDate());

		//alert('Start: \n' + startd + '\nEnd: \n' + endd);

		ScoreIt.gamesList(startd, endd);

		var gstatus = Ti.App.Properties.getString('glresult');
		if(gstatus == 'error'){
		alert(Ti.App.Properties.getString('glerror'));
		}

		games = Ti.App.Properties.getList('games');

		if(games.length == 0){
		alert('There are no games to display');
		}else {
		for(var i = 0; i < games.length; i++){
		var game = games[i];

		var title = '' + game.homeTeam.teamName + ' vs ' + game.awayTeam.teamName + '';

		var grow = Ti.UI.createTableViewRow({
		id: game.gameId,
		name: title,
		height: 65
		});

		var gtime = game.time;
		//var da = '' + gtime.substring(0,4) + '.' + gtime.substring(5,7) + '.' + gtime.substring(8,10) + '';
		var time = gtime.substring(12,16);
		var d = new Date(gtime.substring(0,4), gtime.substring(5,7), gtime.substring(8,10));
		var da = '' + d.toDateString().substring(4,8) + ' '
		+ d.toDateString().substring(8,11) + ' ' + d.toDateString().substring(11,15) + '';
		//alert('The date: ' + d);
		var gdate = '' + da + ' ' + time + ' ' + game.venue;

		var sview = Ti.UI.createView({
		backgroundImage: ScoreIt.path.R + 'nimages/lback.png',
		left: 10,
		right: 10,
		top: 5,
		bottom: 5,
		borderRadius: 5
		});
		var label = Ti.UI.createLabel({
		text: title,
		color: 'white',
		//backgroundColor: 'white',
		bottom: 30,
		left: 10
		});

		var date = Ti.UI.createLabel({
		text: gdate,
		color: 'white',
		top: 20,
		left: 10
		});
		sview.add(label);
		sview.add(date);
		grow.add(sview);

		tableView.appendRow(grow);
		}

		gamesButton.enabled = false;
		}

		});*/

		//gamesWindow.add(gamesButton);

		var date = new Date();
		var startd = new Date(date.getFullYear(), date.getMonth() - date.getMonth(), 1);
		var endd = new Date(date.getFullYear(), date.getMonth() + 4, date.getDate());
		
		

		//ScoreIt.getGamesList(startd, endd);
		
		var xhr = Ti.Network.createHTTPClient();
		
		var glurl = 'http://api.espnalps.com/v0/cbb/games?token=' + Ti.App.Properties.getString('token') + '&signature=' + Ti.App.Properties.getString('sig') + '&key=' + ScoreIt.gamesList.key;

		var dates = {
			"start" : "" + ScoreIt.timestamp(startd) + "",
			"end" : "" + ScoreIt.timestamp(endd) + ""
		};

		var text;
		var json;

		xhr.onload = function(e) {
			//Ti.App.Properties.setList('games', null);
			//Ti.API.info(xhr.responseText);
			json = JSON.parse(xhr.responseText);
			Ti.API.info('The result of games request: ' + json.result);
			if(json.result == 'okay'){
				Ti.App.Properties.setString('glresult', 'okay');
				Ti.API.info('The games available: ' + json.response.games);
				Ti.App.Properties.setList('games', json.response.games);
				Ti.API.info('The number of games available: ' + json.response.games.length);
				
				if(json.response.games.length == 0) {
					alert('There are no games to display');
				} else {
					for(var i = 0; i < json.response.games.length; i++) {
						var game = json.response.games[i];
		
						var title = '' + game.homeTeam.teamName + ' vs ' + game.awayTeam.teamName + '';
		
						var grow = Ti.UI.createTableViewRow({
							id : game.gameId,
							name : title,
							height : 65
						});
		
						var gtime = game.time;
						var time = gtime.substring(12, 16);
						var d = new Date(gtime.substring(0, 4), gtime.substring(5, 7), gtime.substring(8, 10));
						var da = '' + d.toDateString().substring(4, 8) + ' ' + d.toDateString().substring(8, 11) + ' ' + d.toDateString().substring(11, 15) + '';
						var gdate = '' + da + ' ' + time + ' ' + game.venue + '';
		
						var sview = Ti.UI.createView({
							backgroundImage : ScoreIt.path.R + 'nimages/lback.png',
							left : 10,
							right : 10,
							top : 5,
							bottom : 5,
							borderRadius : 5
						});
						var label = Ti.UI.createLabel({
							text : title,
							color : 'white',
							//backgroundColor: 'white',
							bottom : 30,
							left : 10
						});
		
						var date = Ti.UI.createLabel({
							text : gdate,
							color : 'white',
							top : 20,
							left : 10
						});
						sview.add(label);
						sview.add(date);
						grow.add(sview);
		
						tableView.appendRow(grow);
					}
				}
				
			}else if(json.result == 'error'){
				Ti.App.Properties.setString('glresult', json.result);
				Ti.App.Properties.setString('glerror', xhr.responseText);
				alert(xhr.responseText);
			}

		};

		xhr.onerror = function(e) {
			json = JSON.parse(xhr.responseText);
			var error = json.errors;

			alert('Games List. There was an error. ' + xhr.responseText);
			
		};

		//alert('The url: \n' + glurl);
		xhr.open('POST', glurl);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify(dates));
		
		/*var gstatus = Ti.App.Properties.getString('glresult');
		
		if(gstatus == 'error') {
			alert(Ti.App.Properties.getString('glerror'));
		}*/

		tableView.addEventListener('click', function(e) {
			//alert('You clicked on ' + e.rowData.name);
			var sGame = [];
			sGame[0] = Ti.App.Properties.getList('games')[e.index];

			Ti.App.Properties.setList('selectedGame', sGame);
			
			//alert('The game you selected' + e.rowData.id);
			Ti.API.info('game selected: ' + e.rowData.id);

			//ScoreIt.getGameData(e.rowData.id);
			getGameD(e.rowData.id);
			
			Ti.API.info('The value of the game data request: ' + Ti.App.Properties.getString('gdresult'));
			
			if(Ti.App.Properties.getString('gdresult') == 'error') {
				alert(Ti.App.Properties.getString('gderror'));
			}else {
				var game = ScoreIt.ui.createGameWindow(e.rowData.name);
				ScoreIt.navGroup.open(game);
			}

		});

		return gamesWindow;
	};
	
	
	function getGameD(gameId){
		var xhr = Ti.Network.createHTTPClient();
		Ti.API.info('The current signature: ' + Ti.App.Properties.getString('sig'));
		//ScoreIt.newSig();
		//Ti.API.info('The new signature: ' + Ti.App.Properties.getString('sig'));
		var gdurl = 'http://api.espnalps.com/v0/cbb/getGameData/' + gameId + '?token=' + Ti.App.Properties.getString('token') + '&signature=' + Ti.App.Properties.getString('sig') + '&key=' + ScoreIt.gamesList.key;
		var text;
		var json;

		xhr.onload = function(e) {
			//Ti.API.info('gameData: ' + xhr.responseText);
			json = JSON.parse(xhr.responseText);
			if(json.result == 'okay'){
				Ti.API.info('The result of the game data request: ' + json.result);
				Ti.App.Properties.setString('gdresult', json.result);
				Ti.API.info('hometeamplayers: ' + json.response.homeTeam.players);
				Ti.App.Properties.setList('homeTeamPlayers', json.response.homeTeam.players);
				Ti.API.info('awayteamplayers: ' + json.response.awayTeam.players);
				Ti.App.Properties.setList('awayTeamPlayers', json.response.awayTeam.players);
				Ti.API.info('home players on the field: ' + json.response.gameSetupData.homeTeam.onField);
				Ti.App.Properties.setList('hpOnField', json.response.gameSetupData.homeTeam.onField);
				Ti.API.info('away players on the field: ' + json.response.gameSetupData.awayTeam.onField);
				Ti.App.Properties.setList('apOnField', json.response.gameSetupData.awayTeam.onField);
			}else if(json.result == 'error'){
				Ti.App.Properties.setString('gdresult', json.result);
				Ti.App.Properties.setString('gderror', xhr.responseText);
			}
			/*if(json.result == 'okay') {
				//alert('Login was sucessful');
				Ti.App.Properties.setString('gdresult', json.result);
				Ti.API.info('hometeamplayers: ' + json.response.homeTeam.players);
				Ti.App.Properties.setList('homeTeamPlayers', json.response.homeTeam.players);
				//alert('The home players' + json.response.homeTeam.players);
				Ti.API.info('awayteamplayers: ' + json.response.awayTeam.players);
				Ti.App.Properties.setList('awayTeamPlayers', json.response.awayTeam.players);
				//alert('The home players' + json.response.awayTeam.players);
				//alert(json.response.games[0].homeTeam.teamName);
				Ti.API.info('home players on the field: ' + json.response.gameSetupData.homeTeam.onField);
				Ti.App.Properties.setList('hpOnField', json.response.gameSetupData.homeTeam.onField);
				Ti.API.info('away players on the field: ' + json.response.gameSetupData.awayTeam.onField);
				Ti.App.Properties.setList('apOnField', json.response.gameSetupData.awayTeam.onField);

			} else if(json.result == 'error') {
				var es = json.errors;
				//alert('There was a problem with login. \nField: ' + es.field
				//+ '\nType: ' + es.type + '\nMessage: ' + es.message);
				//alert('There was a problem with login. ' + es);
				Ti.App.Properties.setString('gdresult', json.result);
				Ti.App.Properties.setString('gderror', xhr.responseText);
				//alert(json.result + ": " + es);
			}*/

		};

		//alert(Ti.App.Properties.getString('gdresult'));

		xhr.onerror = function(e) {
			/*json = JSON.parse(xhr.responseText);
			var error = json.errors;

			alert('Game Data. There was an error. ' + xhr.responseText);*/

		};

		//alert('The url: \n' + url);
		xhr.open('GET', gdurl);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send();
	};

})();
