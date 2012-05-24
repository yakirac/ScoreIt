/**
 * @author Yakira Bristol
 */
(function() {
	ScoreIt.ui.createScoringWindow = function() {
		var scoringWindow = Ti.UI.createWindow({
			id : 'scoringWindow',
			title : 'Play by Play',
			barColor : '#414444',
			navBarHidden : false,
			backgroundImage : 'nimages/woodb.png'
		});

		var scoringView = Ti.UI.createScrollView({
			contentWidth : 'auto',
			contentHeight : 'auto',
			showVerticalScrollIndicator : true,
			showHorizontalScrollIndicator : true
		});

		var playerLabel = function() {
			var pLabel = Ti.UI.createLabel({
				text : 'P',
				top : 0,
				left : 0,
				width : 60,
				height : 30,
				color : '#fff'
			});

			return pLabel;
		};
		var pointsLabel = function() {
			var ptsLabel = Ti.UI.createLabel({
				text : 'Pts',
				top : 0,
				left : 30,
				width : 60,
				height : 30,
				color : '#fff'
			});

			return ptsLabel;
		};
		var foulsLabel = function() {
			var fLabel = Ti.UI.createLabel({
				text : 'F',
				top : 0,
				left : 70,
				width : 60,
				height : 30,
				color : '#fff'
			});

			return fLabel;
		};

		ScoreIt.playerView = function(number, points, fouls, tp) {
			var view = Ti.UI.createView();
			var player = Ti.UI.createLabel({
				text : number,
				top : tp,
				left : 0,
				width : 60,
				height : 30,
				//textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
				color : '#fff'
			});
			var playerPoints = Ti.UI.createLabel({
				text : points,
				top : tp,
				left : 30,
				width : 60,
				height : 30,
				//textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
				color : '#fff'
			});
			var playerFouls = Ti.UI.createLabel({
				text : fouls,
				top : tp,
				left : 70,
				width : 60,
				height : 30,
				//textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
				color : '#fff'
			});

			view.add(player);
			view.add(playerPoints);
			view.add(playerFouls);

			return view;
		};

		var getLeft = function(component) {
			if(component == 'htv') {
				if(ScoreIt.isAndroid && Ti.Platform.displayCaps.platformWidth > 320) {
					return 40;
				} else {
					return 5;
				}
			} else if(component == 'qtsv' || component == 'pv') {
				if(ScoreIt.isAndroid && Ti.Platform.displayCaps.platformWidth > 320) {
					return 200;
				} else {
					return 120;
				}
			}
		};

		ScoreIt.getTop = function(component) {
			if(component == 'playersView') {
				var top;
				if(ScoreIt.isAndroid && Ti.Platform.displayCaps.platformWidth > 320) {
					return -65;
				} else {
					return 20;
				}
			} else if(component == 'player') {
				if(ScoreIt.isAndroid && Ti.Platform.displayCaps.platformWidth > 320) {
					return 50;
				} else {
					return 20;
				}
			}

			//alert('Value of playersView: ' + top);
		};

		/*var osname = Ti.Platform.osname;
		var os = function(/*Objectmap) {
		var def = map.def||null; //default function or value
		if (map[osname]) {
		if (typeof map[osname] == 'function') { return map[osname](); }
		else { return map[osname]; }
		}
		else {
		if (typeof def == 'function') { return def(); }
		else { return def; }
		}
		};*/

		//Main view of the window
		var gameState = Ti.UI.createScrollView({
			top : '3%',
			height : 250
		});

		//Home Team View
		var htv = Ti.UI.createView({
			top : '3%',
			left : '' + getLeft('htv') + ''
		});
		//Home label and score text area view
		var homeScoreView = Ti.UI.createView({
			top : 0
		});
		//Home Label
		var hteamLabel = Ti.UI.createLabel({
			text : 'Home:',
			width : 65,
			height : 30,
			top : 0,
			left : 0,
			color : '#fff'
			/*
			 font: {
			 fontFamily: os({
			 iphone:'Spicy Rice',
			 ipad: 'Spicy Rice',
			 android:'SpicyRice-Regular'
			 }),
			 fonSize: '10dp'
			 }*/

		});

		//score text area
		var hsLeft;
		if(ScoreIt.isAndroid && Ti.Platform.displayCaps.platformWidth > 320) {
			hsLeft = '45dp';
		} else {
			hsLeft = '55dp';
		}
		ScoreIt.htscore = Ti.UI.createLabel({
			text : '' + ScoreIt.homeScore + '',
			//editable: false,
			//enabled: false,
			width : '35dp',
			height : '30dp',
			top : '0dp',
			left : hsLeft,
			//backgroundColor: 'white',
			//borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			font : {
				fontFamily : ScoreIt.os({
					iphone : 'Digital-7',
					ipad : 'Digital-7',
					android : 'digital-7'
				}),
				fontSize : '24dp'
			},
			color : 'green'
			//backgroundColor: 'transparent'
		});
		homeScoreView.add(hteamLabel);
		homeScoreView.add(ScoreIt.htscore);

		//timeouts view
		ScoreIt.hto = Ti.UI.createView({
			top : 30
		});
		//5 timeout images
		var location = 0;
		for(var h = 0; h < 5; h++) {
			var to = Ti.UI.createImageView({
				image : ScoreIt.path.R + 'nimages/dot.png',
				top : 0,
				left : location,
				width : 8,
				height : 8
			});
			ScoreIt.hto.add(to);
			location = location + 10;
		}

		//Players on the field view
		var hponf = Ti.UI.createView({
			top : 50
		});
		//player labels view
		var hpofLabels = Ti.UI.createView({
			top : 0
		});
		hpofLabels.add(playerLabel());
		hpofLabels.add(pointsLabel());
		hpofLabels.add(foulsLabel());

		//Players view
		ScoreIt.htplayers = Ti.UI.createView({
			top : ScoreIt.getTop('playersView')
		});
		//Player view
		var top = 0;
		for(var hp = 0; hp < ScoreIt.honField.length; hp++) {
			ScoreIt.htplayers.add(ScoreIt.playerView('' + ScoreIt.honField[hp].getJN() + '', '' + ScoreIt.honField[hp].getPoints() + '', '' + ScoreIt.honField[hp].getFouls() + '', top));
			top = top + ScoreIt.getTop('player');
		}
		hponf.add(hpofLabels);
		hponf.add(ScoreIt.htplayers);

		htv.add(homeScoreView);
		htv.add(ScoreIt.hto);
		htv.add(hponf);

		//Away Team View
		var atv = Ti.UI.createView({
			top : '3%',
			left : '220dp'
		});
		//Away label and score text area view
		var awayScoreView = Ti.UI.createView({
			top : 0
		});
		//Away Label
		var ateamLabel = Ti.UI.createLabel({
			text : 'Away:',
			width : 60,
			height : 30,
			top : 0,
			left : 0,
			color : '#fff'
		});

		//score text area
		var asLeft;
		if(ScoreIt.isAndroid && Ti.Platform.displayCaps.platformWidth > 320) {
			asLeft = '40dp';
		} else {
			asLeft = '55dp';
		}
		ScoreIt.atscore = Ti.UI.createLabel({
			text : '' + ScoreIt.awayScore + '',
			//editable: false,
			//enabled: false,
			width : '35dp',
			height : '30dp',
			top : '0dp',
			left : asLeft,
			//backgroundColor: 'white',
			//borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			font : {
				fontFamily : ScoreIt.os({
					iphone : 'Digital-7',
					ipad : 'Digital-7',
					android : 'digital-7'
				}),
				fontSize : '24dp'
			},
			color : 'green'
		});
		awayScoreView.add(ateamLabel);
		awayScoreView.add(ScoreIt.atscore);

		//timeouts view
		ScoreIt.ato = Ti.UI.createView({
			top : 30
		});
		//5 timeout images
		var location = 0;
		for(var a = 0; a < 5; a++) {
			var to = Ti.UI.createImageView({
				image : ScoreIt.path.R + 'nimages/dot.png',
				top : 0,
				left : location,
				width : 8,
				height : 8
			});
			ScoreIt.ato.add(to);
			location = location + 10;
		}
		//Players on the field view
		var aponf = Ti.UI.createView({
			top : 50
		});
		//player labels view
		var apofLabels = Ti.UI.createView({
			top : 0
		});
		apofLabels.add(playerLabel());
		apofLabels.add(pointsLabel());
		apofLabels.add(foulsLabel());
		//Players view
		ScoreIt.atplayers = Ti.UI.createView({
			top : ScoreIt.getTop('playersView')
		});
		//Player view
		var top = 0;
		for(var ap = 0; ap < ScoreIt.aonField.length; ap++) {
			ScoreIt.atplayers.add(ScoreIt.playerView('' + ScoreIt.aonField[ap].getJN() + '', '' + ScoreIt.aonField[ap].getPoints() + '', '' + ScoreIt.aonField[ap].getFouls() + '', top));
			top = top + ScoreIt.getTop('player');
		}
		aponf.add(apofLabels);
		aponf.add(ScoreIt.atplayers);

		atv.add(awayScoreView);
		atv.add(ScoreIt.ato);
		atv.add(aponf);

		//Quarter Time Shotclock View
		var qtsv = Ti.UI.createView({
			top : '5%',
			left : '' + getLeft('qtsv') + '',
			width : 80
		});
		//Quarter Label
		ScoreIt.quarter = Ti.UI.createLabel({
			text : ScoreIt.half,
			top : 0,
			width : 80,
			height : 30,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			color : '#fff'
		});
		//Time label
		ScoreIt.gtime = Ti.UI.createLabel({
			text : '20:00',
			top : 30,
			width : 75,
			height : 30,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			color : 'yellow',
			font : {
				fontFamily : ScoreIt.os({
					iphone : 'Digital-7',
					ipad : 'Digital-7',
					android : 'digital-7'
				}),
				fontSize : '24dp'
			}
		});
		//Shot Clock Label
		var shotClock = Ti.UI.createLabel({
			text : '30',
			top : 60,
			width : 60,
			height : 30,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			color : '#fff'
		});
		qtsv.add(ScoreIt.quarter);
		qtsv.add(ScoreIt.gtime);
		//qtsv.add(shotClock);

		//Possession View
		var pv = Ti.UI.createView({
			top : '50%',
			left : '' + getLeft('pv') + ''
		});

		var hleft;
		var aleft;
		if(ScoreIt.isAndroid && Ti.Platform.displayCaps.platformWidth > 320) {
			hleft = '0dp';
			aleft = '50dp';
		} else {
			hleft = '8dp';
			aleft = '65dp';
		}
		//Home possession
		ScoreIt.hteamPoss = Ti.UI.createView({
			backgroundImage : ScoreIt.path.R + 'nimages/dot.png',
			width : 10,
			height : 10,
			top : '8dp',
			left : hleft,
			visible : false
		});
		//Possession Label
		var poss = Ti.UI.createLabel({
			text : 'Poss',
			top : 0,
			left : 21,
			width : '40dp',
			height : '25dp',
			color : '#fff'
		});
		//Away Possession
		ScoreIt.ateamPoss = Ti.UI.createView({
			backgroundImage : ScoreIt.path.R + 'nimages/dot.png',
			width : 10,
			height : 10,
			top : '8dp',
			left : aleft,
			visible : false
		});
		pv.add(ScoreIt.hteamPoss);
		pv.add(poss);
		pv.add(ScoreIt.ateamPoss);

		gameState.add(htv);
		gameState.add(atv);
		gameState.add(qtsv);
		gameState.add(pv);

		//Which events can be recorded
		var eventsBar = Ti.UI.createView({
			backgroundImage : ScoreIt.path.R + 'nimages/lback.png',
			top : '210dp',
			height : 40
		});

		var bwidth;
		var bheight
		var mleft;
		var fs;
		if(ScoreIt.isAndroid && Ti.Platform.displayCaps.platformWidth > 320) {
			bwidth = '46dp';
			bheight = 40;
			mleft = 75;
			fs = 12;
		} else {
			bwidth = '45dp';
			bheight = 30;
			mleft = 50;
			fs = 10;
		}

		var bleft = 10;
		var eventTypes = ['Foul', 'Shot', 'RB', 'JB', 'TO', 'More...'];
		for(var e = 0; e < eventTypes.length; e++) {
			var eventButton = Ti.UI.createButton({
				color : 'black',
				title : eventTypes[e],
				width : bwidth,
				height : bheight,
				top : 4,
				left : bleft,
				borderRadius : 5,
				font : {
					fontSize : fs,
					fontWeight : 'bold'
				}
			});
			eventsBar.add(eventButton);
			bleft = bleft + mleft;
		}

		var moreEvents;
		var sEvent;
		var moreOpen = false;
		eventsBar.addEventListener('click', function(e) {
			//alert('You clicked on ' + e.source.title);
			if(e.source.title == 'More...') {
				if(moreOpen == false) {
					moreOpen = true;
					moreEvents = ScoreIt.ui.createEventWindow(e.source.title);
					moreEvents.open();

					scoringWindow.addEventListener('close', function() {
						if(moreOpen == true) {
							moreEvents.close();
						}
					});

					//scoringWindow.addEventListener('android:back', function(){
					//	if(moreOpen == true){
					//		sEvent.close();
					//	}
					//});
				} else {
					moreOpen = false;
					moreEvents.close();
				}
			} else {
				sEvent = ScoreIt.ui.createEventWindow(e.source.title);
				if(e.source.title == 'JB') {
					sEvent.open();
				} else {
					if((ScoreIt.half == '1st Half' && ScoreIt.fHalfStarted == undefined) || (ScoreIt.half == '2nd Half' && ScoreIt.sHalfStarted == undefined)) {
						alert('You have to start the half before you can do that');
					} else {
						sEvent.open();
					}
				}

			}

		});

		//Contains the shooting chart for each team
		var cWidth;
		if(ScoreIt.isAndroid && Ti.Platform.displayCaps.platformWidth > 320) {
			cWidth = 420;
		} else {
			cWidth = 310;
		}
		var court = Ti.UI.createView({
			backgroundImage : ScoreIt.path.R + 'nimages/halfcourt.png',
			top : '270dp',
			width : cWidth,
			height : 472
			//contentWidth: 'auto',
			//contentHeight: 'auto',
			//showVerticalScrollIndicator:true,
			//showHorizontalScrollIndicator:true
		});

		court.addEventListener('click', function(e) {
			//alert('x: ' + e.x + 'y: ' + e.y);
			var imageView = Ti.UI.createImageView({
				image : ScoreIt.path.R + 'nimages/dot.png',
				width : 8,
				height : 8,
				top : e.y,
				left : e.x
			});

			court.add(imageView);

			ScoreIt.elocation = [e.x, e.y];
		})
		var cback = Ti.UI.createView({
			//backgroundImage: ScoreIt.path.R + 'nimages/halfcourt.png',
			width : 310,
			height : 472,
			top : 0
		});
		//court.add(cback);

		var hteamShot = Ti.UI.createImageView();
		var ateamShot = Ti.UI.createImageView();

		scoringView.add(gameState);
		scoringView.add(eventsBar);
		scoringView.add(court);

		scoringWindow.add(scoringView);
		//scoringWindow.add(gameState);
		//scoringWindow.add(eventsBar);
		//scoringWindow.add(court);

		return scoringWindow;
	};
})();
