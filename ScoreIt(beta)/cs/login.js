(function() {
	ScoreIt.login = function(username, password) {
		var aKey = '6f48c3bc869cb7498af7c5dc574d17a49f7ddd4a';
		var sSecret = 'uHmNOoOXt9lSEHh868XVQVVmPpEN56lmDvOIIRTy';
		var currentTime = new String();

		//Ti.App.Properties.setString('tkey', aKey);
		ScoreIt.gamesList.key = aKey;
		ScoreIt.gamesList.s = sSecret;

		function generateSignature(accessKey, sharedSecret) {

			//Get current time
			currentTime = Math.round((new Date()).getTime() / 1000);

			//concatenate accessKey, sharedSecret and current time
			var cstring = aKey.toString() + sSecret.toString() + currentTime;
			//alert("This is the string: \n" + cstring);

			//get md5 hash for the string using md5 method
			var sig = Ti.Utils.md5HexDigest('' + cstring + '');

			//alert("This is the signature generated: \n" + sig);
			Ti.API.info('The generated signature: ' + sig);
			Ti.App.Properties.setString('sig', sig);

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
		var lurl = loginBaseUrl + '?signature=' + signature + '&key=' + aKey;

		//Post data to url and get response
		var xhr = Ti.Network.createHTTPClient();

		var text;
		var json;

		xhr.onload = function(e) {
			Ti.App.Properties.setString('result', 'okay');
			json = JSON.parse(xhr.responseText);
			if(json.result == 'okay') {
				Ti.API.info('Login was successful');
				//ScoreIt.loginResult = 'okay';
				Ti.App.Properties.setString('result', json.result);
				Ti.App.Properties.setString('token', json.response.token);
				//ScoreIt.loginResult = 'okay';

			}else if(json.result == 'error') {
				var es = json.errors;
				Ti.API.info('There was an error');
				Ti.App.Properties.setString('result', json.result);
				Ti.App.Properties.setString('error', xhr.responseText);
				//ScoreIt.loginResult = 'error';
				//ScoreIt.errorResponse = xhr.responseText;
			}
			//alert(xhr.responseText);

		};

		xhr.onerror = function(e) {
			json = JSON.parse(xhr.responseText);
			var error = json.errors;

			Ti.App.Properties.setString('result', 'networkError');
			//ScoreIt.loginResult = 'networkError';
			Ti.API.info('Login. There was an error. ' + xhr.responseText);
			Ti.App.Properties.setString('error', xhr.responseText);
			//alert('Login. There was an error.');
			//ScoreIt.errorResponse = xhr.responseText;

		};

		//alert("The url: " + lurl);
		xhr.open('POST', lurl);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify(userData));
		
		//alert('We sent the login info ' + xhr.status);
		//ScoreIt.loginResult = ScoreIt.loginResult + xhr.getStatus();

		//return Ti.App.Properties.getString('result');
	};
	
	/*ScoreIt.newSig = function(){
		var currentTime = new String();
		//Get current time
		currentTime = Math.round((new Date()).getTime() / 1000);

		//concatenate accessKey, sharedSecret and current time
		var cstring = ScoreIt.gamesList.key + ScoreIt.gamesList.s + currentTime;
		//alert("This is the string: \n" + cstring);

		//get md5 hash for the string using md5 method
		var nsig = Ti.Utils.md5HexDigest('' + cstring + '');

		//alert("This is the signature generated: \n" + sig);
		Ti.API.info('The new generated signature: ' + nsig);
		Ti.App.Properties.setString('sig', nsig);

	};*/

})();

