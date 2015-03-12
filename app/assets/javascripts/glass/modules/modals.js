/**
 * Methods involving Semantic-UI modals
 * @author Jkrump
 * @created 12-06-2014
 * @updated 03-06-2015
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
    var formSelector  = $openBtn.attr('data-form-selector') || '';

    // Check if this modal will be displaying a form.
    //
    if($modalContent.find('#form-wrapper').length == 0){
      loadAndDisplayFormModal(url, formSelector, $modalContent, $modal, successCallback, validationMethod, validationParams);
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
   * @param formSourceSelector <String>   - The selector for the form
   * @param $modalContent    <DOM Object> - The content in the main body of the modal
   * @param $modal           <DOM Object> - The modal that will display and contain the form.
   * @param successCallback  <function>   - A method to call upon form successfully being submitted.
   * @param validationMethod <function>   - (optional) A validation method to call on the form.
   * @param validationParams <Object>     - (optional) Parameters to pass to the validation method.
   */
  function loadAndDisplayFormModal(formSourceUrl, formSourceSelector, $modalContent, $modal, successCallback, validationMethod, validationParams){
    var $saveBtn      = $modal.find('.positive');

    $modalContent.load(formSourceUrl + ' ' + formSourceSelector, function(){
      // Remove the default actions from the form.
      $(this).find('.form-actions').remove();
      $(this).find('.deliver').remove();

      if(validationMethod !== undefined){
        validationMethod(validationParams);
      }

      // Call initializers for image uploading to work for the form within the
      // modal.
      GlassImageUploader.imageListeners($(this));
      GlassImageUploader.fileUploaderListener($(this));
      GlassImageUploader.uploadImageHandler($(this));

      // Setup author form to use ajax form.
      CanvasForms.initFormSubmitWithin($modalContent);
      $(document).trigger('content-ready', $modalContent);

      $saveBtn.unbind().click(function(e){
        e.preventDefault();
        var $form = $modal.find('form');
        $form.submit();

        // Listen for 'form-submit-complete' event fired from
        // CanvasForms after success.
        $form.on('form-submit-complete',function(){
          // Remove form (Simple solution atm to remove image)
          successCallback();
          $modal.modal('hide');
          $modalContent.find('#form-wrapper').remove();
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
