(function() {
	ScoreIt.login = function(username, password) {
		var aKey = '6f48c3bc869cb7498af7c5dc574d17a49f7ddd4a';
		var sSecret = 'uHmNOoOXt9lSEHh868XVQVVmPpEN56lmDvOIIRTy';
		var currentTime = new String();

		//Ti.App.Properties.setString('tkey', aKey);
		ScoreIt.gamesList.key = aKey;

		function generateSignature(accessKey, sharedSecret) {

			//Get current time
			currentTime = Math.round(new Date().getTime() / 1000).toString();

			//concatenate accessKey, sharedSecret and current time
			var string = aKey.toString() + sSecret.toString() + currentTime;

			//get md5 hash for the string using md5 method
			var sig = Ti.Utils.md5HexDigest('' + string + '');

			//Ti.App.Properties.setString('sig', sig);

			//return string
			return sig;
		};

		//Set up username and password
		var userData = {
			"username" : "" + username + "",
			"password" : "" + password + ""
		};

		//Get accessKey and signature
		var signature = generateSignature();
		

		//Base url to login to the API
		var loginBaseUrl = 'https://api.espnalps.com/login';

		//put the url together
		var url = loginBaseUrl + '?signature=' + signature + '&key=' + aKey;

		//Post data to url and get response
		var xhr = Ti.Network.createHTTPClient();

		var text;
		var json;

		xhr.onload = function(e) {
			json = JSON.parse(xhr.responseText);
			if(json.result == 'okay') {
				//alert('Login was successful');
				Ti.App.Properties.setString('result', json.result);
				//Ti.App.Properties.setString('token', json.response.token);


			} else if(json.result == 'error') {
				var es = json.errors;
				//alert('There was an error');
				//Ti.App.Properties.setString('result', json.result);
				//Ti.App.Properties.setString('error', es.message);
				ScoreIt.loginResult = 'error';
				ScoreIt.errorResponse = xhr.responseText;
			}
			//alert(xhr.responseText);

		};

		xhr.onerror = function(e) {
			json = JSON.parse(xhr.responseText);
			var error = json.errors;

			//Ti.App.Properties.setString('result', 'error');
			ScoreIt.loginResult = 'networkError';
			//alert('Login. There was an error. ' + xhr.responseText);
			//alert('Login. There was an error.');
			ScoreIt.errorResponse = xhr.responseText;

		};

		xhr.open('POST', url);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify(userData));
		
		//alert('We sent the login info ' + xhr.status);
		ScoreIt.loginResult = Ti.App.Properties.getString('result');

		//return Ti.App.Properties.getString('result');
	};

})();

