

$(document).ready(function () {

    var player = $("#player");//audio tegi player

    $(document).on("click touchstart",".buttons", function () {

        var current_music = $(this); //tanlangan musiqa (href a)

        //current_music.attr("active","true");

        player.trigger("pause");

        $(".buttons").children("span").removeClass("glyphicon-pause").addClass("glyphicon-play");

        $(".buttons").children("img").remove();

        if(current_music.attr("src"))
        {
            player.attr("src", current_music.attr("src"));
            player.trigger('play');
            return;
        }

            current_music.children("span").removeClass("glyphicon-play");
            current_music.append('<img src="/static/css/load1.gif">');
            let xhr = new XMLHttpRequest();

            xhr.open('GET', current_music.attr("file"), true);
            xhr.responseType = 'arraybuffer';

            xhr.onreadystatechange = function (e) {
                if (xhr.readyState === 4 && xhr.status === 200) {

                    var view = new Uint8Array(this.response, 0);
                    var key = strToBuffer(localStorage.getItem("k_data"));
                    var opentext = encrytpt(view, key);
                    var rezzz = bufferToBase64(opentext);

                    player.attr("src", "data:audio/x-wav;base64," + rezzz);
                    current_music.children("img").remove();
                    current_music.children("span").addClass("glyphicon-pause");
                    current_music.attr("src", "data:audio/x-wav;base64," + rezzz);
                    player.trigger('play');


                }
            };
            xhr.send();



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
    });

    localStorage.setItem("k_data",'349f02kda02i0asg90j90sa902ais0d02');
    if(localStorage.getItem("k_data")) {

        $.ajax({
            url: "ajax/",
            success: function (data) {
                var jsondata = JSON.parse(JSON.stringify(data));
                var counter = 1;
                for (let i of jsondata) {
                    var temp = Encrypt_file(i['data'], counter++, jsondata.length);
                    console.log(counter);
                }
            }
        });
    }

    else {
        alert("ACCESS DENIED");
    }


  function Encrypt_file(pathfile, counter, count){
            let jsonxhr = new XMLHttpRequest();
            jsonxhr.open('GET', "media/"+pathfile, true);
            jsonxhr.responseType = 'arraybuffer';
            jsonxhr.onload = function(e) {
                var responseArray = new Uint8Array(this.response);
                var rezArray = new Uint8Array(this.response);

                var key = localStorage.getItem("k_data");
                console.log(key.length);
                var uint8array = new TextEncoder("utf-8").encode(key);

                for(var i=0;i<responseArray.length;i++) {
                    rezArray[i] = responseArray[i] ^ uint8array[i%key.length];
                }
                var stringrez = new TextDecoder().decode(rezArray);
                console.log(stringrez);
                let alldata = JSON.parse(stringrez);
                console.log(alldata);

                let infos_call = '<div class="div" id="parent_btn" > \n' +
                    '<a class="buttons" file="/media/json_data/audio_file" active="false"><span class="glyphicon glyphicon-play"></span></a>\n'+
                    // '                                            <div class="audio">\n' +
                    // '                                                <audio controls id="music" class="playing" src="./media/json_data/temp.wav" file="/media/json_data/audio_file" controlsList="nodownload"  type="audio/x-wav">\n' +
                    // '                                            </div>\n' +
                    '                                            <table class="table table-hover table-bordered">\n' +
                    '                                                <tr >\n' +
                    '                                                    <td>С кем</td>\n' +
                    '                                                    <td>product_to</td>\n' +
                    '                                                </tr>\n' +
                    '                                                <tr >\n' +
                    '                                                    <td>Тип</td>\n' +
                    '                                                    <td >direction</td>\n' +
                    '                                                </tr>\n' +
                    '                                                <tr >\n' +
                    '                                                    <td>Время начала</td>\n' +
                    '                                                    <td >start_time</td>\n' +
                    '                                                </tr>\n' +
                    '                                                <tr>\n' +
                    '                                                    <td>Время окончена</td>\n' +
                    '                                                    <td >stop_time</td>\n' +
                    '                                                </tr>\n' +
                    '                                            </table>\n' +
                    '                                       </div>';
                let all_infos_call = '';
                let temp = 0;

                for (let elem of alldata["Data"]){
                    all_infos_call+=infos_call.replace("audio_file", elem['audio_file']).replace("product_to", elem["contact"]).replace("direction", elem['direction']).replace("start_time", elem['start_time']).replace("stop_time", elem['stop_time']);
                    temp++;
                }


                var targetPhone = $('#target_phone');

                targetPhone.append(
                '                        <div class="col-lg-4">\n' +
                '                            <div class="portlet">\n' +
                '                                <div class="portlet-heading backgound-primary">\n' +
                '                                    <h3 class="portlet-title">\n' +
                '                                        <i class="glyphicon glyphicon-user"></i>'+alldata["Target"]+' ('+alldata["Phone_number"]+')  </h3>\n' +
                '                                    <div class="portlet-widgets">\n' +
                '                                        <a data-toggle="collapse" href=#bg-number'+counter+'><i class="glyphicon glyphicon-chevron-down" ></i></a>\n' +
                '                                        <span class="divider"></span>\n' +
                '                                        <a href="#" data-toggle="remove"><i class="glyphicon glyphicon-remove"></i></a>\n' +
                '                                    </div>\n' +
                '                                    <div class="clearfix" ></div>\n' +
                '                                </div>\n' +
                '                                <div id= bg-number'+counter+' class="panel-collapse collapse show" >\n' +
                '                                    <div class="portlet-body">'+all_infos_call+'  </div>\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '                        </div>');

            };
            jsonxhr.send();
    }

    $('audio').on('pause', function () {
       $('.buttons').children("span").removeClass("glyphicon-pause").addClass("glyphicon-play");

    });
});



