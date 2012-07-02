(function() {
	ScoreIt.ui.createEventWindow = function(eventName) {
		var eWindow = Ti.UI.createWindow({
			//navBarHidden: true,
			//title: eventName,
			backgroundColor : '#000',
			//fullscreen: false,
			width : '100dp',
			height : '155dp',
			top : '300dp',
			right : '10dp'
			//modal: true
		});

		var okButton = Ti.UI.createButton({
			title : 'OK',
			width : '70dp',
			height : '25dp',
			left : '45dp'
		});

		var cancelButton = Ti.UI.createButton({
			title : 'Cancel',
			width : '70dp',
			height : '25dp',
			left : '130dp'
		});

		var ht = Ti.UI.createSwitch({
			title : ScoreIt.homeTeamName,
			value : false,
			top : '10dp',
			left : '110dp'
		});
		var at = Ti.UI.createSwitch({
			title : ScoreIt.awayTeamName,
			value : false,
			top : '50dp',
			left : '110dp'
		});

		var htlabel = Ti.UI.createLabel({
			text : ScoreIt.homeTeamName,
			top : '10dp',
			left : '30dp',
			width : '75dp',
			height : '30dp'
		});
		var atlabel = Ti.UI.createLabel({
			text : ScoreIt.awayTeamName,
			top : '50dp',
			left : '30dp',
			width : '75dp',
			height : '30dp'
		});

		if(eventName == 'More...') {
			//eWindow.width = '100dp';
			//eWindow.height = '155dp';
			//eWindow.top = '300dp';
			//eWindow.bottom = '20dp';
			//eWindow.right = '10dp';
			//eWindow.opacity = 0.7;

			var scrollView = Ti.UI.createScrollView({
				contentHeight : 'auto',
				contentWidth : 'auto',
				showVerticalScrollIndicator : true
			});

			var moreOptions = ['PS', 'PE', 'Sub', 'Time', 'GE', 'Delete Event'];
			var ltop = 5;
			for(var mo = 0; mo < moreOptions.length; mo++) {
				var aLabel = Ti.UI.createLabel({
					text : '' + moreOptions[mo] + '',
					color : 'white',
					//font : {fontSize:myFontSize},
					height : '25dp',
					width : '60dp',
					top : '' + ltop + '',
					textAlign : 'center',
					font : {
						fontSize : 14
					}
				});
				ltop = ltop + 30;
				scrollView.add(aLabel);
			}

			eWindow.add(scrollView);

			eWindow.addEventListener('click', function(e) {
				//alert('You clicked ' + e.source.text);
				if(e.source.text == 'GE') {
					var endGame = Ti.UI.createAlertDialog({
						cancel : 1,
						message : 'Are you sure you want to end the game?',
						title : 'End Game?',
						buttonNames : ['Ok', 'Cancel']
					});

					endGame.addEventListener('click', function(e) {
						if(e.index == 0) {
							alert('The game has ended. \nThis is the game data: \ngameId: ' + Ti.App.Properties.getList('selectedGame')[0].gameId + '\nhomeScore: ' + ScoreIt.homeScore + '\nawayScore: ' + ScoreIt.awayScore);
							var date = new Date();
							var gameEndData = {
								"gameId" : "" + Ti.App.Properties.getList('selectedGame')[0].gameId + "",
								"context" : {
									"time" : "" + ScoreIt.timestamp(date) + "",
									"homeScore" : ScoreIt.homeScore,
									"awayScore" : ScoreIt.awayScore
								}
							};

							ScoreIt.methodCall('gameEnd', null, gameEndData);

							if(Ti.App.Properties.getString('mresult') == 'error') {
								alert(Ti.App.Properties.getString('merror'));
							} else {
								//alert('The event id: ' + Ti.App.Properties.getString('theEvent'));
								//alert('This game has ended');
								var newEvent = new ScoreIt.sEvent('gameEnd', Ti.App.Properties.getString('theEvent'), gameEndData);
								ScoreIt.events.push(newEvent);

								if(ScoreIt.nhtime != undefined) {
									ScoreIt.nhtime.stop();
								}
							}
						}
					});

					eWindow.close();
					endGame.show();
				}
				if(e.source.text == 'PS' || e.source.text == 'PE') {
					//eWindow.close();
					//eWindow.width = 300;
					//eWindow.height = 300;
					//eWindow.opacity = 0.7;

					var periodWindow = Ti.UI.createWindow({
						width : '250dp',
						height : '150dp',
						//top: '100dp',
						//left: '100dp'
						//opacity: 0.7
						//modal: true
						backgroundColor : '#336699',
						opacity : 0.9
					});

					var title;
					if(ScoreIt.half == '1st Half' && e.source.text == 'PE') {
						title = '1st Half';
					} else if(ScoreIt.half == '1st Half' && e.source.text == 'PS') {
						title = '1st Half';
					} else if(ScoreIt.half == '2nd Half' && e.source.text == 'PE') {
						title = '2nd Half';
					} else if(ScoreIt.half == '2nd Half' && e.source.text == 'PS') {
						title = '2nd Half';
					}
					var period = Ti.UI.createSwitch({
						title : title,
						//style: Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
						value : false,
						top : '10dp',
						left : '110dp'
					});

					if(ScoreIt.isAndroid()) {
						period.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
					} else {
						var label = Ti.UI.createLabel({
							text : title,
							top : '10dp',
							left : '40dp',
							width : '65dp',
							height : '30dp'
						});

						periodWindow.add(label);
					}

					okButton.top = '80dp';
					okButton.addEventListener('click', function() {
						var cHalf = 1;
						if(period.value == false) {
							alert('Please set the half to on');
						} else if(e.source.text == 'PS') {
							if(ScoreIt.half == '2nd Half') {
								cHalf = 2;
								ScoreIt.sHalfStarted = true;
								ScoreIt.quarter.text = ScoreIt.half;
								ScoreIt.nhtime = new ScoreIt.timer();
								ScoreIt.nhtime.start();
							} else {
								ScoreIt.fHalfStarted = true;
								ScoreIt.quarter.text = ScoreIt.half;
								ScoreIt.nhtime = new ScoreIt.timer();
								ScoreIt.nhtime.start();

							}
							var periodStartData = {
								"gameId" : "" + Ti.App.Properties.getList('selectedGame')[0].gameId + "",
								"period" : cHalf,
								"context" : {
									"time" : "" + ScoreIt.timestamp(new Date()) + "",
									"homeScore" : ScoreIt.homeScore,
									"awayScore" : ScoreIt.awayScore
								}
							};

							ScoreIt.methodCall('periodStart', null, periodStartData);

							if(Ti.App.Properties.getString('mresult') == 'error') {
								alert(Ti.App.Properties.getString('merror'));
							} else {
								//alert('The periodStart event id: ' + Ti.App.Properties.getString('theEvent'));
								alert('The event has been added. \nThe event id:\n' + Ti.App.Properties.getString('theEvent'));
								var newEvent = new ScoreIt.sEvent('periodStart', Ti.App.Properties.getString('theEvent'), periodStartData);
								ScoreIt.events.push(newEvent);
							}
							//alert('We will add the event');
							periodWindow.close();
						} else if(e.source.text == 'PE') {
							if(ScoreIt.half == '2nd Half') {
								cHalf = 2;
								ScoreIt.sHalfEnded = true;
							} else {
								ScoreIt.fHalfEnded = true;
								ScoreIt.half = '2nd Half';
								ScoreIt.gtime.text = '20:00';
							}
							var periodEndData = {
								"gameId" : "" + Ti.App.Properties.getList('selectedGame')[0].gameId + "",
								"period" : cHalf,
								"context" : {
									"time" : "" + ScoreIt.timestamp(new Date()) + "",
									"homeScore" : ScoreIt.homeScore,
									"awayScore" : ScoreIt.awayScore
								}
							};

							ScoreIt.methodCall('periodEnd', null, periodEndData);

							if(Ti.App.Properties.getString('mresult') == 'error') {
								alert(Ti.App.Properties.getString('merror'));
							} else {
								//alert('The periodEnd event id: ' + Ti.App.Properties.getString('theEvent'));
								alert('The event has been added. \nThe event id:\n' + Ti.App.Properties.getString('theEvent'));
								var newEvent = new ScoreIt.sEvent('periodEnd', Ti.App.Properties.getString('theEvent'), periodEndData);
								ScoreIt.events.push(newEvent);
							}
							
							if(ScoreIt.nhtime != undefined) {
								ScoreIt.nhtime.stop();
							}

							//alert('We will add the event');
							periodWindow.close();
						}
					});
					cancelButton.top = '80dp';
					cancelButton.addEventListener('click', function() {
						periodWindow.close();
					});

					periodWindow.add(period);
					periodWindow.add(okButton);
					periodWindow.add(cancelButton);

					eWindow.close();

					if(ScoreIt.jumpWinner == undefined && ScoreIt.half == '1st Half' && e.source.text == 'PS') {
						alert('You need to add a jumball before you can start the period');
					} else if(ScoreIt.fHalfStarted == true && ScoreIt.half == '1st Half' && e.source.text == 'PS') {
						alert('The first half has already started \nPlease end the half before starting another one.');
					} else if(ScoreIt.fHalfEnded == true && ScoreIt.half == '1st Half' && e.source.text == 'PE') {
						alert('The first half has already ended.');
					} else if(ScoreIt.fHalfStarted == undefined && ScoreIt.half == '1st Half' && e.source.text == 'PE') {
						alert('You need to start the 1st half before you can end it');
					} else if(ScoreIt.sHalfEnded == true && ScoreIt.half == '2nd Half' && e.source.text == 'PS') {
						alert('The second half has ended \n You can only end the game');
					} else if(ScoreIt.sHalfStarted == true && ScoreIt.half == '2nd Half' && e.source.text == 'PS') {
						alert('The second half has already started \n You can only end the half and the game');
					} else if(ScoreIt.sHalfEnded == true && ScoreIt.half == '2nd Half' && e.source.text == 'PE') {
						alert('The second half has already ended');
					} else if(ScoreIt.sHalfStarted == undefined && ScoreIt.half == '2nd Half' && e.source.text == 'PE') {
						alert('You need to start the 2nd Half before you can end it');
					} else {
						periodWindow.open();
					}

				}
				if(e.source.text == 'Sub') {
					var subWindow = Ti.UI.createWindow({
						width : '250dp',
						height : '350dp',
						//top: '100dp',
						//left: '100dp'
						//opacity: 0.7
						//modal: true
						backgroundColor : '#336699',
						opacity : 0.9
					});

					var bdata = [];
					var benchTable = Ti.UI.createTableView({
						headerTitle : 'Player In',
						width : '230dp',
						height : '80dp',
						top : '100dp',
						rowHeight : '35dp'
					});
					var ofdata = [];
					var onFieldTable = Ti.UI.createTableView({
						headerTitle : 'Player Out',
						width : '230dp',
						height : '80dp',
						top : '200dp',
						rowHeight : '35dp'
					});

					if(ScoreIt.isAndroid()) {
						ht.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
						at.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;

					} else {
						subWindow.add(htlabel);
						subWindow.add(atlabel);
					}

					at.addEventListener('change', function() {
						if(at.value == true) {
							ht.enabled = false;
							ScoreIt.subTeam = ScoreIt.awayTeamName;
							for(var ab = 0; ab < ScoreIt.awayBench.length; ab++) {
								bdata[ab] = Ti.UI.createTableViewRow({
									id : ScoreIt.awayBench[ab].playerId,
									title : '' + ScoreIt.awayBench[ab].jerseyNumber + ' ' + ScoreIt.awayBench[ab].name.lastName + ', ' + ScoreIt.awayBench[ab].name.firstName + '',
									hasCheck : false
								});
								benchTable.appendRow(bdata[ab]);
							}

							for(var of = 0; of < ScoreIt.aonField.length; of++) {
								ofdata[of] = Ti.UI.createTableViewRow({
									id : ScoreIt.aonField[of].getId(),
									title : '' + ScoreIt.aonField[of].getJN() + ' ' + ScoreIt.aonField[of].getLName() + ', ' + ScoreIt.aonField[of].getFName() + '',
									hasCheck : false
								});
								onFieldTable.appendRow(ofdata[of]);
							}

							benchTable.data = bdata;
							onFieldTable.data = ofdata;

						} else if(at.value == false) {
							ht.enabled = true;
							benchTable.data = [];
							onFieldTable.data = [];
						}
					});

					ht.addEventListener('change', function() {
						if(ht.value == true) {
							at.enabled = false;
							ScoreIt.subTeam = ScoreIt.homeTeamName;
							for(var hb = 0; hb < ScoreIt.homeBench.length; hb++) {
								bdata[hb] = Ti.UI.createTableViewRow({
									id : ScoreIt.homeBench[hb].playerId,
									title : '' + ScoreIt.homeBench[hb].jerseyNumber + ' ' + ScoreIt.homeBench[hb].name.lastName + ', ' + ScoreIt.homeBench[hb].name.firstName + '',
									hasCheck : false
								});
								benchTable.appendRow(bdata[hb]);
							}

							for(var of = 0; of < ScoreIt.honField.length; of++) {
								ofdata[of] = Ti.UI.createTableViewRow({
									id : ScoreIt.honField[of].getId(),
									title : '' + ScoreIt.honField[of].getJN() + ' ' + ScoreIt.honField[of].getLName() + ', ' + ScoreIt.honField[of].getFName() + '',
									hasCheck : false
								});
								onFieldTable.appendRow(ofdata[of]);
							}
							benchTable.data = bdata;
							onFieldTable.data = ofdata;

						} else if(ht.value == false) {
							at.enabled = true;
							benchTable.data = [];
							onFieldTable.data = [];
						}
					});

					benchTable.addEventListener('click', function(e) {
						var section = e.section;
						var index = e.index;
						for(var i = 0; i < section.rows.length; i++) {
							section.rows[i].hasCheck = false;
						}
						// set current check
						section.rows[index].hasCheck = true;

						ScoreIt.playerIn = section.rows[index].id;
					});

					onFieldTable.addEventListener('click', function(e) {
						var section = e.section;
						var index = e.index;
						for(var i = 0; i < section.rows.length; i++) {
							section.rows[i].hasCheck = false;
						}
						// set current check
						section.rows[index].hasCheck = true;

						ScoreIt.playerOut = section.rows[index].id;
					});

					okButton.top = '300dp';
					okButton.addEventListener('click', function() {
						if(ScoreIt.playerIn == undefined || ScoreIt.playerOut == undefined || ScoreIt.subTeam == undefined) {
							alert('Please select a team, a player in and a player out');
						} else {
							//alert('The player in: ' + ScoreIt.playerIn + '\nthe player out: ' + ScoreIt.playerOut);
							var subData = {
								"gameId" : "" + Ti.App.Properties.getList('selectedGame')[0].gameId + "",
								"exitingPlayer" : "" + ScoreIt.playerOut + "",
								"enteringPlayer" : "" + ScoreIt.playerIn + "",
								"context" : {
									"time" : "" + ScoreIt.timestamp(new Date()) + "",
									"homeScore" : ScoreIt.homeScore,
									"awayScore" : ScoreIt.awayScore
								}
							};

							if(ScoreIt.subTeam == ScoreIt.homeTeamName) {
								var inplayer;
								var outplayer;

								for(var pof = 0; pof < ScoreIt.honField.length; pof++) {
									//alert('The player out: ' + ScoreIt.playerOut + '\nThe player onfield: ' + ScoreIt.honField[pof].getId());
									if(ScoreIt.playerOut == ScoreIt.honField[pof].getId()) {
										ScoreIt.honField.splice(pof, 1);
										//alert('We have the player');
										for(var hp = 0; hp < ScoreIt.homePlayers.length; hp++) {
											if(ScoreIt.playerOut == ScoreIt.homePlayers[hp].playerId) {
												outplayer = ScoreIt.homePlayers[hp];
											}
										}
									}

								}

								for(var pob = 0; pob < ScoreIt.homeBench.length; pob++) {
									if(ScoreIt.playerIn == ScoreIt.homeBench[pob].playerId) {
										inplayer = new ScoreIt.player(ScoreIt.homeBench[pob].playerId, ScoreIt.homeBench[pob].name.firstName, ScoreIt.homeBench[pob].name.lastName, ScoreIt.homeBench[pob].jerseyNumber);
										ScoreIt.homeBench.splice(pob, 1);
									}
								}
								//ScoreIt.honField.push(inplayer);
								//ScoreIt.homeBench.push(outplayer);
								ScoreIt.honField[ScoreIt.honField.length] = inplayer;
								ScoreIt.homeBench[ScoreIt.homeBench.length] = outplayer;
								//alert(ScoreIt.honField);
								//alert(ScoreIt.homeBench);

								for(var e = ScoreIt.htplayers.children.length - 1; e >= 0; e--) {
									ScoreIt.htplayers.remove(ScoreIt.htplayers.children[e]);
								}

								var top = 0;
								for(var hp = 0; hp < ScoreIt.honField.length; hp++) {
									ScoreIt.htplayers.add(ScoreIt.playerView('' + ScoreIt.honField[hp].getJN() + '', '' + ScoreIt.honField[hp].getPoints() + '', '' + ScoreIt.honField[hp].getFouls() + '', top));
									top = top + ScoreIt.getTop('player');
								}
							}
							if(ScoreIt.subTeam == ScoreIt.awayTeamName) {
								var inplayer;
								var outplayer;

								for(var pof = 0; pof < ScoreIt.aonField.length; pof++) {
									if(ScoreIt.playerOut == ScoreIt.aonField[pof].getId()) {
										ScoreIt.aonField.splice(pof, 1);

										for(var hp = 0; hp < ScoreIt.awayPlayers.length; hp++) {
											if(ScoreIt.playerOut == ScoreIt.awayPlayers[hp].playerId) {
												outplayer = ScoreIt.awayPlayers[hp];
											}
										}
									}
								}

								for(var pob = 0; pob < ScoreIt.awayBench.length; pob++) {
									if(ScoreIt.playerIn == ScoreIt.awayBench[pob].playerId) {
										inplayer = new ScoreIt.player(ScoreIt.awayBench[pob].playerId, ScoreIt.awayBench[pob].name.firstName, ScoreIt.awayBench[pob].name.lastName, ScoreIt.awayBench[pob].jerseyNumber);
										ScoreIt.awayBench.splice(pob, 1);
									}
								}

								//ScoreIt.aonField.push(inplayer);
								//ScoreIt.awayBench.push(outplayer);
								ScoreIt.aonField[ScoreIt.aonField.length] = inplayer;
								ScoreIt.awayBench[ScoreIt.awayBench.length] = outplayer;

								for(var e = ScoreIt.atplayers.children.length - 1; e >= 0; e--) {
									ScoreIt.atplayers.remove(ScoreIt.atplayers.children[e]);
								}

								var top = 0;
								for(var ap = 0; ap < ScoreIt.aonField.length; ap++) {
									ScoreIt.atplayers.add(ScoreIt.playerView('' + ScoreIt.aonField[ap].getJN() + '', '' + ScoreIt.aonField[ap].getPoints() + '', '' + ScoreIt.aonField[ap].getFouls() + '', top));
									top = top + ScoreIt.getTop('player');
								}
							}

							ScoreIt.methodCall('substitution', null, subData);

							if(Ti.App.Properties.getString('mresult') == 'error') {
								alert(Ti.App.Properties.getString('merror'));
							} else {
								//alert('The event id: ' + Ti.App.Properties.getString('theEvent'));
								alert('The event has been added. \nThe event id:\n' + Ti.App.Properties.getString('theEvent'));
								var newEvent = new ScoreIt.sEvent('substitution', Ti.App.Properties.getString('theEvent'), subData);
								ScoreIt.events.push(newEvent);
							}
							//alert('We will add the event');
							subWindow.close();
						}
					});
					cancelButton.top = '300dp';
					cancelButton.addEventListener('click', function() {
						subWindow.close();
					});

					subWindow.add(ht);
					subWindow.add(at);
					subWindow.add(benchTable);
					subWindow.add(onFieldTable);
					subWindow.add(okButton);
					subWindow.add(cancelButton);

					if((ScoreIt.half == '1st Half' && ScoreIt.fHalfStarted == undefined) || (ScoreIt.half == '2nd Half' && ScoreIt.sHalfStarted == undefined)) {
						alert('You have to start the half before you can do that');
					} else {
						subWindow.open();
						eWindow.close();
					}
				}
				if(e.source.text == 'Time') {
					var timeWindow = Ti.UI.createWindow({
						width : '250dp',
						height : '350dp',
						//top: '100dp',
						//left: '100dp'
						//opacity: 0.7
						//modal: true
						backgroundColor : '#336699',
						opacity : 0.9
					});

					var tmodata = [{
						title : 'Team',
						hasCheck : false
					}, {
						title : 'Official',
						hasCheck : false
					}, {
						title : 'Media',
						hasCheck : false
					}];
					var tmoTable = Ti.UI.createTableView({
						headerTitle : 'Timeout Type',
						data : tmodata,
						width : '230dp',
						height : '150dp',
						top : '100dp',
						rowHeight : '40dp'
					});
					tmoTable.addEventListener('click', function(e) {
						var section = e.section;
						var index = e.index;
						for(var i = 0; i < section.rows.length; i++) {
							section.rows[i].hasCheck = false;
						}
						// set current check
						section.rows[index].hasCheck = true;
						if(section.rows[index].title == 'Official' || section.rows[index].title == 'Media') {
							at.enabled = false;
							ht.enabled = false;
						} else {
							at.enabled = true;
							ht.enabled = true;
						}

						ScoreIt.tmType = e.rowData.title;
					});

					if(ScoreIt.isAndroid()) {
						at.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
						ht.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
					} else {
						timeWindow.add(htlabel);
						timeWindow.add(atlabel);
					}

					at.addEventListener('change', function() {
						if(at.value == true) {
							ht.enabled = false;
							ScoreIt.tmTeam = ScoreIt.awayTeamName;
							ScoreIt.teamId = ScoreIt.awayTeamId;
						} else if(at.value == false) {
							ht.enabled = true;
						}
					});

					ht.addEventListener('change', function() {
						if(ht.value == true) {
							at.enabled = false;
							ScoreIt.tmTeam = ScoreIt.homeTeamName;
							ScoreIt.teamId = ScoreIt.homeTeamId;
						} else if(ht.value == false) {
							ht.enabled = true;
						}
					});

					okButton.top = '280dp';
					okButton.addEventListener('click', function() {
						if(ScoreIt.tmType == undefined) {
							alert('Please select the timeout type');
						} else if(at.enabled == true && ht.enabled == true && (at.value == false && ht.value == false)) {
							alert('Please select the team who called the timeout');
						} else {
							//alert(ScoreIt.teamId);
							var timeoutData;
							if(at.enabled == true || ht.enabled == true) {
								if(ScoreIt.tmTeam == ScoreIt.homeTeamName) {
									var view = ScoreIt.hto.children[ScoreIt.hto.children.length - 1];
									ScoreIt.hto.remove(view);
								} else if(ScoreIt.tmTeam == ScoreIt.awayTeamName) {
									var view = ScoreIt.ato.children[ScoreIt.ato.children.length - 1];
									ScoreIt.ato.remove(view);
								}
								timeoutData = {
									"gameId" : "" + Ti.App.Properties.getList('selectedGame')[0].gameId + "",
									"timeoutTeam" : "" + ScoreIt.teamId + "",
									"timeoutType" : "" + ScoreIt.tmType.toLowerCase() + "",
									"context" : {
										"time" : "" + ScoreIt.timestamp(new Date()) + "",
										"homeScore" : ScoreIt.homeScore,
										"awayScore" : ScoreIt.awayScore
									}
								};
							} else {
								timeoutData = {
									"gameId" : "" + Ti.App.Properties.getList('selectedGame')[0].gameId + "",
									"timeoutType" : "" + ScoreIt.tmType.toLowerCase() + "",
									"context" : {
										"time" : "" + ScoreIt.timestamp(new Date()) + "",
										"homeScore" : ScoreIt.homeScore,
										"awayScore" : ScoreIt.awayScore
									}
								};
							}

							ScoreIt.methodCall('timeout', null, timeoutData);

							if(Ti.App.Properties.getString('mresult') == 'error') {
								alert(Ti.App.Properties.getString('merror'));
							} else {
								//alert('The event id: ' + Ti.App.Properties.getString('theEvent'));
								alert('The event has been added. \nThe event id:\n' + Ti.App.Properties.getString('theEvent'));
								var newEvent = new ScoreIt.sEvent('timeout', Ti.App.Properties.getString('theEvent'), timeoutData);
								ScoreIt.events.push(newEvent);
							}
							//alert('We will add the event');
							if(ScoreIt.nhtime != undefined) {
								ScoreIt.nhtime.start();
							}
							timeWindow.close();
						}
					});
					cancelButton.top = '280dp';
					cancelButton.addEventListener('click', function() {
						if(ScoreIt.nhtime != undefined) {
							ScoreIt.nhtime.start();
						}
						timeWindow.close();
					});

					timeWindow.add(ht);
					timeWindow.add(at);
					timeWindow.add(tmoTable);
					timeWindow.add(okButton);
					timeWindow.add(cancelButton);

					if(ScoreIt.nhtime != undefined) {
						ScoreIt.nhtime.stop();
					}

					if((ScoreIt.half == '1st Half' && ScoreIt.fHalfStarted == undefined) || (ScoreIt.half == '2nd Half' && ScoreIt.sHalfStarted == undefined)) {
						alert('You have to start the half before you can do that');
					} else {
						timeWindow.open();
						eWindow.close();
					}
				}

				if(e.source.text == 'Delete Event') {
					var deleteEventsWindow = Ti.UI.createWindow({
						width : '250dp',
						height : '350dp',
						//top: '100dp',
						//left: '100dp'
						//opacity: 0.7
						//modal: true
						backgroundColor : '#336699',
						opacity : 0.9
					});

					var eventsData = [];
					for(var e = 0; e < ScoreIt.events.length; e++) {
						eventsData[e] = Ti.UI.createTableViewRow({
							id : ScoreIt.events[e].id,
							title : '' + ScoreIt.events[e].name + '',
							hasCheck : false
						});
					}
					var addedEventsTable = Ti.UI.createTableView({
						headerTitle : 'Added Events',
						data : eventsData,
						width : '200dp',
						height : '200dp',
						top : '10dp'
					});

					addedEventsTable.addEventListener('click', function(e) {
						var section = e.section;
						var index = e.index;
						for(var i = 0; i < section.rows.length; i++) {
							section.rows[i].hasCheck = false;
						}

						section.rows[index].hasCheck = true;

						ScoreIt.etd = e.rowData.id;
						//alert('event id' + e.rowData.id);
					});

					okButton.top = '300dp';
					okButton.addEventListener('click', function() {
						var dEvent = Ti.UI.createAlertDialog({
							cancel : 1,
							message : 'Are you sure you want to delete this event?',
							title : 'Delete Event?',
							buttonNames : ['Ok', 'Cancel']
						});

						dEvent.show();

						dEvent.addEventListener('click', function(e) {
							if(e.index == 0) {

								ScoreIt.methodCall('deleteEvent', ScoreIt.etd, null);

								if(Ti.App.Properties.getString('mresult') == 'error') {
									alert(Ti.App.Properties.getString('merror'));
								} else {
									//alert('The event id: ' + Ti.App.Properties.getString('dEvent'));
									alert('The event has been deleted');
									for(var de = 0; ScoreIt.events.length; de++) {
										if(ScoreIt.etd == ScoreIt.events[de].id) {
											ScoreIt.events.splice(de, 1);
										}
									}
								}

							}
						});

						deleteEventsWindow.close();
					});
					cancelButton.top = '300dp';
					cancelButton.addEventListener('click', function() {
						deleteEventsWindow.close();
					});

					deleteEventsWindow.add(addedEventsTable);
					deleteEventsWindow.add(okButton);
					deleteEventsWindow.add(cancelButton);

					if(ScoreIt.events.length == 0) {
						alert('There are no events to delete');
					} else {
						deleteEventsWindow.open();
					}
				}
			});
		}
		if(eventName == 'Foul') {
			eWindow.width = '300dp';
			eWindow.height = '440dp';
			eWindow.top = '10dp';
			eWindow.left = '10dp';
			eWindow.backgroundColor = '#336699';
			eWindow.opacity = 0.9;

			var scrollView = Ti.UI.createScrollView({
				contentHeight : 'auto',
				contentWidth : 'auto',
				showVerticalScrollIndicator : true
			});

			var ejected = Ti.UI.createSwitch({
				title : 'Ejected',
				value : false,
				top : '270dp',
				left : '110dp'
			});

			var drewBy = Ti.UI.createSwitch({
				title : 'Drew By',
				value : false,
				top : '310dp',
				left : '110dp'
			});

			if(ScoreIt.isAndroid()) {
				at.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
				ht.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
				ejected.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
				drewBy.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;

			} else {

				var ejectedLabel = Ti.UI.createLabel({
					text : 'Ejected',
					width : '75dp',
					height : '30dp',
					top : '270dp',
					left : '30dp'
				});

				var drewByLabel = Ti.UI.createLabel({
					text : 'Drew By',
					width : '75dp',
					height : '30dp',
					top : '310dp',
					left : '30dp'
				});

				scrollView.add(htlabel);
				scrollView.add(atlabel);
				scrollView.add(ejectedLabel);
				scrollView.add(drewByLabel);

			}

			var ftdata = [{
				title : 'Blocking',
				hasCheck : false
			}, {
				title : 'Charging',
				hasCheck : false
			}, {
				title : 'Shooting',
				hasCheck : false
			}, {
				title : 'Offensive',
				hasCheck : false
			}, {
				title : 'Personal',
				hasCheck : false
			}, {
				title : 'Technical',
				hasCheck : false
			}, {
				title : 'Flagrant',
				hasCheck : false
			}];
			var foulTypeTable = Ti.UI.createTableView({
				data : ftdata,
				headerTitle : 'Foul Type',
				width : '230dp',
				height : '80dp',
				top : '90dp',
				rowHeight : '35dp'
			});

			var foulerData = [];
			var foulerTable = Ti.UI.createTableView({
				headerTitle : 'Committed By',
				width : '230dp',
				height : '80dp',
				top : '180dp',
				rowHeight : '35dp'
			});

			var fouleeData = [];
			var fouleeTable = Ti.UI.createTableView({
				headerTitle : 'Drew By',
				width : '230dp',
				height : '80dp',
				top : '345dp',
				rowHeight : '35dp'
			});

			at.addEventListener('change', function(e) {
				if(at.value == true) {
					ht.enabled = false;
					ScoreIt.foulTeam = ScoreIt.awayTeamName;

					for(var t = 0; t < ScoreIt.aonField.length; t++) {
						foulerData[t] = Ti.UI.createTableViewRow({
							id : ScoreIt.aonField[t].getId(),
							title : '' + ScoreIt.aonField[t].getJN() + ' ' + ScoreIt.aonField[t].getLName() + ', ' + ScoreIt.aonField[t].getFName() + '',
							hasCheck : false
						});

						foulerTable.appendRow(foulerData[t]);
					}

					foulerTable.data = foulerData;
				} else if(at.value == false) {
					ht.enabled = true;
					foulerTable.data = [];
				}
			});

			ht.addEventListener('change', function() {
				if(ht.value == true) {
					at.enabled = false;
					ScoreIt.foulTeam = ScoreIt.homeTeamName;

					for(var t = 0; t < ScoreIt.honField.length; t++) {
						foulerData[t] = Ti.UI.createTableViewRow({
							id : ScoreIt.honField[t].getId(),
							title : '' + ScoreIt.honField[t].getJN() + ' ' + ScoreIt.honField[t].getLName() + ', ' + ScoreIt.honField[t].getFName() + '',
							hasCheck : false
						});

						foulerTable.appendRow(foulerData[t]);
					}

					foulerTable.data = foulerData;

				} else if(ht.value == false) {
					at.enabled = true;
					foulerTable.data = [];
				}
			});

			drewBy.addEventListener('change', function() {
				if(drewBy.value == true && ScoreIt.foulTeam == ScoreIt.awayTeamName) {
					for(var t = 0; t < ScoreIt.honField.length; t++) {
						fouleeData[t] = Ti.UI.createTableViewRow({
							id : ScoreIt.honField[t].getId(),
							title : '' + ScoreIt.honField[t].getJN() + ' ' + ScoreIt.honField[t].getLName() + ', ' + ScoreIt.honField[t].getFName() + '',
							hasCheck : false
						});

						fouleeTable.appendRow(fouleeData[t]);
					}

					fouleeTable.data = fouleeData;
				} else if(drewBy.value == true && ScoreIt.foulTeam == ScoreIt.homeTeamName) {
					for(var t = 0; t < ScoreIt.aonField.length; t++) {
						fouleeData[t] = Ti.UI.createTableViewRow({
							id : ScoreIt.aonField[t].getId(),
							title : '' + ScoreIt.aonField[t].getJN() + ' ' + ScoreIt.aonField[t].getLName() + ', ' + ScoreIt.aonField[t].getFName() + '',
							hasCheck : false
						});

						fouleeTable.appendRow(fouleeData[t]);
					}

					fouleeTable.data = fouleeData;
				} else if(drewBy.value == false) {
					fouleeTable.data = [];
				}
			});

			foulTypeTable.addEventListener('click', function(e) {
				var index = e.index;
				var section = e.section;

				for(var i = 0; i < section.rows.length; i++) {
					section.rows[i].hasCheck = false;
				}
				// set current check
				section.rows[index].hasCheck = true;

				ScoreIt.foulType = e.rowData.title;
			});

			foulerTable.addEventListener('click', function(e) {
				var index = e.index;
				var section = e.section;

				for(var i = 0; i < section.rows.length; i++) {
					section.rows[i].hasCheck = false;
				}
				// set current check
				section.rows[index].hasCheck = true;

				ScoreIt.fouler = section.rows[index].id;
				ScoreIt.foulerIndex = index;
			});

			fouleeTable.addEventListener('click', function(e) {
				var index = e.index;
				var section = e.section;

				for(var i = 0; i < section.rows.length; i++) {
					section.rows[i].hasCheck = false;
				}
				// set current check
				section.rows[index].hasCheck = true;

				ScoreIt.foulee = section.rows[index].id;
			});

			okButton.top = '432dp';
			okButton.left = '60dp'
			okButton.addEventListener('click', function() {
				if(ScoreIt.fouler == undefined || ScoreIt.foulTeam == undefined || ScoreIt.foulType == undefined) {
					alert('Please select a team, a player and a foul type');
				} else if(drewBy.value == true && ScoreIt.foulee == undefined) {
					alert('Please select the player that drew the foul');
				} else {
					var foulData;
					if(ScoreIt.elocation == undefined) {
						ScoreIt.elocation = [0, 0];
					}
					if(drewBy.value == true) {

						foulData = {
							"gameId" : "" + Ti.App.Properties.getList('selectedGame')[0].gameId + "",
							"committedBy" : "" + ScoreIt.fouler + "",
							"drewBy" : "" + ScoreIt.foulee + "",
							"foulType" : "" + ScoreIt.foulType.toLowerCase() + "",
							"ejected" : ejected.value,
							"location" : [ScoreIt.elocation[0], ScoreIt.elocation[1]],
							"context" : {
								"time" : "" + ScoreIt.timestamp(new Date()) + "",
								"homeScore" : ScoreIt.homeScore,
								"awayScore" : ScoreIt.awayScore
							}
						};
					} else {
						foulData = {
							"gameId" : "" + Ti.App.Properties.getList('selectedGame')[0].gameId + "",
							"committedBy" : "" + ScoreIt.fouler + "",
							"foulType" : "" + ScoreIt.foulType.toLowerCase() + "",
							"ejected" : ejected.value,
							"location" : [ScoreIt.elocation[0], ScoreIt.elocation[1]],
							"context" : {
								"time" : "" + ScoreIt.timestamp(new Date()) + "",
								"homeScore" : ScoreIt.homeScore,
								"awayScore" : ScoreIt.awayScore
							}
						};
					}

					ScoreIt.methodCall('foul', null, foulData);

					if(ScoreIt.foulTeam == ScoreIt.homeTeamName) {
						var fouls;

						for(var i = 0; i < ScoreIt.honField.length; i++) {
							if(ScoreIt.fouler == ScoreIt.honField[i].getId()) {
								ScoreIt.honField[i].updateFouls();
								fouls = ScoreIt.honField[i].getFouls();
							}
						}

						var view = ScoreIt.htplayers.children[ScoreIt.foulerIndex];
						view.children[2].text = '' + fouls + '';

					} else if(ScoreIt.foulTeam == ScoreIt.awayTeamName) {
						var fouls;

						for(var i = 0; i < ScoreIt.aonField.length; i++) {
							if(ScoreIt.fouler == ScoreIt.aonField[i].getId()) {
								ScoreIt.aonField[i].updateFouls();
								fouls = ScoreIt.aonField[i].getFouls();
							}
						}

						var view = ScoreIt.atplayers.children[ScoreIt.foulerIndex];
						view.children[2].text = '' + fouls + '';
					}

					if(Ti.App.Properties.getString('mresult') == 'error') {
						alert(Ti.App.Properties.getString('merror'));
					} else {
						//alert('The event id: ' + Ti.App.Properties.getString('theEvent'));
						alert('The event has been added. \nThe event id:\n' + Ti.App.Properties.getString('theEvent'));
						var newEvent = new ScoreIt.sEvent('foul', Ti.App.Properties.getString('theEvent'), foulData);
						ScoreIt.events.push(newEvent);
					}
					//alert('We will add the event');
					if(ScoreIt.nhtime != undefined) {
						ScoreIt.nhtime.start();
					}
					eWindow.close();
				}
			});
			cancelButton.top = '432dp';
			cancelButton.left = '145dp';
			cancelButton.addEventListener('click', function() {
				if(ScoreIt.nhtime != undefined) {
					ScoreIt.nhtime.start();
				}
				eWindow.close();
			});

			scrollView.add(ht);
			scrollView.add(at);
			scrollView.add(foulTypeTable);
			scrollView.add(foulerTable);
			scrollView.add(ejected);
			scrollView.add(drewBy);
			scrollView.add(fouleeTable);
			scrollView.add(okButton);
			scrollView.add(cancelButton);

			eWindow.add(scrollView);

			if(ScoreIt.nhtime != undefined) {
				ScoreIt.nhtime.stop();
			}
		}

		if(eventName == 'Shot') {
			var made = false;
			var miss = false;
			var scrollView = Ti.UI.createScrollView({
				contentHeight : 'auto',
				showVerticalScrollIndicator : true
			});
			eWindow.width = '300dp';
			eWindow.height = '450dp';
			eWindow.top = '10dp';
			eWindow.left = '10dp';
			eWindow.backgroundColor = '#336699';
			eWindow.add(scrollView);

			var mds = Ti.UI.createSwitch({
				title : 'Made Shot',
				value : true,
				enabled : true,
				top : '90dp',
				left : '110dp'
			});

			var mss = Ti.UI.createSwitch({
				title : 'Missed Shot',
				value : false,
				enabled : false,
				top : '130dp',
				left : '110dp'
			});

			var fastB = Ti.UI.createSwitch({
				title : 'Fast Break',
				value : false,
				top : '170dp',
				left : '110dp'
			});
			ScoreIt.fastBreak = false;

			var goalT = Ti.UI.createSwitch({
				title : 'Goaltending',
				value : false,
				top : '210dp',
				left : '110dp'
			});
			ScoreIt.goaltending = false;

			var abBy = Ti.UI.createSwitch({
				title : 'Assisted',
				value : false,
				top : '520dp',
				left : '110dp'
			});

			var stdata = [{
				title : 'Jump-Shot',
				hasCheck : false
			}, {
				title : 'Layup',
				hasCheck : false
			}, {
				title : 'Dunk',
				hasCheck : false
			}, {
				title : 'Tip-In',
				hasCheck : false
			}, {
				title : 'Free-Throw',
				hasCheck : false
			}];
			var shotTypeTable = Ti.UI.createTableView({
				headerTitle : 'Shot Type',
				data : stdata,
				width : '230dp',
				height : '80dp',
				top : '250dp',
				rowHeight : '35dp'
			});

			var pointsData = [{
				title : '1'
			}, {
				title : '2'
			}, {
				title : '3'
			}];
			var pointsTable = Ti.UI.createTableView({
				headerTitle : 'Points',
				data : pointsData,
				width : '230dp',
				height : '80dp',
				top : '340dp',
				rowHeight : '35dp'
			});

			var mmdata = [];
			var mmTable = Ti.UI.createTableView({
				headerTitle : 'Shooter',
				width : '230dp',
				height : '80dp',
				top : '430dp',
				rowHeight : '35dp'
			});

			var abdata = [];
			var abTable = Ti.UI.createTableView({
				headerTitle : 'Assisted By',
				width : '230dp',
				height : '80dp',
				top : '560dp',
				rowHeight : '35dp'
			});

			if(ScoreIt.isAndroid()) {
				at.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
				ht.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
				mds.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
				mss.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
				fastB.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
				goalT.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
				abBy.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
			} else {
				var mdsLabel = Ti.UI.createLabel({
					text : 'Made',
					left : '30dp',
					width : '75dp',
					height : '30dp',
					top : '90dp'
				});
				var mssLabel = Ti.UI.createLabel({
					text : 'Missed',
					left : '30dp',
					width : '75dp',
					height : '30dp',
					top : '130dp'
				});
				var fbLabel = Ti.UI.createLabel({
					text : 'Fast Break',
					left : '30dp',
					width : '75dp',
					height : '30dp',
					top : '170dp'
				});
				var gtLabel = Ti.UI.createLabel({
					text : 'Goaltending',
					left : '30dp',
					width : '75dp',
					height : '30dp',
					top : '210dp'
				});
				var abbLabel = Ti.UI.createLabel({
					text : 'Assisted By',
					left : '30dp',
					width : '75dp',
					height : '30dp',
					top : '520dp'
				});

				scrollView.add(mssLabel);
				scrollView.add(mdsLabel);
				scrollView.add(htlabel);
				scrollView.add(atlabel);
				scrollView.add(fbLabel);
				scrollView.add(gtLabel);
				scrollView.add(abbLabel);

			}

			mss.addEventListener('change', function() {
				//alert('value of missed ' + mss.value);
				if(mss.value == true) {
					miss = true;
					mds.enabled = false;
					mds.value = false;
					abTable.headerTitle = 'Blocked By';
					goalT.enabled = false;
					abBy.title = 'Blocked';
					if(!ScoreIt.isAndroid()) {
						abbLabel.text = 'Blocked';
					}

					if(abBy.value == true) {
						if(ScoreIt.shotTeam == ScoreIt.homeTeamName) {
							for(var s = 0; s < ScoreIt.aonField.length; s++) {
								abdata[s] = Ti.UI.createTableViewRow({
									id : ScoreIt.aonField[s].getId(),
									title : '' + ScoreIt.aonField[s].getJN() + ' ' + ScoreIt.aonField[s].getLName() + ', ' + ScoreIt.aonField[s].getFName() + ''
								});

								abTable.appendRow(abdata[s]);
							}
							abTable.data = abdata;
						} else if(ScoreIt.shotTeam == ScoreIt.awayTeamName) {
							for(var s = 0; s < ScoreIt.honField.length; s++) {
								abdata[s] = Ti.UI.createTableViewRow({
									id : ScoreIt.honField[s].getId(),
									title : '' + ScoreIt.honField[s].getJN() + ' ' + ScoreIt.honField[s].getLName() + ', ' + ScoreIt.honField[s].getFName() + ''
								});

								abTable.appendRow(abdata[s]);
							}

							abTable.data = abdata;
						}
					}

				} else if(mss.value == false) {
					miss = false;
					mds.enabled = true;
					//assistedBy.enabled = true;
					goalT.enabled = true;
				}
			});

			mds.addEventListener('change', function() {
				//alert('value of made ' + mds.value);
				if(mds.value == true) {
					made = true;
					mss.enabled = false;
					mss.value = false;
					abTable.headerTitle = 'Assisted By';
					abBy.title = 'Assisted';
					if(!ScoreIt.isAndroid()) {
						abbLabel.text = 'Assisted';
					}

					if(abBy.value == true) {
						if(ScoreIt.shotTeam == ScoreIt.homeTeamName) {
							for(var s = 0; s < ScoreIt.honField.length; s++) {
								abdata[s] = Ti.UI.createTableViewRow({
									id : ScoreIt.honField[s].getId(),
									title : '' + ScoreIt.honField[s].getJN() + ' ' + ScoreIt.honField[s].getLName() + ', ' + ScoreIt.honField[s].getFName() + ''
								});

								abTable.appendRow(abdata[s]);
							}
							abTable.data = abdata;
						} else if(ScoreIt.shotTeam == ScoreIt.awayTeamName) {
							for(var s = 0; s < ScoreIt.aonField.length; s++) {
								abdata[s] = Ti.UI.createTableViewRow({
									id : ScoreIt.aonField[s].getId(),
									title : '' + ScoreIt.aonField[s].getJN() + ' ' + ScoreIt.aonField[s].getLName() + ', ' + ScoreIt.aonField[s].getFName() + ''
								});

								abTable.appendRow(abdata[s]);
							}
							abTable.data = abdata;
						}
					}

				} else if(mds.value == false) {
					made = false;
					mss.enabled = true;
					//blockedBy.enabled = true;
				}
			});

			at.addEventListener('change', function() {
				if(at.value == true) {
					//alert('Away team is true');
					ht.enabled = false;
					ScoreIt.shotTeam = ScoreIt.awayTeamName;

					for(var s = 0; s < ScoreIt.aonField.length; s++) {
						mmdata[s] = Ti.UI.createTableViewRow({
							id : ScoreIt.aonField[s].getId(),
							title : '' + ScoreIt.aonField[s].getJN() + ' ' + ScoreIt.aonField[s].getLName() + ', ' + ScoreIt.aonField[s].getFName() + ''
						});

						mmTable.appendRow(mmdata[s]);
					}
					mmTable.data = mmdata;

				} else if(at.value == false) {
					ht.enabled = true;
					mmTable.data = [];
				}
			});

			ht.addEventListener('change', function() {
				if(ht.value == true) {
					//alert('Home team is true');
					at.enabled = false;
					ScoreIt.shotTeam = ScoreIt.homeTeamName;
					//alert(ScoreIt.shotTeam);
					for(var s = 0; s < ScoreIt.honField.length; s++) {
						mmdata[s] = Ti.UI.createTableViewRow({
							id : ScoreIt.honField[s].getId(),
							title : '' + ScoreIt.honField[s].getJN() + ' ' + ScoreIt.honField[s].getLName() + ', ' + ScoreIt.honField[s].getFName() + ''
						});

						mmTable.appendRow(mmdata[s]);
					}

					mmTable.data = mmdata;
				} else if(ht.value == false) {
					at.enabled = true;
					mmTable.data = [];
				}
			});

			fastB.addEventListener('change', function() {
				if(fastB.value == true) {
					ScoreIt.fastBreak = true;
				} else {
					ScoreIt.fastBreak = false;
				}
			});

			goalT.addEventListener('change', function() {
				if(goalT.value == true) {
					ScoreIt.goaltending = true;
				} else {
					ScoreIt.goaltending = false;
				}
			});

			abBy.addEventListener('change', function() {
				//alert('The value of the ab title: ' + abBy.title);
				if(abBy.value == true && abBy.title == 'Assisted') {
					if(ScoreIt.shotTeam == ScoreIt.homeTeamName) {
						for(var s = 0; s < ScoreIt.honField.length; s++) {
							abdata[s] = Ti.UI.createTableViewRow({
								id : ScoreIt.honField[s].getId(),
								title : '' + ScoreIt.honField[s].getJN() + ' ' + ScoreIt.honField[s].getLName() + ', ' + ScoreIt.honField[s].getFName() + ''
							});

							abTable.appendRow(abdata[s]);
						}
						abTable.data = abdata;
					} else if(ScoreIt.shotTeam == ScoreIt.awayTeamName) {
						for(var s = 0; s < ScoreIt.aonField.length; s++) {
							abdata[s] = Ti.UI.createTableViewRow({
								id : ScoreIt.aonField[s].getId(),
								title : '' + ScoreIt.aonField[s].getJN() + ' ' + ScoreIt.aonField[s].getLName() + ', ' + ScoreIt.aonField[s].getFName() + ''
							});

							abTable.appendRow(abdata[s]);
						}
						abTable.data = abdata;
					}

				} else if(abBy.value == true && abBy.title == 'Blocked') {
					if(ScoreIt.shotTeam == ScoreIt.homeTeamName) {
						for(var s = 0; s < ScoreIt.aonField.length; s++) {
							abdata[s] = Ti.UI.createTableViewRow({
								id : ScoreIt.aonField[s].getId(),
								title : '' + ScoreIt.aonField[s].getJN() + ' ' + ScoreIt.aonField[s].getLName() + ', ' + ScoreIt.aonField[s].getFName() + ''
							});

							abTable.appendRow(abdata[s]);
						}
						abTable.data = abdata;
					} else if(ScoreIt.shotTeam == ScoreIt.awayTeamName) {
						for(var s = 0; s < ScoreIt.honField.length; s++) {
							abdata[s] = Ti.UI.createTableViewRow({
								id : ScoreIt.honField[s].getId(),
								title : '' + ScoreIt.honField[s].getJN() + ' ' + ScoreIt.honField[s].getLName() + ', ' + ScoreIt.honField[s].getFName() + ''
							});

							abTable.appendRow(abdata[s]);
						}

						abTable.data = abdata;
					}
				} else if(abBy.value == false) {
					abTable.data = [];
				}
			});

			shotTypeTable.addEventListener('click', function(e) {
				var index = e.index;
				var section = e.section;

				for(var i = 0; i < section.rows.length; i++) {
					section.rows[i].hasCheck = false;
				}
				// set current check
				section.rows[index].hasCheck = true;

				ScoreIt.shotType = e.rowData.title;
				//alert(e.rowData.title);
			});

			pointsTable.addEventListener('click', function(e) {
				var index = e.index;
				var section = e.section;

				for(var i = 0; i < section.rows.length; i++) {
					section.rows[i].hasCheck = false;
				}
				// set current check
				section.rows[index].hasCheck = true;

				ScoreIt.points = e.rowData.title;
				//alert(e.rowData.title);
			});

			mmTable.addEventListener('click', function(e) {
				var index = e.index;
				var section = e.section;

				for(var i = 0; i < section.rows.length; i++) {
					section.rows[i].hasCheck = false;
				}
				// set current check
				section.rows[index].hasCheck = true;

				ScoreIt.shooter = section.rows[index].id;
				ScoreIt.shooterIndex = index;
				//alert(ScoreIt.shooter);
			});

			abTable.addEventListener('click', function(e) {
				var index = e.index;
				var section = e.section;

				for(var i = 0; i < section.rows.length; i++) {
					section.rows[i].hasCheck = false;
				}
				// set current check
				section.rows[index].hasCheck = true;

				ScoreIt.ab = section.rows[index].id;
			});

			okButton.top = '650dp';
			okButton.left = '60dp';
			okButton.addEventListener('click', function() {
				var theMethod;
				var shotData;
				if(ScoreIt.shooter == undefined || ScoreIt.shotType == undefined || ScoreIt.points == undefined || ScoreIt.shotTeam == undefined) {
					alert('Please select a team, a shooter, a shot type and the number of points');
					alert('The shooter: ' + ScoreIt.shooter + '\the shot type' + ScoreIt.shotType + '\the points' + ScoreIt.points + '\nthe shot team' + ScoreIt.shotTeam);
				} else if(mds.value == false && mss.value == false) {
					alert('Please select whether the shot is a made or missed shot');
				} else if(abBy.value == true && ScoreIt.ab == undefined) {
					alert('Please select who ' + abBy.title.toLowerCase() + ' the shot');
				} else if(ScoreIt.shotType == 'Free-Throw' && (ScoreIt.points == '2' || ScoreIt.points == '3')) {
					alert('The shot type Free-Throw can only be 1 point');
				} else if((ScoreIt.shotType == 'Layup' || ScoreIt.shotType == 'Dunk' || ScoreIt.shotType == 'Tip-In') && ScoreIt.points == '1') {
					alert('The shot type ' + ScoreIt.shotType + 'can only be 2 points');
				} else if(ScoreIt.shotType == 'Jump-Shot' && ScoreIt.points == '1') {
					alert('The shot type Jump-Shot can only be 2 or 3 points');
				} else {
					var shotData;
					var theMethod = '';
					if(mds.enabled == true && mds.value == true) {
						theMethod = 'madeShot';
						if(ScoreIt.shotTeam == ScoreIt.homeTeamName) {
							ScoreIt.homeScore = ScoreIt.homeScore + parseInt(ScoreIt.points);
							Ti.API.info('Updated HomeScore: ' + ScoreIt.homeScore);
							ScoreIt.htscore.text = '' + ScoreIt.homeScore + '';
							var ppoints;

							for(var i = 0; i < ScoreIt.honField.length; i++) {
								if(ScoreIt.shooter == ScoreIt.honField[i].getId()) {
									ScoreIt.honField[i].updatePoints(parseInt(ScoreIt.points));
									ppoints = ScoreIt.honField[i].getPoints();
								}
							}

							var view = ScoreIt.htplayers.children[ScoreIt.shooterIndex];
							view.children[1].text = '' + ppoints + '';

						} else if(ScoreIt.shotTeam == ScoreIt.awayTeamName) {
							ScoreIt.awayScore = ScoreIt.awayScore + parseInt(ScoreIt.points);
							Ti.API.info('Updated AwayScore: ' + ScoreIt.awayScore);
							ScoreIt.atscore.text = '' + ScoreIt.awayScore + '';

							for(var i = 0; i < ScoreIt.aonField.length; i++) {
								if(ScoreIt.shooter == ScoreIt.aonField[i].getId()) {
									ScoreIt.aonField[i].updatePoints(parseInt(ScoreIt.points));
									ppoints = ScoreIt.aonField[i].getPoints();
								}
							}

							var view = ScoreIt.atplayers.children[ScoreIt.shooterIndex];
							view.children[1].text = '' + ppoints + '';
						}

						if(ScoreIt.elocation == undefined) {
							ScoreIt.elocation = [0, 0];
						}

						
						if(abBy.value == true) {
							//alert('value of fastBreak ' + ScoreIt.fastBreak);
							//Ti.API.info('Made shot value of fast break: ' + ScoreIt.fastBreak);
							//Ti.API.info('Made shot value of goaltending: ' + ScoreIt.goaltending);
							shotData = {
								"gameId" : "" + Ti.App.Properties.getList('selectedGame')[0].gameId + "",
								"shooter" : "" + ScoreIt.shooter + "",
								"assistedBy" : "" + ScoreIt.ab + "",
								"shotType" : "" + ScoreIt.shotType.toLowerCase() + "",
								"pointsScored" : parseInt(ScoreIt.points),
								"fastBreakOpportunity" : ScoreIt.fastBreak,
								"goaltending" : ScoreIt.goaltending,
								"location" : [ScoreIt.elocation[0], ScoreIt.elocation[1]],
								"context" : {
									"time" : "" + ScoreIt.timestamp(new Date()) + "",
									"homeScore" : ScoreIt.homeScore,
									"awayScore" : ScoreIt.awayScore
								}
							};

						} else {
							//alert('value of fastBreak ' + ScoreIt.fastBreak);
							theMethod = 'madeShot';
							shotData = {
								"gameId" : "" + Ti.App.Properties.getList('selectedGame')[0].gameId + "",
								"shooter" : "" + ScoreIt.shooter + "",
								"shotType" : "" + ScoreIt.shotType.toLowerCase() + "",
								"pointsScored" : parseInt(ScoreIt.points),
								"fastBreakOpportunity" : ScoreIt.fastBreak,
								"goaltending" : ScoreIt.goaltending,
								"location" : [ScoreIt.elocation[0], ScoreIt.elocation[1]],
								"context" : {
									"time" : "" + ScoreIt.timestamp(new Date()) + "",
									"homeScore" : ScoreIt.homeScore,
									"awayScore" : ScoreIt.awayScore
								}
							};

						}

					} else if(mss.enabled == true && mss.value == true) {
						theMethod = 'missedShot';
						if(ScoreIt.elocation == undefined) {
							ScoreIt.elocation = [0, 0];
						}
						if(abBy.value == true) {

							shotData = {
								"gameId" : "" + Ti.App.Properties.getList('selectedGame')[0].gameId + "",
								"shooter" : "" + ScoreIt.shooter + "",
								"blockedBy" : "" + ScoreIt.ab + "",
								"shotType" : "" + ScoreIt.shotType.toLowerCase() + "",
								"pointsAttempted" : parseInt(ScoreIt.points),
								"fastBreakOpportunity" : ScoreIt.fastBreak,
								"location" : [ScoreIt.elocation[0], ScoreIt.elocation[1]],
								"context" : {
									"time" : "" + ScoreIt.timestamp(new Date()) + "",
									"homeScore" : ScoreIt.homeScore,
									"awayScore" : ScoreIt.awayScore
								}
							};

						} else {
							theMethod = 'missedShot';
							shotData = {
								"gameId" : "" + Ti.App.Properties.getList('selectedGame')[0].gameId + "",
								"shooter" : "" + ScoreIt.shooter + "",
								"shotType" : "" + ScoreIt.shotType.toLowerCase() + "",
								"pointsAttempted" : parseInt(ScoreIt.points),
								"fastBreakOpportunity" : ScoreIt.fastBreak,
								"location" : [ScoreIt.elocation[0], ScoreIt.elocation[1]],
								"context" : {
									"time" : "" + ScoreIt.timestamp(new Date()) + "",
									"homeScore" : ScoreIt.homeScore,
									"awayScore" : ScoreIt.awayScore
								}
							};
						}
					}
					
					/*var et = '';
					if(made == true){
						et = 'made';
						ScoreIt.methodCall('madeShot', null, shotData);
					}else if(miss == true){
						et = 'missed';
						ScoreIt.methodCall('missedShot', null, shotData);
					}*/
					
					ScoreIt.methodCall(theMethod, null, shotData);

					if(Ti.App.Properties.getString('mresult') == 'error') {
						alert(Ti.App.Properties.getString('merror'));
					} else {
						//alert('The event id: ' + Ti.App.Properties.getString('theEvent'));
						alert('The event has been added. \nThe event id:\n' + Ti.App.Properties.getString('theEvent') + '\nevent name: ' + theMethod);
						var newEvent = new ScoreIt.sEvent(theMethod, Ti.App.Properties.getString('theEvent'), shotData);
						ScoreIt.events.push(newEvent);
					}

					//alert('We will add the event');
					eWindow.close();
				}

			});
			cancelButton.top = '650dp';
			cancelButton.left = '145dp';
			cancelButton.addEventListener('click', function() {
				eWindow.close();
			});

			scrollView.add(ht);
			scrollView.add(at);
			scrollView.add(mds);
			scrollView.add(mss);
			scrollView.add(fastB);
			scrollView.add(goalT);
			scrollView.add(shotTypeTable);
			scrollView.add(pointsTable);
			scrollView.add(mmTable);
			scrollView.add(abBy);
			scrollView.add(abTable);
			scrollView.add(okButton);
			scrollView.add(cancelButton);

		}

		if(eventName == 'RB') {
			eWindow.width = '250dp';
			eWindow.height = '310dp';
			eWindow.top = '30dp';
			eWindow.left = '10dp';
			eWindow.backgroundColor = '#336699';
			eWindow.opacity = 0.9;

			var rtData = [{
				title : 'Offensive',
				hasCheck : false
			}, {
				title : 'Defensive',
				hasCheck : false
			}, {
				title : 'Dead-Ball',
				hasCheck : false
			}, {
				title : 'Team-Offensive',
				hasCheck : false
			}, {
				title : 'Team-Defensive',
				hasCheck : false
			}];
			var rTypeTable = Ti.UI.createTableView({
				data : rtData,
				headerTitle : 'Rebound Type',
				width : '230dp',
				height : '80dp',
				top : '90dp',
				rowHeight : '35dp'
			});

			var rbData = [];
			var rebounderTable = Ti.UI.createTableView({
				headerTitle : 'Rebounder',
				width : '230dp',
				height : '80dp',
				top : '180dp',
				rowHeight : '35dp'
			});

			if(ScoreIt.isAndroid()) {
				at.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
				ht.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
			} else {

				eWindow.add(htlabel);
				eWindow.add(atlabel);
			}

			at.addEventListener('change', function() {
				if(at.value == true) {
					ht.enabled = false;
					ScoreIt.rebTeam = ScoreIt.awayTeamName;
					for(var s = 0; s < ScoreIt.aonField.length; s++) {
						rbData[s] = Ti.UI.createTableViewRow({
							id : ScoreIt.aonField[s].getId(),
							title : '' + ScoreIt.aonField[s].getJN() + ' ' + ScoreIt.aonField[s].getLName() + ', ' + ScoreIt.aonField[s].getFName() + ''
						});

						rebounderTable.appendRow(rbData[s]);
					}
					rebounderTable.data = rbData;
				} else if(at.value == false) {
					ht.enabled = true;
					rebounderTable.data = [];
				}
			});

			ht.addEventListener('change', function() {
				if(ht.value == true) {
					at.enabled = false;
					ScoreIt.rebTeam = ScoreIt.homeTeamName;
					for(var s = 0; s < ScoreIt.honField.length; s++) {
						rbData[s] = Ti.UI.createTableViewRow({
							id : ScoreIt.honField[s].getId(),
							title : '' + ScoreIt.honField[s].getJN() + ' ' + ScoreIt.honField[s].getLName() + ', ' + ScoreIt.honField[s].getFName() + ''
						});

						rebounderTable.appendRow(rbData[s]);
					}
					rebounderTable.data = rbData;
				} else if(ht.value == false) {
					at.enabled = true;
					rebounderTable.data = [];
				}
			});

			rTypeTable.addEventListener('click', function(e) {
				var index = e.index;
				var section = e.section;

				for(var i = 0; i < section.rows.length; i++) {
					section.rows[i].hasCheck = false;
				}
				// set current check
				section.rows[index].hasCheck = true;

				ScoreIt.reboundType = e.rowData.title;
			});

			rebounderTable.addEventListener('click', function(e) {
				var index = e.index;
				var section = e.section;

				for(var i = 0; i < section.rows.length; i++) {
					section.rows[i].hasCheck = false;
				}
				// set current check
				section.rows[index].hasCheck = true;

				ScoreIt.rebounder = section.rows[index].id;
			});

			okButton.top = '275dp';
			okButton.addEventListener('click', function() {
				if(ScoreIt.rebounder == undefined || ScoreIt.reboundType == undefined || ScoreIt.rebTeam == undefined) {
					alert('Please select a team, a rebounder and a rebound type');
				} else {
					if(ScoreIt.elocation == undefined) {
						ScoreIt.elocation = [0, 0];
					}
					var reboundData = {
						"gameId" : "" + Ti.App.Properties.getList('selectedGame')[0].gameId + "",
						"rebounder" : "" + ScoreIt.rebounder + "",
						"reboundType" : "" + ScoreIt.reboundType.toLowerCase() + "",
						"location" : [ScoreIt.elocation[0], ScoreIt.elocation[1]],
						"context" : {
							"time" : "" + ScoreIt.timestamp(new Date()) + "",
							"homeScore" : ScoreIt.homeScore,
							"awayScore" : ScoreIt.awayScore
						}
					};

					ScoreIt.methodCall('rebound', null, reboundData);

					if(Ti.App.Properties.getString('mresult') == 'error') {
						alert(Ti.App.Properties.getString('merror'));
					} else {
						//alert('The event id: ' + Ti.App.Properties.getString('theEvent'));
						alert('The event has been added. \nThe event id:\n' + Ti.App.Properties.getString('theEvent'));
						var newEvent = new ScoreIt.sEvent('rebound', Ti.App.Properties.getString('theEvent'), reboundData);
						ScoreIt.events.push(newEvent);
					}
					//alert('We will add the event');
					eWindow.close();
				}
			});
			cancelButton.top = '275dp';
			cancelButton.addEventListener('click', function() {
				eWindow.close();
			});

			eWindow.add(ht);
			eWindow.add(at);
			eWindow.add(rTypeTable);
			eWindow.add(rebounderTable);
			eWindow.add(okButton);
			eWindow.add(cancelButton);
		}

		if(eventName == 'JB') {
			eWindow.width = '250dp';
			eWindow.height = '300dp';
			eWindow.top = '40dp';
			eWindow.left = '10dp';
			eWindow.backgroundColor = '#336699';
			eWindow.opacity = 0.9;

			ht.top = '190dp';
			at.top = '230dp';

			//atTable.data = [];
			var atdata = [];
			for(var t = 0; t < ScoreIt.aonField.length; t++) {
				atdata[t] = Ti.UI.createTableViewRow({
					id : ScoreIt.aonField[t].getId(),
					title : '' + ScoreIt.aonField[t].getJN() + ' ' + ScoreIt.aonField[t].getLName() + ', ' + ScoreIt.aonField[t].getFName() + '',
					hasCheck : false
				});

			}
			var atTable = Ti.UI.createTableView({
				data : atdata,
				headerTitle : 'Away Player',
				width : '230dp',
				height : '80dp',
				top : '100dp',
				rowHeight : '35dp'
			});

			//htTable.data = [];
			var htdata = [];
			for(var t = 0; t < ScoreIt.honField.length; t++) {
				htdata[t] = Ti.UI.createTableViewRow({
					id : ScoreIt.honField[t].getId(),
					title : '' + ScoreIt.honField[t].getJN() + ' ' + ScoreIt.honField[t].getLName() + ', ' + ScoreIt.honField[t].getFName() + '',
					hasCheck : false
				});
			}
			var htTable = Ti.UI.createTableView({
				data : htdata,
				headerTitle : 'Home Player',
				width : '230dp',
				height : '80dp',
				top : '10dp',
				rowHeight : '35dp'
			});

			atTable.addEventListener('click', function(e) {
				var index = e.index;
				var section = e.section;

				for(var i = 0; i < section.rows.length; i++) {
					section.rows[i].hasCheck = false;
				}
				// set current check
				section.rows[index].hasCheck = true;

				ScoreIt.awayJumper = section.rows[index].id;

			});

			htTable.addEventListener('click', function(e) {
				var index = e.index;
				var section = e.section;

				for(var i = 0; i < section.rows.length; i++) {
					section.rows[i].hasCheck = false;
				}
				// set current check
				section.rows[index].hasCheck = true;

				ScoreIt.homeJumper = section.rows[index].id;
			});

			if(ScoreIt.isAndroid()) {
				at.title = 'Won by Away';
				ht.title = 'Won by Home';
				at.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
				ht.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
			} else {
				ht.left = '130dp';
				htlabel.text = 'Won by Home';
				htlabel.top = '190dp';
				htlabel.width = '110dp';
				htlabel.left = '10dp';

				at.left = '130dp';
				atlabel.text = 'Won by Away';
				atlabel.width = '110dp';
				atlabel.left = '10dp';
				eWindow.add(htlabel);
				atlabel.top = '230dp';
				eWindow.add(atlabel);
			}

			at.addEventListener('change', function() {
				if(at.value == true) {
					ht.enabled = false;
					ScoreIt.jumpWinner = ScoreIt.awayJumper;
					ScoreIt.poss = 'home';
				} else if(at.value == false) {
					ht.enabled = true;
					ScoreIt.jumpWinner = '';
				}
			});

			ht.addEventListener('change', function() {
				if(ht.value == true) {
					at.enabled = false;
					ScoreIt.jumpWinner = ScoreIt.homeJumper;
					ScoreIt.poss = 'away';
				} else if(ht.value == false) {
					at.enabled = true;
					ScoreIt.jumpWinner = '';
				}
			});

			okButton.top = '270dp';
			okButton.addEventListener('click', function() {
				if(ScoreIt.jumpWinner == '') {
					alert('Please select a home and away player and a winner');
				} else {
					if(ScoreIt.elocation == undefined) {
						ScoreIt.elocation = [250, 470];
					}
					var jwinner = {
						"gameId" : "" + Ti.App.Properties.getList('selectedGame')[0].gameId + "",
						"homePlayer" : "" + ScoreIt.homeJumper + "",
						"awayPlayer" : "" + ScoreIt.awayJumper + "",
						"winner" : "" + ScoreIt.jumpWinner + "",
						"location" : [ScoreIt.elocation[0], ScoreIt.elocation[1]],
						"context" : {
							"time" : "" + ScoreIt.timestamp(new Date()) + "",
							"homeScore" : ScoreIt.homeScore,
							"awayScore" : ScoreIt.awayScore
						}
					};

					ScoreIt.methodCall('jumpBall', null, jwinner);

					if(ScoreIt.poss == 'home') {
						ScoreIt.hteamPoss.show();
						ScoreIt.ateamPoss.hide();
					} else if(ScoreIt.poss == 'away') {
						ScoreIt.hteamPoss.hide();
						ScoreIt.ateamPoss.show();
					}

					if(Ti.App.Properties.getString('mresult') == 'error') {
						alert(Ti.App.Properties.getString('merror'));
					} else {
						//alert('The event id: ' + Ti.App.Properties.getString('theEvent'));
						alert('The event has been added.' /*\nThe event id:\n' + Ti.App.Properties.getString('theEvent')*/);
						var newEvent = new ScoreIt.sEvent('jumpBall', Ti.App.Properties.getString('theEvent'), jwinner);
						ScoreIt.events.push(newEvent);
					}

					//alert('We will add the event');
					eWindow.close();
				}
			});
			cancelButton.top = '270dp';
			cancelButton.addEventListener('click', function() {
				eWindow.close();
			});

			eWindow.add(atTable);
			eWindow.add(htTable);
			eWindow.add(ht);
			eWindow.add(at);
			eWindow.add(okButton);
			eWindow.add(cancelButton);

		}

		if(eventName == 'TO') {
			eWindow.width = '250dp';
			eWindow.height = '440dp';
			eWindow.top = '10dp';
			eWindow.left = '10dp';
			eWindow.backgroundColor = '#336699';
			eWindow.opacity = 0.9;

			var totdata = [{
				title : 'Traveling',
				hasCheck : false
			}, {
				title : 'Lost-Ball',
				hasCheck : false
			}, {
				title : 'Offensive-Foul',
				hasCheck : false
			}, {
				title : 'Out-of-Bounds',
				hasCheck : false
			}, {
				title : 'Violation',
				hasCheck : false
			}, {
				title : 'Offensive-Goaltending',
				hasCheck : false
			}, {
				title : 'Thown-Away',
				hasCheck : false
			}];
			var toTypeTable = Ti.UI.createTableView({
				headerTitle : 'Turnover Type',
				data : totdata,
				width : '230dp',
				height : '80dp',
				top : '90dp',
				rowHeight : '35dp'
			});

			var topdata = [];
			var toPlayerTable = Ti.UI.createTableView({
				headerTitle : 'Turnover By',
				width : '230dp',
				height : '80dp',
				top : '180dp',
				rowHeight : '35dp'
			});

			var fbdata = [];
			var forcedByTable = Ti.UI.createTableView({
				headerTitle : 'Forced By',
				width : '230dp',
				height : '80dp',
				top : '305dp',
				rowHeight : '35dp'
			});

			var forcedBy = Ti.UI.createSwitch({
				title : 'Forced By',
				value : false,
				top : '270dp',
				left : '110dp'
			});

			if(ScoreIt.isAndroid()) {
				at.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
				ht.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
				forcedBy.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
			} else {
				var forcedByLabel = Ti.UI.createLabel({
					text : 'Forced By',
					width : '75dp',
					height : '30dp',
					top : '270dp',
					left : '30dp'
				});

				eWindow.add(htlabel);
				eWindow.add(atlabel);
				eWindow.add(forcedByLabel);
			}

			at.addEventListener('change', function() {
				if(at.value == true) {
					ht.enabled = false;
					ScoreIt.toTeam = ScoreIt.awayTeamName;
					for(var t = 0; t < ScoreIt.aonField.length; t++) {
						topdata[t] = Ti.UI.createTableViewRow({
							id : ScoreIt.aonField[t].getId(),
							title : '' + ScoreIt.aonField[t].getJN() + ' ' + ScoreIt.aonField[t].getLName() + ', ' + ScoreIt.aonField[t].getFName() + '',
							hasCheck : false
						});

						toPlayerTable.appendRow(topdata[t]);
					}

					toPlayerTable.data = topdata;
				} else if(at.value == false) {
					ht.enabled = true;
					toPlayerTable.data = [];
				}
			});

			ht.addEventListener('change', function() {
				if(ht.value == true) {
					at.enabled = false;
					ScoreIt.toTeam = ScoreIt.homeTeamName;
					for(var t = 0; t < ScoreIt.honField.length; t++) {
						topdata[t] = Ti.UI.createTableViewRow({
							id : ScoreIt.honField[t].getId(),
							title : '' + ScoreIt.honField[t].getJN() + ' ' + ScoreIt.honField[t].getLName() + ', ' + ScoreIt.honField[t].getFName() + '',
							hasCheck : false
						});

						toPlayerTable.appendRow(topdata[t]);
					}

					toPlayerTable.data = topdata;
				} else if(ht.value == false) {
					at.enabled = true;
					toPlayerTable.data = [];
				}
			});

			forcedBy.addEventListener('change', function(e) {
				if(forcedBy.value == true && ScoreIt.toTeam == ScoreIt.homeTeamName) {
					for(var ht = 0; ht < ScoreIt.aonField.length; ht++) {
						fbdata[ht] = Ti.UI.createTableViewRow({
							id : ScoreIt.aonField[ht].getId(),
							title : '' + ScoreIt.aonField[ht].getJN() + ' ' + ScoreIt.aonField[ht].getLName() + ', ' + ScoreIt.aonField[ht].getFName() + '',
							hasCheck : false
						});

						forcedByTable.appendRow(fbdata[ht]);
					}

					forcedByTable.data = fbdata;
				} else if(forcedBy.value == true && ScoreIt.toTeam == ScoreIt.awayTeamName) {
					for(var ht = 0; ht < ScoreIt.honField.length; ht++) {
						fbdata[ht] = Ti.UI.createTableViewRow({
							id : ScoreIt.honField[ht].getId(),
							title : '' + ScoreIt.honField[ht].getJN() + ' ' + ScoreIt.honField[ht].getLName() + ', ' + ScoreIt.honField[ht].getFName() + '',
							hasCheck : false
						});

						forcedByTable.appendRow(fbdata[ht]);
					}

					forcedByTable.data = fbdata;
				} else if(forcedBy.value == false) {
					forcedByTable.data = [];
				}
			});

			toTypeTable.addEventListener('click', function(e) {
				var index = e.index;
				var section = e.section;

				for(var i = 0; i < section.rows.length; i++) {
					section.rows[i].hasCheck = false;
				}
				// set current check
				section.rows[index].hasCheck = true;

				ScoreIt.toType = e.rowData.title;
			});

			toPlayerTable.addEventListener('click', function(e) {
				var index = e.index;
				var section = e.section;

				for(var i = 0; i < section.rows.length; i++) {
					section.rows[i].hasCheck = false;
				}
				// set current check
				section.rows[index].hasCheck = true;

				ScoreIt.toPlayer = section.rows[index].id;
			});

			forcedByTable.addEventListener('click', function(e) {
				var index = e.index;
				var section = e.section;

				for(var i = 0; i < section.rows.length; i++) {
					section.rows[i].hasCheck = false;
				}
				// set current check
				section.rows[index].hasCheck = true;

				ScoreIt.forcedBy = section.rows[index].id;
			});

			okButton.top = '400dp';
			okButton.addEventListener('click', function() {
				if(ScoreIt.toPlayer == undefined || ScoreIt.toType == undefined || ScoreIt.toTeam == undefined) {
					alert('Please select a team, a turnover type and a player that committed the turnover');
				} else if(forcedBy.value == true && ScoreIt.forcedBy == undefined) {
					alert('Please select the player who forced the turnover');
				} else {
					var turnoverData;
					if(ScoreIt.elocation == undefined) {
						ScoreIt.elocation = [0, 0];
					}
					if(forcedBy == true) {
						turnoverData = {
							"gameId" : "" + Ti.App.Properties.getList('selectedGame')[0].gameId + "",
							"committedBy" : "" + ScoreIt.toPlayer + "",
							"forcedBy" : "" + +ScoreIt.forcedBy + "",
							"turnoverType" : "" + ScoreIt.toType.toLowerCase() + "",
							"location" : [ScoreIt.elocation[0], ScoreIt.elocation[1]],
							"context" : {
								"time" : "" + ScoreIt.timestamp(new Date()) + "",
								"homeScore" : ScoreIt.homeScore,
								"awayScore" : ScoreIt.awayScore
							}
						};
					} else {
						turnoverData = {
							"gameId" : "" + Ti.App.Properties.getList('selectedGame')[0].gameId + "",
							"committedBy" : "" + ScoreIt.toPlayer + "",
							"turnoverType" : "" + ScoreIt.toType.toLowerCase() + "",
							"location" : [ScoreIt.elocation[0], ScoreIt.elocation[1]],
							"context" : {
								"time" : "" + ScoreIt.timestamp(new Date()) + "",
								"homeScore" : ScoreIt.homeScore,
								"awayScore" : ScoreIt.awayScore
							}
						};
					}

					ScoreIt.methodCall('turnover', null, turnoverData);

					if(Ti.App.Properties.getString('mresult') == 'error') {
						alert(Ti.App.Properties.getString('merror'));
					} else {
						//alert('The event id: ' + Ti.App.Properties.getString('theEvent'));
						alert('The event has been added. \nThe event id:\n' + Ti.App.Properties.getString('theEvent'));
						var newEvent = new ScoreIt.sEvent('turnover', Ti.App.Properties.getString('theEvent'), turnoverData);
						ScoreIt.events.push(newEvent);
					}
					//alert('We will add the event');
					eWindow.close();
				}
			});
			cancelButton.top = '400dp';
			cancelButton.addEventListener('click', function() {
				eWindow.close();
			});

			eWindow.add(ht);
			eWindow.add(at);
			eWindow.add(toTypeTable);
			eWindow.add(toPlayerTable);
			eWindow.add(forcedBy);
			eWindow.add(forcedByTable);
			eWindow.add(okButton);
			eWindow.add(cancelButton);
		}

		return eWindow;
		//eWindow.open();
	};
})();
