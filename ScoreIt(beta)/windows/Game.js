/**
 * @author Yakira Bristol
 */
(function() {
	ScoreIt.ui.createGameWindow = function(gameName) {
		var gameWindow = Ti.UI.createWindow({
			id : 'gameWindow',
			title : gameName,
			barColor : '#414444',
			navBarHidden : false,
			backgroundImage : 'nimages/woodb.png'
		});

		var baseRow = {
			hasChild : false,
			color : '#fff',
			//backgroundColor: '#fff',
			font : {
				fontWeight : 'bold'
			}
		};
		baseRow[ScoreIt.ui.backgroundSelectedProperty + 'Color'] = ScoreIt.ui.backgroundSelectedColor;

		var createPlayerRow = function(params) {
			return ScoreIt.extend(Ti.UI.createTableViewRow(params), baseRow);
		}
		var totalPlayers = 0;
		var chosenHomeTeam = [];
		var chosenAwayTeam = [];
		var htplayers = [];
		var atplayers = [];
		var totalGamePlayer = 0;

		var theGame = [];
		theGame[0] = Ti.App.Properties.getList('selectedGame')[0];
		var gameId = theGame[0].gameId;

		var data = [];

		for(var i = 0; i < 2; i++) {
			if(i == 0) {
				var hview = Ti.UI.createView({
					backgroundImage : ScoreIt.path.R + 'nimages/back.png'
				});
				ScoreIt.homeTeamName = theGame[0].homeTeam.teamName;
				ScoreIt.homeTeamId = theGame[0].homeTeam.teamId;
				var hlabel = Ti.UI.createLabel({
					text : '' + theGame[0].homeTeam.teamName + '', //'Home Team',
					color : 'white'
				});
				hview.add(hlabel);
				var hteam = Ti.UI.createTableViewSection({
					//headerView: hview,
					headerTitle : '' + theGame[0].homeTeam.teamName + '',
					backgroundColor : '#999'
				});
				data[i] = hteam;

				htplayers = Ti.App.Properties.getList('homeTeamPlayers');

				for(var h = 0; h < htplayers.length; h++) {
					if(h == 0) {

					} else {
						var title = htplayers[h].jerseyNumber + ' ' + htplayers[h].name.lastName + ', ' + htplayers[h].name.firstName;
						var pid = '' + htplayers[h].playerId + '';
						//alert('The next player is ' + pid);
						var hrow = createPlayerRow({
							id : pid,
							title : title,
							hasCheck : false
						});
						data[i].add(hrow);
					}

				}
			}
			if(i == 1) {
				var aview = Ti.UI.createView({
					backgroundImage : ScoreIt.path.R + 'nimages/back.png'
				});
				ScoreIt.awayTeamName = theGame[0].awayTeam.teamName;
				ScoreIt.awayTeamId = theGame[0].awayTeam.teamId;
				var alabel = Ti.UI.createLabel({
					text : '' + theGame[0].awayTeam.teamName + '', //'Away Team',
					color : 'white'
				});
				aview.add(alabel);

				var ateam = Ti.UI.createTableViewSection({
					//headerView: aview,
					headerTitle : '' + theGame[0].awayTeam.teamName + '',
					backgroundColor : '#999'
				});
				data[i] = ateam;

				atplayers = Ti.App.Properties.getList('awayTeamPlayers');

				for(var a = 0; a < atplayers.length; a++) {
					if(a == 0) {

					} else {
						var title = atplayers[a].jerseyNumber + ' ' + atplayers[a].name.lastName + ', ' + atplayers[a].name.firstName;
						var pid = '' + atplayers[a].playerId + '';

						var arow = createPlayerRow({
							id : pid,
							title : title,
							hasCheck : false
						});
						data[i].add(arow);
					}
				}
			}

		}
		/*
		 var data = [
		 createGameRow({title: 'Game 1'}),
		 createGameRow({title: 'Game 2'}),
		 createGameRow({title: 'Game 3'}),
		 createGameRow({title: 'Game 4'}),
		 row
		 ];*/
		var playerTableView = Ti.UI.createTableView({
			data : data,
			top : 80,
			backgroundColor : 'transparent',
			separatorColor : 'transparent'
		});
		gameWindow.add(playerTableView);

		var scButton = Ti.UI.createButton({
			title : 'Start Scoring',
			width : '120dp',
			height : '40dp',
			top : 20
		});
		scButton.addEventListener('click', function() {
			if(totalPlayers == 10) {

				ScoreIt.homeBench = [];
				ScoreIt.awayBench = [];
				ScoreIt.honField = [];
				ScoreIt.aonField = [];

				var hponField = false;
				var aponField = false;

				for(var o = 0; o < htplayers.length; o++) {
					hponField = false;
					aponField = false;
					for(var p = 0; p < chosenHomeTeam.length; p++) {
						if(o == 0) {

						} else {
							if(htplayers[o].playerId != chosenHomeTeam[p]) {
								if(p == chosenHomeTeam.length - 1 && hponField != true) {
									//alert('We didnt find it');
								}
							} else {
								//alert('Ok we found it');
								hponField = true;
							}

							if(atplayers[o].playerId != chosenAwayTeam[p]) {
								if(p == chosenAwayTeam.length - 1 && aponField != true) {
									//alert('We didnt find it');
								}
							} else {
								//alert('Ok we found it');
								aponField = true;
							}
						}
					}

					if(hponField == false) {
						if(o != 0) {
							ScoreIt.homeBench.push(htplayers[o]);
						}

					} else {
						if(o != 0) {
							//alert('We are putting in ' + htplayers[o].name.firstName);
							var hplayer = new ScoreIt.player(htplayers[o].playerId, htplayers[o].name.firstName, htplayers[o].name.lastName, htplayers[o].jerseyNumber);
							ScoreIt.honField.push(hplayer);
						}
					}

					if(aponField == false) {
						if(o != 0) {
							ScoreIt.awayBench.push(atplayers[o]);
						}

					} else {
						if(o != 0) {
							//alert('We are putting in ' + htplayers[o].name.firstName);
							var aplayer = new ScoreIt.player(atplayers[o].playerId, atplayers[o].name.firstName, atplayers[o].name.lastName, atplayers[o].jerseyNumber);
							ScoreIt.aonField.push(aplayer);
						}
					}
				}

				/*
				for(var b = 0; b < ScoreIt.homeBench.length; b++){
				alert('OnBench ' + b + ': ' + ScoreIt.homeBench[b].name.firstName);
				}

				for(var i = 0; i < ScoreIt.honField.length; i++){
				alert('OnField ' + i + ': ' + ScoreIt.honField[i].getFName());
				}*/

				//ScoreIt.homeBench = homeBench;
				//ScoreIt.awayBench = awayBench;
				//ScoreIt.honField = chosenHomeTeam;
				//ScoreIt.setGameData.aonField = chosenAwayTeam;
				ScoreIt.homePlayers = Ti.App.Properties.getList('homeTeamPlayers');
				ScoreIt.awayPlayers = Ti.App.Properties.getList('awayTeamPlayers');

				var gameData = {
					"time" : "" + ScoreIt.timestamp() + "",
					"homeTeam" : {
						"onField" : ["" + chosenHomeTeam[0] + "", "" + chosenHomeTeam[1] + "", "" + chosenHomeTeam[2] + "", "" + chosenHomeTeam[3] + "", "" + chosenHomeTeam[4] + ""]
					},
					"awayTeam" : {
						"onField" : ["" + chosenAwayTeam[0] + "", "" + chosenAwayTeam[1] + "", "" + chosenAwayTeam[2] + "", "" + chosenAwayTeam[3] + "", "" + chosenAwayTeam[4] + ""]
					}
				};

				ScoreIt.setGameData(gameId, gameData);

				if(Ti.App.Properties.getString('sgdresult') == 'error') {
					alert(Ti.App.Properties.getString('sgderror'));
				} else {
					//alert(Ti.App.Properties.getString('sgdresult'));
				}

				var gameState = Ti.UI.createAlertDialog({
					buttonNames : ['In Progress', 'Game Start'],
					message : 'Is this game already in progress or just starting?',
					title : 'Game State'

				});

				gameState.addEventListener('click', function(e) {
					if(e.index == 0) {
						//alert('This game is in progress');

						/*if(ScoreIt.isAndroid()){

						 var gstateDialog = Ti.UI.createOptionDialog();

						 var root = Ti.UI.createView({});

						 var view = Ti.UI.createView({
						 width : 500, height: 500
						 });
						 root.add(view);

						 var hts = Ti.UI.createTextField({
						 hintText:'Curent Home Score',
						 width:'100dp',
						 height:'43dp',
						 top:'50dp',
						 borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
						 keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD
						 });
						 var ats = Ti.UI.createTextField({
						 hintText:'Curent Away Score',
						 width:'100dp',
						 height:'43dp',
						 top:'105dp',
						 borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
						 keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD
						 });
						 var firsthalf = Ti.UI.createSwitch({
						 title: '1st half',
						 style: Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
						 value: false,
						 top: '155dp',
						 left: '20dp'
						 });
						 firsthalf.addEventListener('change', function(e){
						 if(e.value == true){
						 secondhalf.enabled = false;
						 }else if(e.value == false){
						 secondhalf.enabled = true;
						 }

						 });
						 var secondhalf = Ti.UI.createSwitch({
						 title: '2nd Half',
						 style: Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
						 value: false,
						 top: '155dp',
						 left: '60dp'
						 });
						 secondhalf.addEventListener('change', function(e){
						 if(e.value == true){
						 firsthalf.enabled = false;
						 }else if(e.value == false){
						 firsthalf.enabled = true;
						 }
						 });

						 view.add(hts);
						 view.add(ats);
						 view.add(firsthalf);
						 view.add(secondhalf);

						 gstateDialog.setTitle('Current Game Status');
						 gstateDialog.buttonNames = ['Start', 'Cancel'];
						 gstateDialog.androidView = root;

						 gstateDialog.addEventListener('click', function(e){
						 if(e.button){
						 if(e.index == 0){
						 if(hts.hasText == false || ats.hasText == false
						 || (firsthalf.value == false && secondhalf.value == false)){
						 alert('Please check that all fields have values and either the 1st or 2nd half is checked');
						 }
						 else {
						 ScoreIt.homeScore = parseInt(hts.value);
						 ScoreIt.awayScore = parseInt(ats.value);
						 ScoreIt.context = [ScoreIt.homeScore, ScoreIt.awayScore];
						 var scoring = ScoreIt.ui.createScoringWindow();
						 ScoreIt.navGroup.open(scoring);
						 }
						 }
						 }
						 });
						 }else{*/
						var gState = Ti.UI.createWindow({
							//modal: true,
							navBarHidden : true,
							width : '300dp',
							height : '400dp',
							top : '10dp',
							backgroundColor : '#336699',
							opacity : 0.9
						});

						var hts = Ti.UI.createTextField({
							hintText : 'Home',
							width : '100dp',
							height : '43dp',
							top : '50dp',
							borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
							keyboardType : Ti.UI.KEYBOARD_NUMBER_PAD
						});
						var ats = Ti.UI.createTextField({
							hintText : 'Away',
							width : '100dp',
							height : '43dp',
							top : '105dp',
							borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
							keyboardType : Ti.UI.KEYBOARD_NUMBER_PAD
						});
						var flabel = Ti.UI.createLabel({
							text : '1st:',
							width : '30dp',
							height : '30dp',
							top : '165dp',
							left : '20dp'
						})
						var firsthalf = Ti.UI.createSwitch({
							title : '1st half',
							//style: Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
							value : false,
							top : '165dp',
							left : '50dp'
						});
						firsthalf.addEventListener('change', function(e) {
							if(e.value == true) {
								secondhalf.enabled = false;
							} else if(e.value == false) {
								secondhalf.enabled = true;
							}

						});

						var slabel = Ti.UI.createLabel({
							text : '2nd:',
							width : '35dp',
							height : '30dp',
							top : '165dp',
							left : '150dp'
						})
						var secondhalf = Ti.UI.createSwitch({
							title : '2nd Half',
							//style: Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
							value : false,
							top : '165dp',
							left : '185dp'
						});
						secondhalf.addEventListener('change', function(e) {
							if(e.value == true) {
								firsthalf.enabled = false;
							} else if(e.value == false) {
								firsthalf.enabled = true;
							}
						});

						if(ScoreIt.isAndroid()) {
							firsthalf.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
							secondhalf.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
						}

						var startButton = Ti.UI.createButton({
							title : 'Start',
							width : '100dp',
							height : '40dp',
							top : '215dp',
							left : '45dp'
						});

						startButton.addEventListener('click', function() {
							if(hts.value == '' || ats.value == '' || (firsthalf.value == false && secondhalf.value == false)) {
								alert('Please check that all fields have values and either the 1st or 2nd half is on');

							} else {
								ScoreIt.homeScore = parseInt(hts.value);
								ScoreIt.awayScore = parseInt(ats.value);
								if(firsthalf.value == true) {
									ScoreIt.half = '1st Half';
								} else {
									ScoreIt.half = '2nd Half';
								}
								ScoreIt.context = [ScoreIt.homeScore, ScoreIt.awayScore];
								gState.close();
								var scoring = ScoreIt.ui.createScoringWindow();
								ScoreIt.navGroup.open(scoring);
							}

						});

						var cancelButton = Ti.UI.createButton({
							title : 'Cancel',
							width : '100dp',
							height : '40dp',
							top : '215dp',
							left : '165dp'
						});

						cancelButton.addEventListener('click', function() {
							gState.close();
						});

						gState.add(hts);
						gState.add(ats);
						gState.add(flabel);
						gState.add(firsthalf);
						gState.add(slabel);
						gState.add(secondhalf);
						gState.add(startButton);
						gState.add(cancelButton);

						gState.open();
						//}

					} else {
						//alert('This game is just starting');
						ScoreIt.homeScore = 0;
						ScoreIt.awayScore = 0;
						ScoreIt.context = [ScoreIt.homeScore, ScoreIt.awayScore];
						ScoreIt.half = '1st Half';
						var scoring = ScoreIt.ui.createScoringWindow();
						ScoreIt.navGroup.open(scoring);
					}

				});
				gameState.show();

			} else {
				alert('Please make sure you have selected 5 players per team');
			}
		});

		gameWindow.add(scButton);

		playerTableView.addEventListener('click', function(e) {
			var section = e.section;
			var index = e.index;
			var nrows = section.rows.length;
			var counter = 0;
			var reset = false;

			//if(totalPlayers != 10){
			for(var c = 0; c < section.rows.length; c++) {
				if(section.rows[c].hasCheck == true) {
					counter++;
				}
			}
			if(index > (nrows - 1)) {
				index = index - nrows;
				//counter = 0;
				reset = true;
			}

			var row = section.rows[index];
			//alert('You clicked on ' + row.id);
			if(section.rows[index].hasCheck == false && counter == 5) {
				alert('You can only select 5 players per team');
			} else if(section.rows[index].hasCheck == false && counter != 5) {
				//alert(index + ' index does not have a check');
				section.rows[index].hasCheck = true;

				var tindex = index + 1;
				if(reset) {
					chosenAwayTeam.push(row.id);
				} else {
					chosenHomeTeam.push(row.id);
				}
				counter++;
				totalPlayers++;
			} else if(section.rows[index].hasCheck == true) {
				section.rows[index].hasCheck = false;

				var tindex = index + 1;
				if(reset) {
					for(var p = 0; p < chosenAwayTeam.length; p++) {
						if(row.id == chosenAwayTeam[p]) {
							chosenAwayTeam.splice(p, 1);
						}
					}
				} else {
					for(var p = 0; p < chosenHomeTeam.length; p++) {
						if(row.id == chosenHomeTeam[p]) {
							chosenHomeTeam.splice(p, 1);
						}
					}
				}
				counter--;
				totalPlayers--;
			}
			//alert('You clicked on ' + index);
			//}else {
			//	alert('You can only choose 10 players in total');
			//}
		});

		return gameWindow;
	};
})();
