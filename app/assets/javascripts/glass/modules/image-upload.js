var RefineryImageUploader = (function($){

    $(document).on('content-ready', function (e, element) {
        imageListeners(element);
        fileUploaderListener(element);
        uploadImageHandler();
        setPreviewDiv();
        initCropper();
        imageDeleteListener();
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
            $('.upload > .file-preview').fadeOut(200);
            $('#submit-image-btn').click();
        });
    }

    function setPreviewDiv(image){
        var previewDiv = $('.upload > .file-preview');
        var bgWidth = previewDiv.width();

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

/*        console.log("upload failed");
        console.log(response);
        console.log(response.responseJSON.errors);*/
        GlassFormHelper.insertErrors($('#image-upload-form'), response.responseJSON.errors, true);
    }

    function handleSuccess(response){
        var imageIdField = $('#image-id-field');
        var newBtnText = 'Replace Image';
        var deleteBtn = $("#image-delete-btn");
        var uploadbtn = $('#image-upload-btn');

        if(imageIdField.length > 0){
            imageIdField.val(response.image_id)

        }
        if(deleteBtn.length > 0){
            deleteBtn.attr('data-path', '/admin/images/' + response.image_id);
        } else {
            var deleteBtn = [
            '<button id="image-delete-btn" class="btn btn-link"',
                ' title="Delete" data-path="/admin/images/',response.image_id,'">',
                '<i class="gcicon gcicon-trash"></i>',
            '</button>'].join("");
            uploadbtn.after(deleteBtn);
            imageDeleteListener();
        }

        GlassFormHelper.resetState();
        setTimeout(function(){
            $('#progress-box').fadeOut(1000);
        }, 1500);

        uploadbtn.text(newBtnText);

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

    function imageDeleteListener(){
        $('#image-delete-btn').unbind('click').click(function(e){
            e.preventDefault();
            handleImageDelete($(this));
        });
    }

    function handleImageDelete(btn){

        $.ajax({
           type: 'DELETE',
           url: btn.attr('data-path'),
           data: {'authenticity_token': $('#auth_token').val()},
           success: handleDeleteSuccess,
           error: handleDeleteError
        });
    }

    function resetImageUpload() {
        var addBtnText = 'Add an image';
        $('#image-id-field').val(null);
        $('.upload > .file-preview').fadeOut(500);
        $('#image-upload-btn').text(addBtnText);
        $('#image-delete-btn').fadeOut(500, function(){$(this).remove()});
    }

    function handleDeleteSuccess(response) {
        resetImageUpload();
    }

    function handleDeleteError(response) {

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
