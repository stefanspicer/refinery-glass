var GlassImageUploader = (function ($) {

  var $currentImageContainer, $uploadPreviewContainer, $uploadPreviewContainers;

  $(document).on('content-ready', function (e, element) {
    imageListeners(element);
    fileUploaderListener(element);
    uploadImageHandler(element);
    initCropper();
    imageDeleteListener();
  });

  function imageListeners(element) {
    // Click listener for upload button
    $(element).find('.image-upload-btn').unbind('click').click(function (e) {
      e.preventDefault();
      console.log('set');
      $uploadPreviewContainer  = $(this).parents('.upload-preview-container');
      $uploadPreviewContainers = $('.upload-preview-container[data-field-name=' + $uploadPreviewContainer.attr('data-field-name') +']');
      $currentImageContainer   = $('.image-upload-container[data-field-name='   + $uploadPreviewContainer.attr('data-field-name') +']');
      openFileInput();
    });
    // Click listener for edit button
    $(element).find('.btn-edit-img').unbind('click').click(function (e) {
      e.preventDefault();
      $uploadPreviewContainer  = $(this).parents('.upload-preview-container');
      $uploadPreviewContainers = $('.upload-preview-container[data-field-name=' + $uploadPreviewContainer.attr('data-field-name') +']');
      $currentImageContainer   = $('.image-upload-container[data-field-name=' + $uploadPreviewContainer.attr('data-field-name') +']');
      openCropModal();
    });
  }

  function openFileInput() {
    var imageInputField = $('#refinery-image-input');
    imageInputField.click();
  }

  function fileUploaderListener(element) {
    var maxFileSizeBytes = (5242880 * 20);

    $(element).find('#refinery-image-input').change(function (e) {
      if (typeof FileReader == "undefined") return true;
      var isImage = true;
      var name = $(this).attr('name');
      var files = e.target.files;

      for (var i = 0, file; file = files[i]; i++) {
        if (file.type.match('image.*')) {
          if (file.size >= maxFileSizeBytes){

            CanvasForms.insertErrors($('#image-upload-form'), {
              image: ['Image is too large. Max size is 100 mb']
            }, true);

            isImage = false;
            return true;
          }
          var reader = new FileReader();
          reader.onload = (function (theFile) {
            return function (e) {
              var image = e.target.result;
              setPreviewDiv(image);
            };
          })(file);
          reader.readAsDataURL(file);
        } else {
          CanvasForms.insertErrors($('#image-upload-form'), {image: ['You may only upload an image here.']}, true);
          isImage = false;
          return true;
        }
      }

      if (isImage) {
        CanvasForms.resetState();
        if($uploadPreviewContainers !== undefined){
          $uploadPreviewContainers.find('.file-preview').fadeOut(200);
        }
        $('#submit-image-btn').click();
      }
    });
  }

  function setPreviewDiv(image) {

    if($uploadPreviewContainers !== undefined){
      var $previewDivs = $uploadPreviewContainers.find('.file-preview');
    }

    if (image !== undefined) {
      $(document).trigger('image-preview', image);

      if ($uploadPreviewContainer !== undefined){
        $('[data-glass-img-id="' + $uploadPreviewContainer.attr('data-field-name') + '"]').attr('src', image);
        $('[data-glass-bg-img-id="' + $uploadPreviewContainer.attr('data-field-name') + '"]').css({"background-image": "url(" + image + ")"});

        $previewDivs.css({"background-image": "url(" + image + ")"});
        $previewDivs.fadeIn(500);
        var editModal = $('#modal-edit-image');
        // if there is an edit modal, change the image that is being
        // displayed in it.
        if (editModal.length > 0) {
          var editableImage = editModal.find('.cropper-container > img');
          if (editableImage.length > 0) {
            editableImage.cropper("destroy");
            editableImage.attr("src", image);
          } else {
            editModal.find('.cropper-container').append('<img src="' + image + '">');
          }
          initCropper();
        }
      }
    }

    if($uploadPreviewContainer === undefined){
      $uploadPreviewContainer = $('.inline-editable-image-container');
      $uploadPreviewContainers = $uploadPreviewContainer;
    }
    resetProgressBar();

    if($uploadPreviewContainer.length > 0 && $uploadPreviewContainers !== undefined){
      $uploadPreviewContainers.find('.progress-box').show();
    }

  }

  function initCropper() {
    var $image = $(".cropper-container > img"),
      options = {
        modal: false,
        data: {width: 640, height: 360},
        preview: '.cropper-preview',
        done: function (data) {}
      };

    $image.cropper(options);

    $('.btn-primary[data-method="rotate"]').unbind('click').click(function (e) {
      $image.cropper('rotate', $(this).attr('data-option'));
    });
    $('.btn-primary[data-method="zoom"]').unbind('click').click(function (e) {
      $image.cropper('zoom', $(this).attr('data-option'));
    });
  }

  function uploadImageHandler(element) {
    var imageForm = $(element).find('#image-upload-form');

    var options = {
      target: "#output",
      beforeSubmit: beforeSubmit,
      uploadProgress: onProgress,
      success: handleSuccess,
      error: handleError,
      resetForm: true
    };

    imageForm.submit(function (e) {
      $(this).ajaxSubmit(options);

      return false;
    });
  }

  function beforeSubmit() {

  }

  function handleError(response) {
    $uploadPreviewContainers.find('.progress-box').hide();

     CanvasForms.insertErrors($('#image-upload-form'), response.responseJSON.errors, true);
  }

  function handleSuccess(response) {


    if($currentImageContainer !== undefined){
      var imageIdField = $currentImageContainer.find('.image-id-field');
      if (imageIdField.length > 0) {
        imageIdField.val(response.image_id)
      }
    }
    if($uploadPreviewContainers !== undefined) {

      var newBtnText = 'Replace Image';
      var $deleteBtns = $uploadPreviewContainers.find('.image-delete-btn');
      var $uploadBtns = $uploadPreviewContainers.find('.image-upload-btn');

      $(document).trigger('image-uploaded', response.url);

      if ($deleteBtns.length > 0){
        $deleteBtns.attr('data-path', '/admin/images/' + response.image_id);
        $deleteBtns.fadeIn(500);
      }

      CanvasForms.resetState();

      $uploadPreviewContainers.find('.progress-box').fadeOut(1500);

      setTimeout(function () {
        if($uploadBtns.length > 0){
          $uploadBtns.text(newBtnText);
        }
        $uploadPreviewContainers.find('.file-preview').fadeIn(500);
      }, 1500);
    }
  }

  function updateProgressBar(percentComplete) {
    if($uploadPreviewContainers !== undefined){
      var statusText = $uploadPreviewContainers.find('.status-text');
      $uploadPreviewContainers.find('.progress-bar').width(percentComplete + '%').attr('aria-valuenow', percentComplete);
      statusText.html(percentComplete + '%');

      if (percentComplete > 50) {
        statusText.css('color', '#fff'); // change status text to white after 50%
      }
    }
  }

  function imageDeleteListener(element) {
    $(element).find('.image-delete-btn').unbind('click').click(function (e) {
      e.preventDefault();
      $uploadPreviewContainer  = $(this).parents('.upload-preview-container');
      $uploadPreviewContainers = $('.upload-preview-container[data-field-name=' + $uploadPreviewContainer.attr('data-field-name') +']');
      $currentImageContainer   = $('.image-upload-container[data-field-name='   + $uploadPreviewContainer.attr('data-field-name') +']');
      handleImageDelete($(this));
    });
  }

  function handleImageDelete($btn) {
    handleDeleteSuccess();

    //
    // This code below actually deletes the image...   BUT   this introduces a slight permissions problem.  Users can delete other users images
    //
    //$uploadPreviewContainer = $btn.parents('.upload-preview-container');
    //$currentImageContainer = $('.image-upload-container[data-field-name=' + $uploadPreviewContainer.attr('data-field-name') +']');
    //$.ajax({
    //  type: 'DELETE',
    //  url: $btn.attr('data-path'),
    //  data: {'authenticity_token': $('#auth_token').val()},
    //  success: handleDeleteSuccess,
    //  error: handleDeleteError
    //});
  }

  function resetImageUpload() {
    var addBtnText = 'Upload an Image';
    $currentImageContainer.find('.image-id-field').val(null);
    $uploadPreviewContainers.find('.file-preview').fadeOut(500);
    $uploadPreviewContainers.find('.image-upload-btn').text(addBtnText);
    $uploadPreviewContainers.find('.image-delete-btn').fadeOut(500);
  }

  function handleDeleteSuccess(response) {
    resetImageUpload();
  }

  function handleDeleteError(response) {
    // TODO: Do something here.
  }

  function resetProgressBar() {
    updateProgressBar(1);
    if($uploadPreviewContainers !== undefined){
      $uploadPreviewContainers.find('.status-text').css('color', '#000000');
    }
  }

  function onProgress(event, position, total, percentComplete) {
    updateProgressBar(percentComplete);
  }

  function openCropModal() {
    $('#modal-edit-image').modal('show');
  }

  // Return API for other modules
  return {
    imageListeners: imageListeners,
    fileUploaderListener: fileUploaderListener,
    uploadImageHandler: uploadImageHandler,
    openFileInput: openFileInput,
  };
})(jQuery);
