/**
 * Methods involving Semantic-UI modals
 * @author Jkrump
 * @created 12-06-2014
 * @updated 04-20-2015
 */
var GlassModals = (function ($) {

  $(document).on('content-ready', function (e, element) {
    $(element).find('.btn-modal-cancel').unbind('click').click(function(e){
      e.preventDefault();
      var $modal = $(this).closest('.modal');
      $modal.modal('hide');
    });
    $(element).find('.open-modal').unbind('click').click(function (e) {
      e.preventDefault();
      openBtnClickHandler($(this), undefined);
    });
  });

  /**
   * Sets listeners for the open modal btn.
   * @param $openBtn - DOM Object
   * @param successCallback - Method to call on completion of something (typically a form being submitted)
   */
  function setOpenBtnListeners($openBtn, successCallback){
    $openBtn.unbind('click').click(function(e){
      e.preventDefault();
      openBtnClickHandler($openBtn, successCallback);
    });
  }

  /**
   * Handler for open modal btn being clicked.
   *
   * @param $openBtn         <DOM Object> - The button that was clicked
   * @param successCallback  <function>   - A method to call once a form in the modal has been successfully submitted.
   */
  function openBtnClickHandler($openBtn, successCallback){
    // The openBtn must have a data attribute that specifies the
    // selector for the modal that it should trigger: ex: '#create-author-modal'
    var modalSelector = $openBtn.data('modal-selector');
    var $modal        = $(modalSelector);
    var $modalContent = $modal.find('.description');
    var url           = $openBtn.attr('href') !== undefined ? $openBtn.attr('href') : $openBtn.attr('data-url');
    var formSelector  = ' ' + ($openBtn.attr('data-form-selector') || 'form');

    // Check if this modal will be displaying a form.
    //
    if($modal.hasClass('confirm')){
      var $finalConfirmButton = $modal.find('.btn-confirm');
      var $previousConfirmButton = $modal.find('.btn-previous-confirm');

      if($previousConfirmButton.length > 0){
        $modal.modal({closable: false});
        $previousConfirmButton.unbind('click').click(function(e){
          e.preventDefault();
          if(successCallback !== undefined){
            successCallback();
          }
        });
        $finalConfirmButton.unbind('click').click(function(){
          $modal.modal('hide');
        });
      } else if($finalConfirmButton.length > 0){
        $finalConfirmButton.unbind('click').click(function(e){
          e.preventDefault();
          if(successCallback !== undefined){
            successCallback();
          }
        });
      }

      $modal.modal('show');
    } else if($modalContent.find('#form-wrapper').length === 0){
      if(url === undefined){
        console.warn('URL undefined for form');
        return 1;
      }

      loadAndDisplayFormModal(url, formSelector, $modalContent, $modal, successCallback);
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
   */
  function loadAndDisplayFormModal(formSourceUrl, formSourceSelector, $modalContent, $modal, successCallback){
    var $saveBtn        = $modal.find('.btn-submit-modal');
    var $removeImageBtn = null;

    formSourceUrl = (formSourceSelector === '') || (formSourceSelector === undefined) ? formSourceUrl : formSourceUrl+formSourceSelector;

    $modalContent.load(formSourceUrl, function(){
      // Remove the default actions from the form.
      $(this).find('.form-actions').remove();
      $(this).find('.deliver').remove();
      $removeImageBtn = $(this).find('.image-delete-btn');

      if($removeImageBtn.length > 0){
        $removeImageBtn.remove();
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
        var saveBtnHtml = $saveBtn.html();
        $saveBtn.html('<i class="ui active inline inverted xs loader"></i> Sending');
        $saveBtn.attr('disabled', 'disabled');

        e.preventDefault();
        var $form = $modal.find('form');
        var $rightSidebar = $('#sidebar-right');
        $form.submit();

        // Listen for 'form-submit-success' event fired from
        // CanvasForms after success.
        $form.on('form-submit-success', function(e, response, statusText, xhr, element) {
          // Remove form (Simple solution atm to remove image)
          $saveBtn.html(saveBtnHtml);
          $saveBtn.removeAttr('disabled');
          if(successCallback !== undefined){
            successCallback();
          }
          if(! $saveBtn.hasClass('positive')){
            $modal.modal('hide');
          }

          $modalContent.find('#form-wrapper').remove();
          // reopen the right sidebar
          if($rightSidebar.length > 0){
            $rightSidebar.sidebar('show');
          }
        });
      });
      $modal.modal('show');
    });
  }
  return {
    setOpenBtnListeners: setOpenBtnListeners
  };
})(jQuery);
