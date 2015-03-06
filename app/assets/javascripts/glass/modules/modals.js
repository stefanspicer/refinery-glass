/**
 * Created by jkrump on 06/02/15.
 */
var GlassModals = (function ($) {

  /**
   * Sets listeners for the open modal btn.
   * @param $openBtn - DOM Object
   * @param successCallback - Method to call on completion of something (typically a form being submitted)
   * @param validationMethod - function() - A validation method to call on a form.
   */
  function setOpenBtnListeners($openBtn, successCallback, validationMethod, validationParams){
    $openBtn.unbind('click').click(function(e){
      e.preventDefault();
      openBtnClickHandler($openBtn, successCallback, validationMethod, validationParams);
    });
  }

  /**
   * Handler for open modal btn being clicked.
   *
   * @param $openBtn         <DOM Object> - The button that was clicked
   * @param successCallback  <function>   - A method to call once a form in the modal has been successfully submitted.
   * @param validationMethod <function>   - A method to call to init js validation on the form.
   * @param validationParams <Object>     - An object containing params for the validation method.
   */
  function openBtnClickHandler($openBtn, successCallback, validationMethod, validationParams){
    // The openBtn must have a data attribute that specifies the
    // selector for the modal that it should trigger: ex: '#create-author-modal'
    var modalSelector = $openBtn.data('modal-selector');
    var $modal        = $(modalSelector);
    var $modalContent = $(modalSelector + ' .description');
    var url           = $openBtn.attr('data-url');
    // Check if this modal will be displaying a form.
    //
    if($modalContent.find('#form-wrapper').length == 0){
      loadAndDisplayFormModal(url, $modalContent, modalSelector, $modal, successCallback, validationMethod, validationParams);
    } else {
      // If the modal already has a form in it, then just re-show the modal.
      $modal.modal('show');
    }
    $('#sidebar-right').sidebar('hide');
    $('#sidebar-left').sidebar('hide');
  }

  /**
   * Loads a form from some URL into a modal and displays it.
   *
   * @param formSourceUrl    <String>     - The url that points to the view that contains the form to display.
   * @param $modalContent    <DOM Object> - The content in the main body of the modal
   * @param modalSelector    <String>     - The unique selector for the modal that is to be displayed.
   * @param $modal           <DOM Object> - The modal that will display and contain the form.
   * @param successCallback  <function>   - A method to call upon form successfully being submitted.
   * @param validationMethod <function>   - A validation method to call on the form.
   * @param validationParams <Object>     - Parameters to pass to the validation method.
   */
  function loadAndDisplayFormModal(formSourceUrl, $modalContent, modalSelector, $modal, successCallback, validationMethod, validationParams){
    var $saveBtn      = $modal.find('.positive');

    $modalContent.load( formSourceUrl + ' #form-wrapper', function(){
      // Remove the default actions from the form.
      $(this).find('.form-actions').remove();

      validationMethod(validationParams);
      // Call initializers for image uploading to work for the form within the
      // modal.
      GlassImageUploader.imageListeners('#form-wrapper');
      GlassImageUploader.fileUploaderListener('#form-wrapper');
      GlassImageUploader.uploadImageHandler('#form-wrapper');

      // Setup author form to use ajax form.
      CanvasForms.initFormSubmitWithin($modalContent);

      $saveBtn.unbind().click(function(e){
        e.preventDefault();
        var $form = $modal.find('form');
        $form.submit();

        // Listen for 'form-submit-complete' event fired from
        // CanvasForms after success.
        $form.on('form-submit-complete',function(){
          // Reset the form fields.
          // $(modalSelector + ' form')[0].reset();
          // Remove form (Simple solution atm to remove image)
          $modalContent.find('#form-wrapper').remove();

          successCallback();

          // reopen the right sidebar
          $('#sidebar-right').sidebar('show');
        });
      });
      $modal.modal('show');
    });
  }
  return {
    setOpenBtnListeners: setOpenBtnListeners
  };
})(jQuery);