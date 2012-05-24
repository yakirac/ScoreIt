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

		ScoreIt.gamesList(startd, endd);

		var gstatus = Ti.App.Properties.getString('glresult');
		if(gstatus == 'error') {
			alert(Ti.App.Properties.getString('glerror'));
		}

		games = Ti.App.Properties.getList('games');

		if(games.length == 0) {
			alert('There are no games to display');
		} else {
			for(var i = 0; i < games.length; i++) {
				var game = games[i];

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
				var gdate = '' + da + ' ' + time + ' ' + game.venue;

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

		tableView.addEventListener('click', function(e) {
			//alert('You clicked on ' + e.rowData.name);
			var sGame = [];
			sGame[0] = games[e.index];

			Ti.App.Properties.setList('selectedGame', sGame);

			ScoreIt.getGameData(e.rowData.id);

			if(Ti.App.Properties.getString('gdresult') == 'error') {
				alert(Ti.App.Properties.getString('glerror'));
			}

			var game = ScoreIt.ui.createGameWindow(e.rowData.name);
			ScoreIt.navGroup.open(game);
		});

		return gamesWindow;
	};

})();
