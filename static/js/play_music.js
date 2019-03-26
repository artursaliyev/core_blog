        var audioCtx;
		var source;

		var play = document.querySelector('.play');
		var stop = document.querySelector('.stop');


		function getData(audio_file) {
		 audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		  source = audioCtx.createBufferSource();
		  var request = new XMLHttpRequest();
		  request.open('GET', audio_file, true);
		  request.responseType = 'arraybuffer';
		  request.onload = function() {
			var audioData = request.response;
			var view   = new Uint8Array(audioData,0);

			var key = strToBuffer("123");
			encrytpt(view, key);
			audioCtx.decodeAudioData(audioData, function(buffer) {
				source.buffer = buffer;
				source.connect(audioCtx.destination);
				source.loop = true;
			    source.start(0);
				},
			  function(e){"Error with decoding audio data" + e.err});
		  }
		  request.send();
		}

		// play.onclick = function() {
		//   getData();
		//   source.start(0);
		//   play.setAttribute('disabled', 'disabled');
		// }
        //
		// play.onclick = function() {
		//   getData();
		//   source.start(0);
		//   play.setAttribute('disabled', 'disabled');
		// }


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


		function strToBuffer (string) {
			  let arrayBuffer = new ArrayBuffer(string.length * 1);
			  let newUint = new Uint8Array(arrayBuffer);
			  newUint.forEach((_, i) => {
				newUint[i] = string.charCodeAt(i);
			  });
		  return newUint;
		}
