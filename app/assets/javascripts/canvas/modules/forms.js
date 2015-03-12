var CanvasForms = (function ($) {
  $(document).on('content-ready', function (e, element) {
    // initialize verify (form validation library)
    initVerify();

    initFormSelectsWithin(element);
    initFormOptionalFieldsWithin(element);
    initFormSubmitWithin(element);

    // remove the disabled attribute from all buttons within
    // forms once the js has loaded.
    $('form button').removeAttr('disabled');

    $('[data-confim]').unbind();
    $(element).find('a#delete_button').unbind('click').click(function(e){
      e.preventDefault();
      openDeleteConfirmModal($(this));
    });
    $(element).find('.delete-model').unbind('click').click(function(e){
      e.preventDefault();
      openDeleteConfirmModal($(this));
    });
  });

  function initFormSelectsWithin(element) {
    if ($(element).find('select').length > 0) {
      if ('MozAppearance' in $(element).find('select')[0].style) {
        $('html').addClass('moz-appearance');
      }
    }
  }

  var count = 0;

  function initVerify(){

    $.verify({
      prompt: function(element, text) {

        $(element).parents('.form-group').find('.tip.text-danger').html(text || '');
        // after a short delay, scroll to the input with the error.
        if(count < 1 && text != null){
          count++;
          setTimeout(function(){
            $('html, body').animate({
              scrollTop: $(element).offset().top - 73
            }, 500);
            count = 0;
          }, 100);
        }
      },
      skipHiddenFields : false
    });
    $.verify.addRules({
      required_w_name: function(r) {
        var $label = $(r.field).parents('.form-group').find('label');
        var validationPrefix = $(r.field).data('pre-val-msg');
        var message;
        var inputValue = r.val();
        if((inputValue == '') || (inputValue == undefined) || (inputValue == null))
        {
          if (validationPrefix !== undefined){
            message = validationPrefix + ' is required';
          } else {
            message = ($label.length > 0) ? 'The ' + $label.text() + ' is required' : 'This field is required'
          }
          return message;
        }
        return true;
      }
    });
  }

  function initFormOptionalFieldsWithin(element) {
    $(element).find("#registration_situation").change(function () {
      $("#registration_situation_other").parents('.form-group')
        .toggle($(this).val() == "Other");
      $("#registration_situation_contraception").parents('.form-group')
        .toggle($(this).val().match(/contracept/i) != null);
    });
    $(element).find("#registration_how_find").change(function () {
      $("#registration_how_find_other").parents('.form-group')
        .toggle($(this).val() == "Other");
    });
    $(element).find("#registration_situation").change();
    $(element).find("#registration_how_find").change();
  }

  function initFormSubmitWithin(element) {
    $(element).find('form').each(function () {
      // if ($(this).hasClass('no-ajax') || !$(this).attr('id')) {
      //   return;
      // }

      if (!($(this).hasClass('ajax-form') || $(this).parents('.modal').length > 0)) {
        return;
      }
      var selector = "#" + $(this).attr('id');
      var $form = $(this);
      var $submit_btn = $form.find('.btn[type="submit"]');

      $form.ajaxForm({
        beforeSubmit: function(arr, $form, options){
          $submit_btn.data('orig-btn-txt', $submit_btn.text());
          $submit_btn.html('<i class="ui active inline inverted xs loader"></i> Sending');
          $submit_btn.attr('disabled', 'disabled');
        },
        complete: function (xhr, status) {

          $form.trigger('form-submit-complete');

          if ($form.hasClass('mailchimp')) {
            $form.find('input[type="email"]').val('Thank you!');
            return;
          }
          if (status != 'success') {
            $(selector).append('<div id="errorExplanation" ' +
              'class="errorExplanation text-center"><p>An error occured.' +
              ' Please try again or send us an email</p></div>');
            return;
          }
          xhr.done(function (data) {
            var replace_selector = $form.data('ajax-replace-selector');
            var $replace_form    = replace_selector ? $(data).find(replace_selector) : $(data).find(selector); // the same form in response, replace it
            var $page_body       = $(data).find('#body_content');                                              // response is a page, use inner content
            var $error_response  = ($(data).attr('id') == 'errorExplanation') ? $(data) : $(data).find('#errorExplanation');
            var $modal           = $(selector).parents('.modal');
            var $replacement     = null;

            var callback = $form.data('success-callback');
            if (callback) {
              var result = callback($replace_form);
              if (result === false) {
                return;
              }
            }

            if ($replace_form.length > 0) {
              $replacement = $replace_form;
            }
            else if ($page_body.length > 0) {
              $replacement = $page_body;
            }
            else if ($error_response.length > 0) {
              var $cur_error = $(selector + ' #errorExplanation');
              if ($cur_error.length > 0) {
                replaceContent($cur_error, $error_response);
              }
              else {
                $error_response.insertBefore(selector + ' .form-actions');
              }
              $submit_btn.html($submit_btn.data('orig-btn-txt'));
              $submit_btn.removeAttr('disabled');
            }
            else {
              $replacement = $('<p>Thank you</p>'); // Default response message
            }

            if ($replacement && $modal.length == 0) {
              $replacement.find('h1').remove();          // inquiries engine puts an h1 in there
              replaceContent($(selector), $replacement);
            }
            else if ($modal.length > 0) {

              var $update_selector = $modal.find('.update-on-close');

              if ($update_selector.length > 0) {
                ajaxUpdateContent($update_selector);

                // The button that on click, will trigger the modal that was displayed
                // before the current modal was displayed.
                var callback_modal_btn = $('#callback-modal');

                // If there is another modal to display after this one's form has
                // been submitted, then don't hide the modal, but rather, trigger
                // the previous modal to be displayed.
                if (callback_modal_btn.length > 0) {
                  $(callback_modal_btn.data('selector')).click();
                } else {
                  $modal.modal('hide');
                }
                return;
              }
            }

            // A reset form is a form that doesn't have to be rendered again,
            // because it already exists on a page and wasn't pulled in using 'load'.
            // It simply needs its input values wiped.
            var $resetForm = $('.ajax-reset-form');

            if ($resetForm.length > 0) {
              var updateArea = $resetForm.find('.update-on-close');
              if (updateArea.length > 0) {
                ajaxUpdateContent(updateArea);
                // Clear input values from the form (except for hidden values)
                $resetForm.trigger("reset");
                return;
              }
            }
          });
        }
      });
    });
  }

  function confirmDeleteListener(){
    $('.confirm-model-delete').unbind('click').click(function(e){
      e.preventDefault();
      var $confirmBtn = $(this);
      $.ajax({
        url: $confirmBtn.attr('data-url'),
        type: 'DELETE',
        success: function(result) {
          console.log('Deletion Successful');
          console.log(result);
        }
      }).always(function(){
        window.location.href = $confirmBtn.attr('data-redirect-url');
      });
    });
  }

  function ajaxUpdateContent(update_selector) {
    var $tmp = $("<div></div>");
    var $to_update = $(update_selector.data('selector'));
    $tmp.insertAfter($to_update).append($to_update);
    $tmp.load(document.URL + ' ' + update_selector.data('selector'));
    $(document).trigger('content-ready', $(update_selector.data('selector')));
  }

  function replaceContent($orig, $replacement) {
    $(document).trigger('content-ready', $replacement.parent()[0]);
    $orig.fadeOut(function () {
      $(this).replaceWith($replacement);
      $replacement.fadeIn();
    });
  }

  function resetState() {
    $('.help-inline').remove();
    $('.error').removeClass('error');
  }

  function insertErrors(form, errorMessages, imageForm) {
    resetState();

    if (imageForm !== undefined) {
      insertMessage('image', errorMessages);
      return 0;
    }

    var errorContainer = [
      '<div class="payment-error-explanation errorExplanation" id="errorExplanation">',
      '<p>Please check below for errors</p></div>'].join("");

    form.find('#errorExplanation').replaceWith(errorContainer);


    for (var attribute in errorMessages) {
      insertMessage(attribute, errorMessages);
    }

    showAndGoToErrors(form);
  }

  function insertMessage(attribute, errorMessages) {
    var errorMessage = ['<span class="help-inline text-danger">', errorMessages[attribute][0], '</span>'].join("");

    if (attribute == 'image') {
      $('.file-preview').addClass('error').after(errorMessage);
    } else {
      var inputSelector = $('input[name="' + attribute + '"]');
      inputSelector.parents('.form-group').addClass('error');

      if (inputSelector.parents('.input-group').length > 0) {
        inputSelector.parents('.input-group').after(errorMessage);
      } else {
        inputSelector.after(errorMessage)
      }
    }
  }

  function insertStripeErrors(form, messages) {

    var errorContainer = [
      '<div class="payment-error-explanation errorExplanation" id="errorExplanation">',
      '<p>There were problems with the following:</p>'];

    errorContainer.push("<ul class='payment-errors list-unstyled'>");
    $(messages).each(function (index, message) {
      errorContainer.push("<li>", message, "</li>");
    });
    errorContainer.push("</ul></div>");
    form.find('#errorExplanation').replaceWith(errorContainer.join(""));

    showAndGoToErrors(form);
  }

  function showAndGoToErrors(form) {
    form.find('.payment-error-explanation').removeClass('hidden');

    $('html, body').animate({
      scrollTop: $('.payment-error-explanation').offset().top - 73
    }, 500);

    form.find('button').prop('disabled', false);
  }

  function openDeleteConfirmModal($btn){

    if($('#delete-confirm-modal').length == 0){
      // Add a semantic modal to the body of the page.
      $('body').append([
        '<div id="delete-confirm-modal" class="ui basic modal">',
          '<i class="close icon"></i>',
          '<div class="header">',
            'Confirm Deletion',
          '</div>',
          '<div class="content">',
            '<div class="description">',
              '<p></p>',
            '</div>',
          '</div>',
          '<div class="actions">',
            '<div class="two fluid ui inverted buttons">',
            '<div class="ui red basic inverted button">',
              'No',
            '</div>',
            '<div class="ui green basic inverted button confirm-model-delete" data-url="',
        $btn.attr('data-url'),'" data-redirect-url="',$btn.attr('data-redirect-url'),'">',
        'Yes',
        '</div></div></div></div>'].join(""));
    }

    var deletionModal = $('#delete-confirm-modal');

    deletionModal.find('.content .description p').text($btn.attr('data-text'));
    confirmDeleteListener();
    // Check if there are sidebars. If there are, close them.
    var $sidebars = $('.ui.sidebar');
    if($sidebars.length > 0){
      $sidebars.sidebar('hide');
    }
    deletionModal.modal('show');
  }

  function liveValidateRequiredFields(fields){
    var waitTimeMS = 500;
    var field;
    // TODO: Once usages of this method have been removed. Delete this method.
  }

  // Return API for other modules
  return {
    'replaceContent': replaceContent,
    insertStripeErrors: insertStripeErrors,
    insertErrors: insertErrors,
    resetState: resetState,
    showAndGoToErrors: showAndGoToErrors,
    liveValidateRequiredFields: liveValidateRequiredFields,
    initFormSubmitWithin: initFormSubmitWithin,
    initVerify: initVerify
  };
})(jQuery);
