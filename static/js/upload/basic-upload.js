$(function () {

  $(".js-upload-photos").click(function () {
    $("#fileupload").click();
  });

  $("#fileupload").fileupload({
    dataType: 'json',
    sequentialUploads: true,

    start: function (e) {
      $("#modal-progress").modal("show");
    },

    stop: function (e) {
      $("#modal-progress").modal("hide");
    },

    progressall: function (e, data) {
      var progress = parseInt(data.loaded / data.total * 100, 10);
      var strProgress = progress + "%";
      $(".progress-bar").css({"width": strProgress});
      $(".progress-bar").text(strProgress);
    },

    done: function (e, data) {
      if (data.result.is_valid) {
        console.log(data.result)
        if (data.result.data_.endsWith('.json')) {

          $("#gallery tbody").prepend(
              "<tr style='background: #c4dce8'>" +
              "<td><a href='/" + data.result.pk + "/upload-detail/'>" + data.result.data_.slice(10) + "</a></td>" +
              "<td> (нет доступа) </td>" +
              "<td>" + data.result.created + "</td>" +
              "</tr>"
          )
        }
        else {
          $("#gallery tbody").prepend(
              "<tr>" +
              "<td>" + data.result.data_.slice(10) + "</td>" +
              "<td> спомогатеьный файл </td>" +
              "<td>" + data.result.created + "</td>" +
              "</tr>"
          )
        }
      }
    }

  });

});