var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);
var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');
var messageInput = document.getElementById('message');
var h4 = document.getElementById('h4');

var textCanvas = document.getElementById('textCanvas');
var saveButton = document.getElementById('saveButton');
var tctx = textCanvas.getContext('2d');

//handle decoding
var decodeCanvas = document.getElementById('imageCanvas2');
var dctx = decodeCanvas.getContext('2d');
var imageLoader2 = document.getElementById('imageLoader2');
imageLoader2.addEventListener('change', handleImage2, false);

//save image
var saveButton = document.getElementById('saveButton');
saveButton.onclick = function () {
    var dataURL = canvas.toDataURL("image/png");
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.href = dataURL;
    link.download = "downoload_image.png";
    link.click();
    document.body.removeChild(link);
};

function handleImage(e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            saveButton.style.display = 'inline-block';
            textCanvas.width = img.width;
            textCanvas.height = img.height;

            tctx.font = "25px Arial";
            var messageText = (messageInput.value.length) ? messageInput.value : 'Привет';
            h4.innerHTML = "Введите сначала сообщение, чтобы скрыть его внутри изображения. Если поле не заполняется, сообщение будет: 'Привет'. C учетом выбранного файла максимальная длина вашего сообщения - " + Math.round((img.width / 17) * (img.height / 29)/ 10) * 10 +" символов. Вы ввели " + messageText.length;
            for (let i = 1; i < 20; i++) {
                let out = 0;
                if (messageInput.value.length > i * 50) {
                    for (let k = (i * 50 - 50); k <= (i * 50); k++) {
                        tctx.fillText(messageText[k], (out += 15), i * 30);
                    }
                }
                else {
                    for (let k = (i * 50) - 50; k < messageText.length; k++) {
                        tctx.fillText(messageText[k], out += 15, i * 30);
                    }
                    i = 20;
                }
            }
            ctx.drawImage(img, 0, 0);
            var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var textData = tctx.getImageData(0, 0, canvas.width, canvas.height);
            var pixelsInMsg = 0;
            pixelsOutMsg = 0;
            for (var i = 0; i < textData.data.length; i += 4) {
                if (textData.data[i + 3] !== 0) {
                    if (imgData.data[i + 1] % 10 == 7) {
                        //do nothing, we're good
                    }
                    else if (imgData.data[i + 1] > 247) {
                        imgData.data[i + 1] = 247;
                    }
                    else {
                        while (imgData.data[i + 1] % 10 != 7) {
                            imgData.data[i + 1]++;
                        }
                    }
                    pixelsInMsg++;
                }
                else {
                    if (imgData.data[i + 1] % 10 == 7) {
                        imgData.data[i + 1]--;
                    }
                    pixelsOutMsg++;
                }
            }
            console.log('pixels within message borders: ' + pixelsInMsg);
            console.log('pixels outside of message borders: ' + pixelsOutMsg);
            ctx.putImageData(imgData, 0, 0);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
}

function handleImage2(e) {
    console.log('handle image 2');
    var reader2 = new FileReader();
    reader2.onload = function (event) {
        console.log('reader2 loaded');
        var img2 = new Image();
        img2.onload = function () {
            console.log('img2 loaded');
            decodeCanvas.width = img2.width;
            decodeCanvas.height = img2.height;
            dctx.drawImage(img2, 0, 0);
            var decodeData = dctx.getImageData(0, 0, decodeCanvas.width, decodeCanvas.height);
            for (var i = 0; i < decodeData.data.length; i += 4) {
                if (decodeData.data[i + 1] % 10 == 7) {
                    decodeData.data[i] = 0;
                    decodeData.data[i + 1] = 0;
                    decodeData.data[i + 2] = 0;
                    decodeData.data[i + 3] = 255;
                }
                else {
                    decodeData.data[i + 3] = 0;
                }
            }
            dctx.putImageData(decodeData, 0, 0);
        };
        img2.src = event.target.result;
    };
    reader2.readAsDataURL(e.target.files[0]);
}