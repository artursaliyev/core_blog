
var context = new AudioContext();
var source = null;
var audioBuffer = null;
// Converts an ArrayBuffer to base64, by converting to string
// and then using window.btoa' to base64.
var bufferToBase64 = function (buffer) {
    var bytes = new Uint8Array(buffer);
    var len = buffer.byteLength;
    var binary = "";
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};
var base64ToBuffer = function (buffer) {
    var binary = window.atob(buffer);
    var buffer = new ArrayBuffer(binary.length);
    var bytes = new Uint8Array(buffer);
    for (var i = 0; i < buffer.byteLength; i++) {
        bytes[i] = binary.charCodeAt(i) & 0xFF;
    }

    return buffer;
};
function stopSound() {
    if (source) {
        source.stop(0);
    }
}
function playSound() {
    // source is global so we can call .stop() later.
    source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = false;
    source.connect(context.destination);
    source.start(0); // Play immediately.
}
function initSound(arrayBuffer) {
    var base64String = bufferToBase64(arrayBuffer);
    var audioFromString = base64ToBuffer(base64String);
    //document.getElementById("encodedResult").value=base64String;
      document.getElementsByTagName("audio")[0].setAttribute("src","data:audio/ogg;base64,"+base64String);
    context.decodeAudioData(audioFromString, function (buffer) {
        // audioBuffer is global to reuse the decoded audio later.
        audioBuffer = buffer;
        var buttons = document.querySelectorAll('button');
        buttons[0].disabled = false;
        buttons[1].disabled = false;
    }, function (e) {
        console.log('Error decoding file', e);
    });
}
// User selects file, read it as an ArrayBuffer and pass to the API.

// var fileInput = document.querySelector('input[type="file"]');
// fileInput.addEventListener('change', function (e) {
//     var reader = new FileReader();
//     reader.onload = function (e) {
//         initSound(this.result);
//     };
//     reader.readAsArrayBuffer(this.files[0]);
// }, false);
//
// // Load file from a URL as an ArrayBuffer.
// // Example: loading via xhr2: loadSoundFile('sounds/test.mp3');



function loadSoundFile(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';

    var opentext;
    var rezzz;
    xhr.onload = function (e) {
            var view   = new Uint8Array(this.response,0);
			var key = strToBuffer("123");
			opentext = encrytpt(view, key);
			rezzz = bufferToBase64(opentext);

			document.getElementById("music_source").setAttribute("src", "data:audio/ogg;base64,"+rezzz);
		    //initSound(opentext); // this.response is an ArrayBuffer.
    };
    xhr.send();
    return rezzz;
}

function strToBuffer (string) {
			  let arrayBuffer = new ArrayBuffer(string.length * 1);
			  let newUint = new Uint8Array(arrayBuffer);
			  newUint.forEach((_, i) => {
				newUint[i] = string.charCodeAt(i);
			  });
		  return newUint;
		}


function encrytpt(data, key){
			for(let i=0;i<data.length; i+=key.length)
			{
				for(let j=0;j<key.length;j++)
				{
					data[i+j] ^= key[j];
				}
			}
			return data;
		}
