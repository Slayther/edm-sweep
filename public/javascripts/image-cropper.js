

var crop_max_width = 500;
var crop_max_height = 400;
var jcrop_api;
var canvas;
var context;
var image;

var prefsize;

$("#file").change(function() {
    loadImage(this);
});

function loadImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        canvas = null;
        reader.onload = function(e) {

            image = new Image();
            image.onload = validateImage;
            image.src = e.target.result;

            const regex = /^data\:(.+?);/;
            regex.test(image.src);
            image.mimeType = RegExp.$1;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function dataURLtoBlob(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = decodeURIComponent(parts[1]);

        return new Blob([raw], {
            type: contentType
        });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);
    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {
        type: contentType
    });
}

function validateImage() {
    if (canvas != null) {
        image = new Image();
        image.onload = restartJcrop;
        image.src = canvas.toDataURL(image.mimeType);
    } else restartJcrop();
}

function restartJcrop() {
    if (jcrop_api != null) {
        jcrop_api.destroy();
    }
    $("#views").empty();
    $("#views").append("<canvas id=\"canvas\">");
    canvas = $("#canvas")[0];
    context = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image,0 ,0 );
    $("#canvas").Jcrop({
        onSelect: selectcanvas,
        // bgColor: 'black',
        onRelease: clearcanvas,
        // trueSize: [1000,600],

        boxWidth: crop_max_width,
        boxHeight: crop_max_height,
        aspectRatio: 5/4,
    }, function() {
        jcrop_api = this;
    });
    clearcanvas();
}

function clearcanvas() {
    prefsize = {
        x: 0,
        y: 0,
        w: canvas.width,
        h: canvas.height,
    };
}

function selectcanvas(coords) {
    let width = Math.round(coords.w);
    let height = Math.round(coords.h);
    let size = Math.max(width,height);

    prefsize = {
        x: Math.round(coords.x),
        y: Math.round(coords.y),
        w: width,
        h: height
    };
}

function applyCrop() {
    canvas.width = prefsize.w;
    canvas.height = prefsize.h;
    canvas.width = 500;
    canvas.height = 400;
    context.drawImage(image, prefsize.x, prefsize.y, prefsize.w, prefsize.h, 0, 0, canvas.width, canvas.height);
    validateImage();
}

function applyScale(scale) {
    if (scale == 1) return;
    canvas.width = canvas.width * scale;
    canvas.height = canvas.height * scale;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    validateImage();
}

function applyRotate() {
    canvas.width = image.height;
    canvas.height = image.width;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.translate(image.height / 2, image.width / 2);
    context.rotate(Math.PI / 2);
    context.drawImage(image, -image.width / 2, -image.height / 2);
    validateImage();
}

function applyHflip() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.translate(image.width, 0);
    context.scale(-1, 1);
    context.drawImage(image, 0, 0);
    validateImage();
}

function applyVflip() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.translate(0, image.height);
    context.scale(1, -1);
    context.drawImage(image, 0, 0);
    validateImage();
}

$("#cropbutton").click(function(e) {
    applyCrop();
});
$("#scalebutton").click(function(e) {
    var scale = prompt("Scale Factor:", "1");
    applyScale(scale);
});
$("#rotatebutton").click(function(e) {
    applyRotate();
});
$("#hflipbutton").click(function(e) {
    applyHflip();
});
$("#vflipbutton").click(function(e) {
    applyVflip();
});

$("#form").submit(function(e) {
    applyCrop();
    e.preventDefault();
    formData = new FormData($(this)[0]);
    var blob = dataURLtoBlob(canvas.toDataURL(image.mimeType));
    //---Add file blob to the form data
    formData.append("contestImage", blob);
    $.ajax({
        url: "/admin/new-post",
        type: "POST",
        data: formData,
        // contentType: image.mimeType,
        contentType: false,
        cache: false,
        processData: false,
        success: function(data) {
            // alert("Success");
            window.location = '/admin';
            console.log('Image uploaded');
        },
        error: function(data) {
            alert("Error");
        },
        complete: function(data) {}
    });
});

