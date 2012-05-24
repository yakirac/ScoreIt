(function() {
	var id;
	var fname;
	var lname;
	var jn;
	var points;
	var fouls;
	ScoreIt.player = function(id, firstName, lastName, jerseyNumber) {
		this.id = id;
		this.fname = firstName;
		this.lname = lastName;
		this.jn = jerseyNumber;
		this.points = 0;
		this.fouls = 0;

		this.updatePoints = function(newPoints) {
			this.points = this.points + newPoints;
		};

		this.updateFouls = function() {
			this.fouls++;
		};

		this.getPoints = function() {
			return this.points;
		};

		this.getFouls = function() {
			return this.fouls;
		};

		this.getFName = function() {
			return this.fname;
		};

		this.getLName = function() {
			return this.lname;
		};

		this.getJN = function() {
			return this.jn;
		};

		this.getId = function() {
			return this.id;
		};
	};

})();
