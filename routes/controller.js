var app = angular.module('myapp',[]);
app.controller("mycontroller",function ($scope,$http) {
    $scope.img=[];
    getPreData();
    $scope.inImg = "images/one.jpg";
    $scope.changeImage = function(change){
        console.log("change",change);
        // if(change === 'two'){
        //     document.getElementById('c').setAttribute('style', 'border: 1px solid white;')
        // }
        $scope.inImg = "images/"+change+".jpg"
    };
    var canvas = window._canvas = new fabric.Canvas('c');
    document.getElementById('imgLoader').onchange = function handleImage(e) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var img = new Image();
            img.onload = function () {
                var imgInstance = new fabric.Image(img, {
                    scaleX: 0.1,
                    scaleY: 0.1
                });
                canvas.add(imgInstance);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);
    };
    // To Bring Selected Object Front Start
    canvas.on("object:selected", function(options) {
        options.target.bringToFront();
    });
    // To Bring Selected Object Front End

    //Text Insertion Start
    $scope.addText = function() {
        canvas.add(new fabric.IText('Hello World!', {
            left: 35,
            top: 70,
            fontFamily: 'arial black',
            fill: '#333',
            fontSize: 30
        }));
    };
    //Text Insertion End

    //Deleting Selected Object Start
    $scope.deleteObjects = function (){
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
            if (confirm('Are you sure?')) {
                canvas.remove(activeObject);
            }
        }
    };
    //Deleting Selected Object End

    //Changing Font Color Start
    addHandler('color', function(obj) {
        setStyle(obj, 'fill', this.value);
    }, 'onchange');
    function addHandler(id, fn, eventName) {
        document.getElementById(id)[eventName || 'onclick'] = function() {
            var el = this;
            if (obj = canvas.getActiveObject()) {
                fn.call(el, obj);
                canvas.renderAll();
            }
        };
    }
    function setStyle(object, styleName, value) {
        if (object.setSelectionStyles && object.isEditing) {
            var style = { };
            style[styleName] = value;
            object.setSelectionStyles(style).setCoords();
        }
        else {
            object[styleName] = value;
        }
        canvas.renderAll();
    }
    //Changing Font Color End

    //File Saving Start

    var imageSaver = document.getElementById('imageSaver');
    imageSaver.addEventListener('click', saveImage, false);

    function saveImage(e) {
        this.href = canvas.toDataURL({
            format: 'jpeg',
            quality: 10
        });
        this.download = 'MyEdit.jpeg'
    }
    //File Saving End

    function getPreData() {
        $http({
            url:"/api/getAllDesigns",
            method:"GET"
        }).then(function success(resp) {
            console.log("Success Getting",resp);
            if(resp.data){
                $scope.img = resp.data;
            }
        },function error(reason) {
            console.log("error getting",reason)
        })
    }
    $scope.uploadImage = function() {
        if(confirm('Are you sure?')) {
            var dataURL = canvas.toDataURL({
                format: 'jpeg',
                quality: 1
            });
            var url = "/api/InsertImage";
            $http({
                method: 'POST',
                url: url,
                data: {obj: dataURL},
                contentType: "image/jpeg"
            })
                .then(function successCallback(response) {
                    console.log("Here:", response);
                    if(response.status===500){
                        alert("Something went Wrong")
                    }
                    else{
                        canvas.clear();
                        getPreData();
                        alert("Congrats Your Order Placed");
                    }
                }, function errorCallback(response) {
                    console.log("response.data error : ", response);
                });
        }
    };

    $scope.loadImg = function (data) {
        var image = new Image();
        image.onload = function() {
            var imgInstance = new fabric.Image(image, {
                scaleX: 0.3,
                scaleY: 0.4
            });
            canvas.add(imgInstance);
            // context.drawImage(image, 0, 0);
        };
        image.src = "data:image/png;base64,"+data;
    };
    $scope.redraw =function () {

        canvas.clear();
    }
});




