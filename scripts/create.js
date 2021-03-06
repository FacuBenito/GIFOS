let [stage1, stage2, stage3] = Array.from(document.querySelectorAll("span.number"));
let startBtn = document.getElementById("start-btn");
let video = document.getElementById("gif-capture");
let createTitle = document.getElementById("create-title");
let crSubTitle = document.getElementById("create-subtitle");
let counter = document.getElementById("counter");
let reDoButton = counter.children[0];
let myGifosArray = localStorage.getItem("myGifos");
let overlay = document.getElementById('loading')
let stageCont = 0;
let downloadGifo = document.getElementById('download-gifo');
let copyLink = document.getElementById('copy-link')
myGifosArray = JSON.parse(myGifosArray);

if (myGifosArray === null){
	myGifosArray = [];
}

let recorder;
let gif;
let gifDownload = null;
let timerSet;
let link = null;

startBtn.addEventListener("click", recordProcess);
downloadGifo.addEventListener('mousedown', downloadActionCreate);
copyLink.addEventListener('mousedown', () => copyURLAction(link));

let s = 0;
let stoppedFlag = false;

function setTimer() {
	reDoButton.classList.remove('hidden');
	counter.classList.remove('hidden');
	if (stoppedFlag == true) {
		clearInterval(timerSet);
		s = 0;
	}
	else {
		let timeValue = new Date(s * 1000).toISOString().substr(11, 8);

		reDoButton.textContent = timeValue;
		s++;
	}
};

function recordProcess(){

	switch (stageCont) {
		case 0:
			firstStage();
			break;
		case 1:
			secondStage();
			break;
		case 2:
			thirdStage();
			break;
		case 3:
			fourthStage();
			break;
		case 4:
			fifthStage();
			break;
		default:
			break;
	}
}

function firstStage(){
	stage1.classList.add("isCurrent");
	startBtn.classList.add("hidden");
	createTitle.innerHTML = "¿Nos das acceso <br> a tu cámara?"
	crSubTitle.innerHTML = "El acceso a tu camara será válido sólo <br> por el tiempo en el que estés creando el GIFO."

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
		stageCont++;
		recordProcess();
	},

// errorCallback
	function(err) {
		console.log("Ocurrió el siguiente error: " + err);
		stageCont = 0;

	});
}

function secondStage(){

	video.classList.remove("hidden");
	startBtn.classList.remove("hidden");
	// reDoButton.textContent = "00:00:00"
	// reDoButton.classList.add('hidden')
	startBtn.textContent = "GRABAR";
	createTitle.classList.add("hidden");
	crSubTitle.classList.add("hidden");
	stage1.classList.remove("isCurrent");
	stage2.classList.add("isCurrent");
	stageCont++;
}

function thirdStage(){
	// Iniciar grabación

	navigator.mediaDevices.getUserMedia({
		video: true
	}).then(async function(stream) {
		recorder = RecordRTC(stream, {
			type: 'gif',
			frameRate: 1,
			quality: 10,
			width: 360,
			hidden: 240,
			onGifRecordingStarted: function() {
			 console.log('started')
			}
		});
		recorder.startRecording();
		stoppedFlag = false;
		timerSet = setInterval(setTimer, 1000);
	});
	
	counter.classList.add("counter");
	counter.classList.remove("hidden");
	reDoButton.classList.remove('hidden');
	// reDoButton.textContent	 = "00:00:00"
	startBtn.textContent = "FINALIZAR";
	stageCont++;
}

function fourthStage() {
	//Agregar evento para repetir captura y
	//Resetear todos los botones al estado correspondiente
	recorder.stopRecording(onStop);
	
	gif = recorder.getBlob();
	gifDownload = gif;

	startBtn.textContent = "SUBIR GIFO";
	reDoButton.textContent = "REPETIR CAPTURA";
	reDoButton.classList.add("special-hover");
	
	reDoButton.addEventListener('click', () => {
		stageCont = 1;
		reDoButton.classList.remove('special-hover');
		counter.classList.add("hidden");
		reDoButton.textContent = '';
		timerSet = 0;
		stoppedFlag = true;
		recordProcess();
	})

	stageCont++;

}

async function fifthStage() {

	overlay.classList.remove('hidden');
	overlay.classList.add('loading');

	let form = new FormData();
	form.append('file', gif, 'newGif.gif');

	let resp = await fetch(`https://upload.giphy.com/v1/gifs?=${form}&api_key=${apiKey}`, {
		method: 'POST',
		body: form,
		json: true
	});

	overlay.children[1].src = './assets/check.svg';
	overlay.children[1].style.animation = 'none';

	overlay.children[2].textContent = 'GIFO subido con éxito';

	overlay.children[0].classList.remove('hidden');
	overlay.children[0].classList.add('create-btn-ctn');

	let data = await resp.json();
	myGifosArray.push(data.data.id);

	link = data.data.id;

	localStorage.setItem('myGifos', JSON.stringify(myGifosArray));

	counter.classList.add("hidden");
	counter.classList.remove("counter");
	startBtn.classList.add("hidden");
	stage2.classList.remove("isCurrent");
	stage3.classList.add("isCurrent");
}

function onStop() {
	//Generar el archivo para subir
	stoppedFlag = true;
	console.log('Supercalifragilisticuespialidoso')
}

function downloadActionCreate() {
			let a = document.createElement('a');
			console.log('hoasdjh2');
			let file = gifDownload;
			a.download = `${this.classList[0]}`;
			a.href = window.URL.createObjectURL(file);
			a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');

			a.click()
}

async function copyURLAction(gifoid) {

  navigator.clipboard.writeText(`https://media2.giphy.com/media/${gifoid}/giphy.gif?${apiKey}&rid=giphy.gif`).then(
    console.log("success"))
    .catch(err => console.log(err))
}