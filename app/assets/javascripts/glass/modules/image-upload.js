var GlassImageUploader = (function ($) {

  var $CURRENT_IMAGE_CONTAINER, $UPLOAD_PREVIEW_CONTAINER, $UPLOAD_PREVIEW_CONTAINERS;

  $(document).on('content-ready', function (e, element) {
    imageListeners(element);
    fileUploaderListener(element);
    uploadImageHandler(element);
    initCropper();
    imageDeleteListener(element);
  });

  function imageListeners(element) {
    // Click listener for upload button
    $(element).find('.image-upload-btn').unbind('click').click(function (e) {
      e.preventDefault();
      $UPLOAD_PREVIEW_CONTAINER  = $(this).parents('.upload-preview-container');
      $UPLOAD_PREVIEW_CONTAINERS = $('.upload-preview-container[data-field-name=' + $UPLOAD_PREVIEW_CONTAINER.attr('data-field-name') +']');
      $CURRENT_IMAGE_CONTAINER   = $('.image-upload-container[data-field-name='   + $UPLOAD_PREVIEW_CONTAINER.attr('data-field-name') +']');
      openFileInput();
    });

    // Click listener for edit button
    $(element).find('.btn-edit-img').unbind('click').click(function (e) {
      e.preventDefault();
      $UPLOAD_PREVIEW_CONTAINER  = $(this).parents('.upload-preview-container');
      $UPLOAD_PREVIEW_CONTAINERS = $('.upload-preview-container[data-field-name=' + $UPLOAD_PREVIEW_CONTAINER.attr('data-field-name') +']');
      $CURRENT_IMAGE_CONTAINER   = $('.image-upload-container[data-field-name=' + $UPLOAD_PREVIEW_CONTAINER.attr('data-field-name') +']');
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
        } else {
          CanvasForms.insertErrors($('#image-upload-form'), {image: ['You may only upload an image here.']}, true);
          isImage = false;
          return true;
        }
      }

      if (isImage) {
        CanvasForms.resetState();
        if($UPLOAD_PREVIEW_CONTAINERS !== undefined){
          $UPLOAD_PREVIEW_CONTAINERS.find('.file-preview').fadeOut(200);
        }
        $('#submit-image-btn').click();
      }
    });
  }


  function setPreviewDiv() {

    if($UPLOAD_PREVIEW_CONTAINERS !== undefined){
      var $previewDivs = $UPLOAD_PREVIEW_CONTAINERS.find('.file-preview');
      $previewDivs.fadeIn(500);
    }

    if($UPLOAD_PREVIEW_CONTAINER === undefined){
      $UPLOAD_PREVIEW_CONTAINER = $('.inline-editable-image-container');
      $UPLOAD_PREVIEW_CONTAINERS = $UPLOAD_PREVIEW_CONTAINER;
    }
    resetProgressBar();

    if($UPLOAD_PREVIEW_CONTAINER.length > 0 && $UPLOAD_PREVIEW_CONTAINERS !== undefined){
      $UPLOAD_PREVIEW_CONTAINERS.find('.progress-box').show();
    }
  }

  function afterSuccess(imageUrl){
    var editModal = $('#modal-edit-image');
    // if there is an edit modal, change the image that is being
    // displayed in it.
    if (editModal.length > 0) {
      var editableImage = editModal.find('.cropper-container > img');
      if (editableImage.length > 0) {
        editableImage.cropper("destroy");
        editableImage.attr("src", imageUrl);
      } else {
        editModal.find('.cropper-container').append('<img src="' + imageUrl + '">');
      }
      initCropper();
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
    setPreviewDiv();
  }

  function handleError(response) {
    $UPLOAD_PREVIEW_CONTAINERS.find('.progress-box').hide();

     CanvasForms.insertErrors($('#image-upload-form'), response.responseJSON.errors, true);
  }

  function handleSuccess(response) {

    if($CURRENT_IMAGE_CONTAINER !== undefined){
      var imageIdField = $CURRENT_IMAGE_CONTAINER.find('.image-id-field');
      if (imageIdField.length > 0) {
        imageIdField.val(response.image_id)
      }
    }

    if($UPLOAD_PREVIEW_CONTAINERS !== undefined) {

      var newBtnText = 'Replace Image';
      var $deleteBtns = $UPLOAD_PREVIEW_CONTAINERS.find('.image-delete-btn');
      var $uploadBtns = $UPLOAD_PREVIEW_CONTAINERS.find('.image-upload-btn');
      var $previewDiv = $UPLOAD_PREVIEW_CONTAINERS.find('.file-preview');

      $(document).trigger('image-uploaded', response.url);

      if ($deleteBtns.length > 0){
        $deleteBtns.attr('data-path', '/admin/images/' + response.image_id);
        $deleteBtns.fadeIn(500);
      }

      if($uploadBtns.length > 0){
        $uploadBtns.text(newBtnText);
      }
      $previewDiv.css('background-image', 'url(' + response.url + ')');

      CanvasForms.resetState();

      $UPLOAD_PREVIEW_CONTAINERS.find('.progress-box').fadeOut(1000);

      afterSuccess(response.url);
    }
  }

  function updateProgressBar(percentComplete) {
    if($UPLOAD_PREVIEW_CONTAINERS !== undefined){
      var statusText = $UPLOAD_PREVIEW_CONTAINERS.find('.status-text');
      $UPLOAD_PREVIEW_CONTAINERS.find('.progress-bar').width(percentComplete + '%').attr('aria-valuenow', percentComplete);
      statusText.html(percentComplete + '%');

      if (percentComplete > 50) {
        statusText.css('color', '#fff'); // change status text to white after 50%
      }
    }
  }

  function imageDeleteListener(element) {
    $(element).find('.image-delete-btn').unbind('click').click(function (e) {
      e.preventDefault();
      $UPLOAD_PREVIEW_CONTAINER  = $(this).parents('.upload-preview-container');
      $UPLOAD_PREVIEW_CONTAINERS = $('.upload-preview-container[data-field-name=' + $UPLOAD_PREVIEW_CONTAINER.attr('data-field-name') +']');
      $CURRENT_IMAGE_CONTAINER   = $('.image-upload-container[data-field-name='   + $UPLOAD_PREVIEW_CONTAINER.attr('data-field-name') +']');
      handleImageDelete($(this));
    });
  }

  function handleImageDelete($btn) {
    handleDeleteSuccess();
    //
    // This code below actually deletes the image...   BUT   this introduces a slight permissions problem.  Users can delete other users images
    //
    //$UPLOAD_PREVIEW_CONTAINER = $btn.parents('.upload-preview-container');
    //$CURRENT_IMAGE_CONTAINER = $('.image-upload-container[data-field-name=' + $UPLOAD_PREVIEW_CONTAINER.attr('data-field-name') +']');
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
    $CURRENT_IMAGE_CONTAINER.find('.image-id-field').val(null);
    $UPLOAD_PREVIEW_CONTAINERS.find('.file-preview').fadeOut(500);
    $UPLOAD_PREVIEW_CONTAINERS.find('.image-upload-btn').text(addBtnText);
    $UPLOAD_PREVIEW_CONTAINERS.find('.image-delete-btn').fadeOut(500);
  }

  function handleDeleteSuccess(response) {
    resetImageUpload();
  }

  function handleDeleteError(response) {
    // TODO: Do something here.
  }

  function resetProgressBar() {
    updateProgressBar(1);
    if($UPLOAD_PREVIEW_CONTAINERS !== undefined){
      $UPLOAD_PREVIEW_CONTAINERS.find('.status-text').css('color', '#000000');
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
    openFileInput: openFileInput
  };
})(jQuery);
