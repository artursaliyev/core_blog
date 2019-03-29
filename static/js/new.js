

$(document).ready(function () {

    var player =  $("#player");//audio tegi player
    var k_data;
    var current_music;
    var xhr = new XMLHttpRequest();
    var start;


    $(document).on("touchstart",".music", function () {

        if($(".music[active=true]").children('img[class=load_button]').attr("style")==="display:block;") {
            return;
        }
        current_music = $(this); //tanlangan musiqa (href a)

        if(current_music.attr("active")==="true") {

            if(current_music.children('img[class=play_button]').attr('style')==='display:none;') {
                player.get(0).pause();
                current_music.children('img[class=play_button]').attr('style', 'display:block;');
                current_music.children('img[class=pause_button]').attr('style', 'display:none;');
                current_music.children('img[class=load_button]').attr('style', 'display:none;');
            }
            else {
                player.get(0).play();
                current_music.children('img[class=pause_button]').attr('style', 'display:block;');
                current_music.children('img[class=load_button]').attr('style', 'display:none;');
                current_music.children('img[class=play_button]').attr('style', 'display:none;');
            }
            return;
        }

        xhr.abort();
        player.get(0).pause();
        player.currentTime = 0;
        player.removeAttr("src");
        player.trigger('load');

        current_music.children('img[class=load_button]').attr('style', 'display:block;');
        current_music.children('img[class=play_button]').attr('style', 'display:none;');
        current_music.children('img[class=pause_button]').attr('style', 'display:none;');

        $('.music[active=true]').children('img[class=load_button]').attr('style', 'display:none;');
        $('.music[active=true]').children('img[class=pause_button]').attr('style', 'display:none;');
        $('.music[active=true]').children('img[class=play_button]').attr('style', 'display:block;');

        $('.music[active=true]').attr("active", "false");

        current_music.attr("active","true");

        xhr.open('GET', current_music.attr("file"), true);
        xhr.responseType = 'arraybuffer';

        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === 4) {
                if(xhr.status === 200) {
                    var res_byte = new Uint8Array(this.response, 0);
                    var aesCbc = new aesjs.ModeOfOperation.cbc(k_data, start);
                    var decryptedBytes = aesCbc.decrypt(res_byte);
                    var myblob = new Blob([decryptedBytes], {type:'audio/mpeg'});
                    var blobUrl = URL.createObjectURL(myblob);
                    player.attr('src', blobUrl);
                    player.trigger("load");
                }
                else {
                    alert("Error load audio file!!!");
                    current_music.children('img[class=play_button]').attr('style', 'display:block;');
                    current_music.children('img[class=pause_button]').attr('style', 'display:none;');
                    current_music.children('img[class=load_button]').attr('style', 'display:none;');
                } }
            };
            xhr.send();

    });


  function Open_file(pathfile, counter){

            var alldata;
            let json_xhr = new XMLHttpRequest();
            json_xhr.open('GET', "media/"+pathfile, true);
            json_xhr.responseType = 'arraybuffer';
            json_xhr.onreadystatechange = function(e) {
                 if (json_xhr.readyState === 4 && json_xhr.status === 200) {

                     var res_byte = new Uint8Array(this.response, 0);
                     var aesCbc = new aesjs.ModeOfOperation.cbc(k_data, start);
                     var decryptedBytes = aesCbc.decrypt(res_byte);
                     while(decryptedBytes[decryptedBytes.length-1]===0)
                     {
                        decryptedBytes=decryptedBytes.slice(0,-1);
                     }
                     alldata = JSON.parse(aesjs.utils.utf8.fromBytes(decryptedBytes));

                let target_call_infos = '<div class="row info">\n' +
                    '                                <div class="col-xs-2">\n' +
                    '                                    <a class="music" file = "/media/json_data/audio_file" src="" active="false">\n' +
                    '                                        <img class="play_button" style="display: block;" src="/static/icon/play_button.png" />\n' +
                    '                                        <img class="pause_button" style="display: none;" src="/static/icon/pause.png" /> ' +
                    '                                        <img class="load_button" style="display: none;" src="/static/icon/loader.gif" /> ' +
                    '                                    </a>\n' +
                    '                                </div>\n' +
                    '                                <div class="col-xs-10 for_phone">\n' +
                    '                                        <img class="phone_In_Out"src="/static/icon/call_icon" />product_to \n' +
                    '                                </div>\n' +
                    '                                <div class="col-xs-6 for_calendar">\n' +
                    '                                    <img class="calendar"src="/static/icon/calendar.png" />start_time\n' +
                    '                                </div>\n' +
                    '                                <div class="col-xs-4 for_clock">\n' +
                    '                                    <img class="clock"src="/static/icon/clock.png" />time</td>\n' +
                    '                                </div>\n' +
                    '                     </div>';

                     let all_infos_call = '';
                     let icon;
                for (let elem of alldata["Data"]){
                    if (elem['direction']==="0")
                        icon = "in.png";
                    else icon = "out.png";
                    all_infos_call+=target_call_infos.replace("call_icon", icon).replace("audio_file", elem['audio_file']).replace("product_to", elem["contact"]).replace("start_time", elem['start_time'].substring(0,14)).replace("time", elem['duration']);
                }


                var targetPhone = $('#target_phone');

                targetPhone.append(

                    '<div class="col-lg-4 col-xs-12">\n' +
                    '                <div class="portlet">\n' +
                    '                    <div class="portlet-heading">\n' +
                    '                        <h3 class="portlet-title">\n' +
                    '                           <a data-toggle="collapse"  href=#bg-number'+counter+'>\n '+
                    '                                <i class="glyphicon glyphicon-user"> </i> '+alldata["Target"] +' (' +alldata["Phone_number"]+')'+
                    '                            </a>\n' +
                    '                        </h3>\n' +
                    '                        <div class="portlet-widgets">\n' +
                    '                            <a data-toggle="collapse"  href=#bg-number'+counter+'>\n' +
                    '                                <i class="glyphicon glyphicon-chevron-down" ></i>\n' +
                    '                            </a>\n' +
                    '                            <span class="divider"></span>\n' +
                    '                            <a href="#" data-toggle="remove">\n' +
                    '                                <i class="glyphicon glyphicon-remove"></i>\n' +
                    '                            </a>\n' +
                    '                        </div>\n' +
                    '                        <div class="clearfix"></div>\n' +
                    '                    </div>\n' +
                    '                    <div id=bg-number'+counter+' class="panel-collapse collapse show">\n' +
                    '                        <div class="portlet-body">'+all_infos_call+
                    '                        </div>          \n' +
                    '                    </div>\n' +
                    '                </div>\n' +
                    '            </div>'
                );
                    return true;
                  }
                 };

            json_xhr.send();
    }

    player.on('pause', function () {
        if(current_music.children('img[class=load_button]').attr("style")!=='display:block;') {
            current_music.children('img[class=play_button]').attr('style', 'display:block;');
            current_music.children('img[class=pause_button]').attr('style', 'display:none;');
            current_music.children('img[class=load_button]').attr('style', 'display:none;');
        }
    });

    player.on('play', function () {
        if(current_music.children('img[class=load_button]').attr("style")!=='display:block;') {
            current_music.children('img[class=play_button]').attr('style', 'display:none;');
            current_music.children('img[class=pause_button]').attr('style', 'display:block;');
            current_music.children('img[class=load_button]').attr('style', 'display:none;');
        }
    });

    player.on('canplay', function () {

        player.trigger("play");
        current_music.children('img[class=play_button]').attr('style', 'display:none;');
        current_music.children('img[class=load_button]').attr('style', 'display:none;');
        current_music.children('img[class=pause_button]').attr('style', 'display:block;');

    });

  // page yuklanish paytida serverga shifrlangan ma'lumotlarni olish uchun zapros ketadi
     //agar kalit mavjud bo'lsa
        if(localStorage.getItem("k_data") && localStorage.getItem("k_data").length===48) {

            var localData = localStorage.getItem("k_data");

            k_data=new TextEncoder("utf-8").encode(localData.substring(0,32));
            start=new TextEncoder("utf-8").encode(localData.substring(32,48));

            $.ajax({
                url: "ajax/",
                success: function (data) {
                    //server barcha fayllar ro'yhatini json formatda jo'natadi
                    var jsondata = JSON.parse(JSON.stringify(data));
                    var counter = 1;
                    //har bir json fayli deshifrlanadi
                    for (let i of jsondata) {
                           var rez = Open_file(i['data'], counter++);
                    }
                }
            });
            }
        else {
            //agar xotirada kalit mavjud bo'lmasa
            alert("ACCESS DENIED");
        }

});



