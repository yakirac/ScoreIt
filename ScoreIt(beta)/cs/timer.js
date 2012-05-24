(function() {
	ScoreIt.timer = function() {
		var m = 19;
		var s = 60;
		ScoreIt.dostop = false;
		var timer;
		var c = 0;

		this.start = function() {
			timer = setInterval(function() {
				s--;
				if(s == 0) {
					m--;
					ScoreIt.gtime.text = '' + m + ':0' + s + '';
					s = 60;
				} else if(m < 10 && s < 10) {
					ScoreIt.gtime.text = '0' + m + ':0' + s + '';
				} else if(s < 10) {
					ScoreIt.gtime.text = '' + m + ':0' + s + '';
				} else if(m < 10) {
					ScoreIt.gtime.text = '0' + m + ':' + s + '';
				} else {
					ScoreIt.gtime.text = '' + m + ':' + s + '';
				}
			}, 1000);
		};

		this.stop = function() {
			clearInterval(timer);
		};

		this.checkTime = function(t) {
			if(t < 10) {
				t = '0' + t;
			}
			return t;
		}
	};
})();
