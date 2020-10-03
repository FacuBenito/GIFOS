let video = document.getElementById("gif-capture");

navigator.getUserMedia = (navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia || 
	navigator.msGetUserMedia);
	
	navigator.getUserMedia ({
		video: true,
		audio: false
	},
	
	// successCallback
	function (localMediaStream) {
		video.srcObject = localMediaStream;
	},

// errorCallback
	function(err) {
	console.log("Ocurrió el siguiente error: " + err);
	}
);


