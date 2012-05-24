(function() {
	if(ScoreIt.isLargeScreen()) {
		ScoreIt.ui = {
			mainBackgroundImage : 'nimages/back.png',
			dashboardHeight : 340,
			dashboardWidth : 612
		};
	} else {
		ScoreIt.ui = {
			mainBackgroundImage : 'nimages/back.png',
			dashboardHeight : 170,
			dashboardWidth : 306
		};
	}

	if(ScoreIt.isAndroid()) {
		ScoreIt.ui.backgroundSelectedProperty = 'backgrounSelected';
	} else {
		ScoreIt.ui.backgroundSelectedProperty = 'selectedBackground';
	}

	ScoreIt.extend(ScoreIt.ui, {
		backgroundSelectedColor : '#999'
	});

})();
