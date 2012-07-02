var ScoreIt = {
	ui : {},
	timestamp : {},
	gamesList : {},
	/*getGameData : {},
	setGameData : {},
	methodCall : {},*/
	events : [],
	os : {},
	_isLargeScreen : undefined,
	_isAndroid : undefined,
	navGroup : undefined,
	loginResult: undefined,
	path : {
		R : Titanium.Filesystem.resourcesDirectory,
		A : Titanium.Filesystem.applicationDirectory,
		T : Titanium.Filesystem.tempDirectory,
		AP : Titanium.Filesystem.applicationDataDirectory
	}
};

(function() {
	ScoreIt.extend = function(obj) {
		var args = Array.prototype.slice.call(arguments, 1);
		for(var i = 0; i < args.length; i++) {
			var source = args[i];
			for(var prop in source) {
				if(source[prop] !== void 0){
					obj[prop] = source[prop];
				}
			}
		}
		return obj;
	};

	ScoreIt.isLargeScreen = function() {
		if(ScoreIt._isLargeScreen == undefined) {
			ScoreIt._isLargeScreen = (Ti.Platform.displayCaps.platformWidth >= 600);
		}
		return ScoreIt._isLargeScreen;
	};

	ScoreIt.isAndroid = function() {
		if(ScoreIt._isAndroid == undefined) {
			ScoreIt._isAndroid = (Ti.Platform.osname == 'android');
		}
		return ScoreIt._isAndroid;
	};

	var osname = Ti.Platform.osname;
	ScoreIt.os = function(/*Object*/map) {
		var def = map.def || null;
		//default function or value
		if(map[osname]) {
			if( typeof map[osname] == 'function') {
				return map[osname]();
			} else {
				return map[osname];
			}
		} else {
			if( typeof def == 'function') {
				return def();
			} else {
				return def;
			}
		}
	};

})();
