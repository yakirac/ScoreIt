/**
 * @author Yakira Bristol
 */
(function() {
	var navWindow;
	var mainWindow = Ti.UI.createWindow({
		title : 'Sign In',
		navBarHidden : true,
		exitOnClose : true,
		backgroundImage : 'nimages/back.png'
	});

	var applogo = Ti.UI.createImageView({
		image : ScoreIt.path.R + 'nimages/ScoreItLogo.png',
		width : '200dp',
		height : '100dp',
		top : '5dp'
	});

	var user = Ti.UI.createTextField({
		hintText : 'Username',
		width : '290dp',
		height : '43dp',
		top : '120dp',
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
	});

	var pass = Ti.UI.createTextField({
		hintText : 'Password',
		width : '290dp',
		height : '43dp',
		top : '175dp',
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		passwordMask : true
	});

	var siButton = Ti.UI.createButton({
		title : 'Sign In',
		width : '100dp',
		height : '40dp',
		top : '240dp'
		//backgroundImage: ScoreIt.path.R + 'nimages/back.png'
	});

	mainWindow.add(applogo);
	mainWindow.add(user);
	mainWindow.add(pass);
	mainWindow.add(siButton);

	siButton.addEventListener('click', function() {

		//var status = ScoreIt.login('hekili', 'Blazing88!');
		ScoreIt.login(user.value, pass.value);
		//alert(status);
		if(ScoreIt.loginResult == 'error') {
			alert('There was a problem with login ' + ScoreIt.errorResponse);
		}
		if(ScoreIt.loginResult == 'okay') {
			alert('You have been logged in');
			var games = ScoreIt.ui.createGamesWindow();
			ScoreIt.navGroup.open(games);
			//alert('You have been logged in');
		}
		if(ScoreIt.loginResult == 'netowrkError'){
			alert('There was a problem ' + ScoreIt.errorResponse);
		}
		else {
			alert('There is a problem with logging in');
		}

	});

	if(ScoreIt.isAndroid()) {
		ScoreIt.navGroup = {
			open : function(win, obj) {
				win.open(obj);
			},
			close : function(win, obj) {
				win.close(obj);
			}
		};

		navWindow = mainWindow;
	} else {
		navWindow = Ti.UI.createWindow();
		ScoreIt.navGroup = Ti.UI.iPhone.createNavigationGroup({
			window : mainWindow
		});

		navWindow.add(ScoreIt.navGroup);
	}

	if(ScoreIt.isAndroid()) {
		mainWindow.open();
	} else {
		navWindow.open();
	}
		
})();

