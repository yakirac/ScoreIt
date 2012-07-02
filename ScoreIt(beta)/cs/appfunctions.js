(function() {
	var xhr = Ti.Network.createHTTPClient();

	ScoreIt.timestamp = function(date) {
		var pad = function(amount, width) {
			var padding = '';

			while(padding.length < width - 1 && amount < Math.pow(10, width - padding.length - 1)) {
				padding += '0';
			}

			return padding + amount.toString();
		}
		//alert('The date you passed ' + date);

		date = date ? date : new Date();

		var offset = date.getTimezoneOffset();

		return pad(date.getFullYear(), 4) + '-' + pad(date.getMonth() + 1, 2) + '-' + pad(date.getDay(), 2) 
		+ 'T' + pad(date.getHours(), 2) + ':' + pad(date.getMinutes(), 2) + ':' + pad(date.getSeconds(), 2) 
		+ '.' + pad(date.getMilliseconds(), 3) + (offset > 0 ? '-' : '+') + pad(Math.floor(Math.abs(offset) / 60), 2) 
		+ pad(Math.abs(offset) % 60, 2);
	};

	ScoreIt.getGamesList = function(start, end) {
		var glurl = 'http://api.espnalps.com/v0/cbb/games?token=' + Ti.App.Properties.getString('token') + '&signature=' + Ti.App.Properties.getString('sig') + '&key=' + ScoreIt.gamesList.key;

		var dates = {
			"start" : "" + ScoreIt.timestamp(start) + "",
			"end" : "" + ScoreIt.timestamp(end) + ""
		};

		var text;
		var json;

		xhr.onload = function(e) {
			Ti.App.Properties.setList('games', null);
			//Ti.API.info(xhr.responseText);
			json = JSON.parse(xhr.responseText);
			Ti.API.info('The result of games request: ' + json.result);
			if(json.result == 'okay'){
				Ti.App.Properties.setString('glresult', 'okay');
				Ti.API.info('The games available: ' + json.response.games);
				Ti.App.Properties.setList('games', json.response.games);
			}
			/*if(json.result == 'okay') {
				//alert('Login was sucessful');
				Ti.App.Properties.setString('glresult', 'okay');
				Ti.App.Properties.setList('games', json.response.games);
				Ti.API.info(json.response.games);
				//alert(json.response.games[0].homeTeam.teamName);
			} else if(json.result == 'error') {
				var es = json.errors;
				//alert('There was a problem with login. \nField: ' + es.field
				//+ '\nType: ' + es.type + '\nMessage: ' + es.message);
				//alert('There was a problem with login. ' + es);
				Ti.App.Properties.setString('glresult', json.result);
				Ti.App.Properties.setString('glerror', xhr.responseText);
				//alert(json.result + ": " + es);
			}*/

		};

		xhr.onerror = function(e) {
			/*json = JSON.parse(xhr.responseText);
			var error = json.errors;

			alert('Games List. There was an error. ' + xhr.responseText);
			*/
		};

		//alert('The url: \n' + glurl);
		xhr.open('POST', glurl);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify(dates));
		
		//return Ti.App.Properties.getString('glresult');
	};

	ScoreIt.getGameData = function(gameId) {
		//ScoreIt.login.generateSignature(ScoreIt.gamesList.akey, ScoreIt.gamesList.s);
		Ti.API.info('The current signature: ' + Ti.App.Properties.getString('sig'));
		//ScoreIt.newSig();
		//Ti.API.info('The new signature: ' + Ti.App.Properties.getString('sig'));
		var gdurl = 'http://api.espnalps.com/v0/cbb/getGameData/' + gameId + '?token=' + Ti.App.Properties.getString('token') + '&signature=' + Ti.App.Properties.getString('sig') + '&key=' + ScoreIt.gamesList.key;
		var text;
		var json;

		xhr.onload = function(e) {
			Ti.API.info('gameData: ' + xhr.responseText);
			/*json = JSON.parse(xhr.responseText);
			if(json.result == 'okay') {
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

	ScoreIt.setGameData = function(gameId, gameData) {
		var sdurl = 'http://api.espnalps.com/v0/cbb/setGameData/' + gameId + '?token=' + Ti.App.Properties.getString('token') + '&signature=' + Ti.App.Properties.getString('sig') + '&key=' + ScoreIt.gamesList.key;

		var text;
		var json;

		xhr.onload = function(e) {
			json = JSON.parse(xhr.responseText);
			if(json.result == 'okay') {
				//alert('Login was sucessful');
				Ti.App.Properties.setString('sgdresult', json.result);
				Ti.App.Properties.setList('theGame', json.response.gameId);
			} else if(json.result == 'error') {
				var es = json.errors;
				//alert('There was a problem with login. \nField: ' + es.field
				//+ '\nType: ' + es.type + '\nMessage: ' + es.message);
				//alert('There was a problem with login. ' + es);
				Ti.App.Properties.setString('sgdresult', json.result);
				Ti.App.Properties.setString('sgderror', xhr.responseText);
				//alert('There was an error setting the players.\n' + es[0].type);
			}

		};

		//alert(Ti.App.Properties.getString('gdresult'));

		xhr.onerror = function(e) {
			json = JSON.parse(xhr.responseText);
			var error = json.errors;

			alert('Set Game Data. There was an error. ' + xhr.responseText);

		};

		//alert('The url: \n' + url);
		xhr.open('POST', sdurl);
		xhr.setRequestHeader('Content-Type', 'application/json');
		//xhr.send();
		xhr.send(JSON.stringify(gameData));
	};

	ScoreIt.methodCall = function(method, eventId, data) {
		//ScoreIt.login.generateSignature();
		Ti.API.info('The method: ' + method);

		var url = 'http://api.espnalps.com/v0/cbb/' + method + '?token=' + Ti.App.Properties.getString('token') + '&signature=' + Ti.App.Properties.getString('sig') + '&key=' + ScoreIt.gamesList.key;

		if(method == 'deleteEvent') {
			url = 'http://api.espnalps.com/v0/cbb/deleteEvent/' + eventId + '?token=' + Ti.App.Properties.getString('token') + '&signature=' + Ti.App.Properties.getString('sig') + '&key=' + ScoreIt.gamesList.key;
		}

		var text;
		var json;

		xhr.onload = function(e) {
			json = JSON.parse(xhr.responseText);
			if(json.result == 'okay') {
				//alert('Login was sucessful');
				Ti.App.Properties.setString('mresult', json.result);

				if(method == 'deleteEvent') {
					Ti.App.Properties.setString('dEvent', json.response.deletedEvent);
				} else {
					Ti.App.Properties.setString('theEvent', json.response.eventId);
				}

				//var toast = Ti.UI.createNotification({
				//		duration: Ti.UI.NOTIFICATION_DURATION_LONG,
				//		message: method + '. You are ' + json.result + '\nThe eventId: '
				//		+ json.response.eventId + '\nThe deleted event: ' + json.response.deletedEvent
				//});
				//toast.show();

			} else if(json.result == 'error') {
				var es = json.errors;
				//alert('There was a problem with login. \nField: ' + es.field
				//+ '\nType: ' + es.type + '\nMessage: ' + es.message);
				//alert('There was a problem with login. ' + es);
				Ti.App.Properties.setString('mresult', json.result);
				Ti.App.Properties.setString('merror', xhr.responseText);
				//alert('There was an error with the ' + method + ' method. ' + es[0].type);
				//var toast = Ti.UI.createNotification({
				//		duration: Ti.UI.NOTIFICATION_DURATION_LONG,
				//		message: 'There was an error with the ' + method + ' method. ' + es[0].field + ' ' + es[0].type
				//		+ ' ' + es[0].message + ' '+ es[0] + ' ' + es
				//});
				//toast.show();
			}

		};

		//alert(Ti.App.Properties.getString('gdresult'));

		xhr.onerror = function(e) {
			json = JSON.parse(xhr.responseText);
			var error = json.errors;

			alert('Method Error. There was an error. ' + xhr.responseText);
			//var toast = Ti.UI.createNotification({
			//		duration: Ti.UI.NOTIFICATION_DURATION_LONG,
			//		message: 'Method Error. There was an error. ' + error
			//});
			//toast.show();

		};

		if(method == 'deleteEvent') {
			//alert('The url: \n' + url);
			xhr.open('DELETE', url);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.send();
		} else {
			//alert('The data passed in: \n' + data);
			//alert('The url: \n' + url);
			Ti.API.info('The url: \n' + url);
			xhr.open('POST', url);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.send(JSON.stringify(data));
		}
	};
})();
