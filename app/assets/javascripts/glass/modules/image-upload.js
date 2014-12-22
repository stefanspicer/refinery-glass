var RefineryImageUploader = (function($){

    $(document).on('content-ready', function (e, element) {
        imageUploadBtnListener(element);
        fileUploaderListener(element);
        uploadImageHandler();
        var hasImage = $("#image-id-field").val();
        setPreviewDiv();

    });

    function imageUploadBtnListener(element){
        $(element).find('#image-upload-btn').click(function(e){
            e.preventDefault();
            openFileInput();
        });
    }

    function openFileInput(){
        $('#refinery-image-input').click();
    }

    function fileUploaderListener(element){
        $(element).find('input[type=file]').change(function(e) {
            if(typeof FileReader == "undefined") return true;
            var previewElement = $('.upload > .file-preview');


            var elem = $(this);
            var files = e.target.files;

            for (var i=0, file; file=files[i]; i++) {
                if (file.type.match('image.*')) {
                    var reader = new FileReader();
                    reader.onload = (function(theFile) {
                        return function(e) {

                            var image = e.target.result;

                            setPreviewDiv(image);
                        };
                    })(file);
                    reader.readAsDataURL(file);
                }
            }
            $('#submit-image-btn').click();
        });
    }

    function setPreviewDiv(image){
        previewDiv = $('.upload > .file-preview');

        bgWidth = previewDiv.width();
        previewDiv.css({
            "background-size":bgWidth + "px, auto",
            "background-position":"50%, 50%"
        });

        if(image !== undefined){
            previewDiv.css({"background-image":"url("+image+")"});
            previewDiv.fadeIn(500);
        }
    }

    function uploadImageHandler(){
        var imageForm = $('#image-upload-form');
        var url = imageForm.attr('action');
        var model = $('.form-with-image').attr('data-model');
        var form_field = $('.form-with-image').attr('data-field-name');

        imageForm.submit(function(e){
            $.ajax({
                method: 'post',
                url: url,
                data: new FormData(this),
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function(response){
                    var imageIdField = $('#image-id-field');

                    if(imageIdField.length > 0){
                        imageIdField.val(response.image_id)
                    }
                    $('.upload > .file-preview').fadeIn(500);
                },
                error: function(response){
                    console.log("fail response");
                    console.log(response);
                }
            });
            e.preventDefault();
        });
    }


    // Return API for other modules
    return {};
})(jQuery);
