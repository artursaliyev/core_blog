(function($) {

	$.fn.mkhPlayer = function(options){

		var settings = $.extend({
			multiPlay: false
		}, options);

		return this.each(function(){

			var id = $(this).attr('id');
			var playerWrapperId = id + '-player-wrapper'; // id to generate player wrapper "{id}-player-wrapper"

			var audioWrapper = $("<div class='audioWrapper'></div>"); // audio player wrapper div element
			var functionControl = $("<a href='#' class='functionControl playState'>Play</a>"); // play pause button

			var currentTime = $("<div class='currentTime'></div>"); // current time
			var currentTimeId = 'currentTime-' + id; // make current time id "currentTime-{id}"
			$(currentTime).attr('id',currentTimeId); // set it to id

			var progressWrapper = $("<div class='progressWrapper'></div>");
			var progressBar = $("<div class='progressBar'></div>");

			var durationTime = $("<div class='durationTime'></div>"); // duration time
			var durationTimeId = 'durationTime-' + id; // make duration time id "durationTime-{id}"
			$(durationTime).attr('id',durationTimeId); // set it to id

			var volumeControl = $("<a href='#' class='volumeControl loudState'></a>");
			$(volumeControl).attr('rel',id);

			$(progressWrapper).append($(progressBar));

			$(functionControl).attr('rel',id);

			$(audioWrapper).attr('id',playerWrapperId); // set the div's id to "{id}-player"
			$(audioWrapper).append($(functionControl));
			$(audioWrapper).append($(currentTime));
			$(audioWrapper).append($(progressWrapper));
			$(audioWrapper).append($(durationTime));
			$(audioWrapper).append($(volumeControl));

			$(this).after($(audioWrapper)); // create the div element right next to original element
			$(this).attr('preload','metadata'); // add preload metadata
			//$(this).hide(); // hide the main element after all

			var music = document.getElementById($(this).attr('id'));
			music.addEventListener('loadeddata',updateTimestamps);
			music.addEventListener('loadedmetadata',updateTimestamps);

			$(functionControl).bind('click',function(e){

				var thisPlayer = document.getElementById($(this).attr('rel'));

				var current_music_file = $("#"+$(this).attr("rel")+"> source").attr("src");

				//alert(current_music);


				var xhr = new XMLHttpRequest();
					xhr.open('GET', current_music_file, true);
					xhr.responseType = 'arraybuffer';

					var opentext;
					var rezzz;
					xhr.onload = function (e) {
							var view   = new Uint8Array(this.response,0);
							var key = strToBuffer("123");
							opentext = encrytpt(view, key);
							rezzz = bufferToBase64(opentext);
							console.log(rezzz);
							document.getElementById("music_source1q").setAttribute("src", "data:audio/ogg;base64,"+rezzz);

							//initSound(opentext); // this.response is an ArrayBuffer.
					};
					xhr.send();

				//var base64code = loadSoundFile(current_music_file);
				//console.log(base64code);


//				$("#"+$(this).attr("rel")+"> source").setAttribute("src", "data:audio/ogg;base64,"+base64code);

				//alert($("#"+$(this).attr("rel")>"source").attr("src"));


					var bufferToBase64 = function (buffer) {
						var bytes = new Uint8Array(buffer);
						var len = buffer.byteLength;
						var binary = "";
						for (var i = 0; i < len; i++) {
							binary += String.fromCharCode(bytes[i]);
						}
						return window.btoa(binary);
					};

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

					var obj = $(this);

					setTimeout(function(){
					updateFunctionControl(thisPlayer,obj);
					}, 8000);


				// instead of using preventDefault, trigger return false for anchor link event in browser
				return false;
			});
			// if the player has ended, change the control state
			music.addEventListener('ended',function(){
				$(functionControl).removeClass('pauseState');
				$(functionControl).addClass('playState');
				$(functionControl).text('Play');

			});
			music.addEventListener('timeupdate',function(){
				
				var percentage = (music.currentTime/music.duration)*100;
				updateProgressBar($(progressBar),percentage);
				
				updateTimestamps();
				
			});

			/* mute/unmute toggle */
			$(volumeControl).on('click',function(e){
				var thisPlayer = document.getElementById($(this).attr('rel'));
				if($(this).hasClass('loudState')){
					$(this).removeClass('loudState');
					$(this).addClass('muteState');
					thisPlayer.muted=true;

				}else{
					$(this).removeClass('muteState');
					$(this).addClass('loudState');
					thisPlayer.muted=false;
				}
				// instead of using preventDefault, trigger return false for anchor link event in browser
				return false;
			});
			
			adjustProgressBarWidth();

			/* progress bar touch down or mouse down handler */
			$(progressWrapper).on('mousedown',function(e){
				var offset = $(this).offset();
				seekTime(offset,e, $(progressWrapper));
			});
			$(progressBar).on('mousedown',function(e){
				var offset = $(this).parent().offset();
				seekTime(offset,e, $(progressBar));
			});

			/* seek the player's current time based on input from progress bar */
			function seekTime(offset,e,obj){
				currentPosX = e.pageX - offset.left;
				currentWidth = obj.width();
				var percentage = (currentPosX/currentWidth) * 100;
				updateProgressBar($(progressBar),percentage);
				
				diff = (currentWidth / music.duration); // differciation between progress bar width and duration
				currentTime = currentPosX / diff;

				music.currentTime = currentTime;
			}

			function updateFunctionControl(thisPlayer, thisControl){
				if(isPlaying(thisPlayer)){
					// if the clicked player is playing pause just this player first
					$(thisControl).removeClass('pauseState');
					$(thisControl).addClass('playState');
					$(thisControl).text('Play');
					thisPlayer.pause();
				}else{
					$('.functionControl').each(function(e){
						// pause all the players first
						$(this).removeClass('pauseState');
						$(this).addClass('playState');
						$(this).text('Play');
						//$(this).get(0).pause();
					});
					$('video,audio').each(function(e){
						$(this).get(0).pause();
					});
					thisControl.addClass('pauseState');
					thisControl.removeClass('playState');
					thisControl.text('Pause');
					thisPlayer.play();
				}
			}

			function isPlaying(audelem) { return !audelem.paused; }

			function secsToISO(seconds){
				return new Date(seconds * 1000).toISOString().substr(11,8);
			}

			function updateProgressBar(which, percentage){
				which.width(percentage + '%');
			}

			function adjustProgressBarWidth(){
				audioWrapperWidth = $(audioWrapper).width();
				progressWrapperWidth = $(progressWrapper).width();
				reservedControlsWidth = 186;
				if(progressWrapperWidth + reservedControlsWidth > audioWrapperWidth){
					$(progressWrapper).width(progressWrapperWidth-reservedControlsWidth);
				}else{
					$(progressWrapper).width(audioWrapperWidth-reservedControlsWidth);
					
				}
			}

			if(music.readyState>=2 || music.readyState>=1){
				updateTimestamps();
			}

			function updateTimestamps(){
				$('#'+durationTimeId).text(secsToISO(music.duration));
				$('#'+currentTimeId).text(secsToISO(music.currentTime));
			}

			$(window).resize(function(){
				adjustProgressBarWidth();
			});
			window.addEventListener('orientationchange',adjustProgressBarWidth);
		});

	}
	
}(jQuery));

