var CanvasForms = (function ($) {
  $(document).on('content-ready', function (e, element) {
    initFormSelectsWithin(element);
    initFormOptionalFieldsWithin(element);
    initFormSubmitWithin(element);
  });

  function initFormSelectsWithin(element) {
    if ($(element).find('select').length > 0) {
      if ('MozAppearance' in $(element).find('select')[0].style) {
        $('html').addClass('moz-appearance');
      }
    }
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
      $(this).submit(function (e) {
        var $submit_btn = $(this).find('.btn[type="submit"]');
        $submit_btn.html('<div class="ui active inline inverted xs loader"></div> Sending');
        $submit_btn.attr('disabled', 'disabled');
      });
      $(this).ajaxForm({
        complete: function (xhr, status) {
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
            var $content = $(data).find(selector);

            if ($content.length > 0) {
              replaceContent($(selector), $content);
            }
            else {
              if ($(data).attr('id') == 'errorExplanation') {
                $content = $(data);
              }
              else {
                $content = $(data).find('#errorExplanation');
              }

              if ($content.length > 0) {
                $content.insertBefore(selector + ' .form-actions');
              }
              else {
                var $modal = $(selector).parents('.modal');

                if ($modal.length > 0) {
                  var close_button = '<button data-dismiss="modal" class="btn btn-primary btn-lg">Close</button>';
                  var update_selector = $modal.find('.update-on-close');

                  if (update_selector) {
                    ajaxUpdateContent(update_selector);

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

                var $body = $(data).find('#body_content');
                var $thank_you = $body.length > 0 ? $body : $('<p>Thank you</p>');
                $thank_you.find('h1').remove(); // inquiries engine puts an h1 in there
                replaceContent($(selector), $thank_you);
              }
            }
          });
        },
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


  // Return API for other modules
  return {
    'replaceContent': replaceContent,
    insertStripeErrors: insertStripeErrors,
    insertErrors: insertErrors,
    resetState: resetState
  };
})(jQuery);
