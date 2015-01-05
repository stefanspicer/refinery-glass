var RefineryImageUploader = (function($){

    $(document).on('content-ready', function (e, element) {
        imageListeners(element);
        fileUploaderListener(element);
        uploadImageHandler();
        setPreviewDiv();
        initCropper();
    });

    function imageListeners(element){
        $(element).find('#image-upload-btn').click(function(e){
            e.preventDefault();
            openFileInput();
        });
        $(element).find('.btn-edit-img').click(function(e){
            e.preventDefault();
            openCropModal();
        })
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
        modalImage =
        bgWidth = previewDiv.width();
        previewDiv.css({
            "background-size":bgWidth + "px, auto"
        });

        if(image !== undefined){
            previewDiv.css({"background-image":"url("+image+")"});
            previewDiv.fadeIn(500);
            var editModal = $('#modal-edit-image');
            // if there is an edit modal, change the image that is being
            // displayed in it.
            if(editModal.length > 0 ){
                var editableImage = editModal.find('.cropper-container > img');
                if(editableImage.length > 0){
                    editableImage.cropper("destroy");
                    editableImage.attr("src", image);
                } else {
                    editModal.find('.cropper-container').append('<img src="'+image+'">');
                }
                initCropper();
            }
        }
    }

    function initCropper() {
        var $image = $(".cropper-container > img"),
            options = {
                modal: false,
                data: {width: 640, height: 360},
                preview: '.cropper-preview',
                done: function(data) {

                }
            };

        $image.cropper(options);

        $('.btn-primary[data-method="rotate"]').unbind('click').click(function(e){
            $image.cropper('rotate', $(this).attr('data-option'));
        });
        $('.btn-primary[data-method="zoom"]').unbind('click').click(function(e){
            $image.cropper('zoom', $(this).attr('data-option'));
        });
    }

    function uploadImageHandler(){
        var imageForm = $('#image-upload-form');
        var model = $('.form-with-image').attr('data-model');

        var options = {
            target: "#output",
            beforeSubmit: beforeSubmit,
            uploadProgress: onProgress,
            success: handleSuccess,
            error: handleError,
            resetForm: true
        };

        imageForm.submit(function(e){
            $(this).ajaxSubmit(options);

            return false;
        });
    }

    function beforeSubmit(){
        resetProgressBar();
        $('#progress-box').show();
    }

    function handleError(response){
        $('#progress-box').hide();

        GlassFormHelper.insertErrors($('#image-upload-form'), response.responseJSON.errors, true);
    }

    function handleSuccess(response){
        var imageIdField = $('#image-id-field');
        var newBtnText = 'Replace Image';

        if(imageIdField.length > 0){
            imageIdField.val(response.image_id)
        }

        $('#image-upload-btn').text(newBtnText);

        $('.upload > .file-preview').fadeIn(500);

    }

    function updateProgressBar(percentComplete){
        var statusText = $("#status-text");
        $("#progress-bar").width(percentComplete + '%');
        statusText.html(percentComplete + '%');

        if(percentComplete > 50){
            statusText.css('color','#fff'); // change status text to white after 50%
        }
    }

    function resetProgressBar(){
        updateProgressBar(1);
        $("#status-text").css('color','#000000');
    }

    function onProgress(event, position, total, percentComplete){
        updateProgressBar(percentComplete);
    }

    function openCropModal(){
        $('#modal-edit-image').modal('show');
    }

    // Return API for other modules
    return {};
})(jQuery);
