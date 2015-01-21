/**
 * Created by jkrump on 14/01/15.
 */
var GlassContentEditing = (function ($) {

  $(document).on('content-ready', function (e, element) {
    $(element).find('#page-preview').find('a').click(function(e){
      e.preventDefault();
      console.log('You tried to click a link on a preview page but are being prevented from visiting it so that you ' +
        'don\'t accidently travel away from the page you are editing. \nIf you would like to allow links to be clicked just comment out the code in ' +
        '"refinery-glass" branch, file: "content-editing.js". \nIf you wish for this console log to no longer display' +
        'comment it out there as well.');

    });
  });


  // #############################################################
  // # Save & Retrieve                                           #
  // #############################################################

  $(document).on('content-ready', function (e, element) {
    var $glass_editables = $(element).find('.glass-edit');
    var $form = null;

    $glass_editables.each(function () {
      var options = get_glass_options($(this));

      if (options['type'] == 'text') {
        $(this).attr('contenteditable', true);
      }
      else if (options['type'] == 'html') {
        // each child glass-module is editable
      }

      // Sync up all places where this attribute is used (if more than 1)
      $(this).keyup(handle_change);

      if (!$form && get_form_element($(this))) {
        $form = get_form_element($(this)).parents('form');
      }
    });

    if ($form) {
      $form.submit(function (e) {
        $('.glass-edit').each(function () {
          var $form_elem = get_form_element($(this));
          if ($form_elem) {
            $form_elem.val(formatHtml($(this)));
          }
        });
      });
    }
  });

  var handle_change = function(e) {
    // Sync up all places where this attribute is used (if more than 1)
  }

  var get_form_element = function($element) {
    var options = get_glass_options($element);
    return ('form_id' in options) ? $('#' + options['form_id']) : null;
  }

  // Return the glass editing options (default is 'text', like a fancy <input type="text">)
  var get_glass_options = function($element) {
    var opt_str = $element.attr('data-glass-options');
    return $.extend({'type': 'text'}, opt_str ? JSON.parse(opt_str) : {});
  }


  // #############################################################
  // # Edit and Add HTML content                                 #
  // #############################################################
  $(document).on('content-ready', function (e, element) {
    function insert_new_module_after($hook) {
      var $new_module = $('#glass-parking .glass-module.blank').clone();
      $new_module.removeClass('blank');
      $new_module.prepend($('#glass-change-module').show());
      $hook.after($new_module);
      $hook.after("\n  ");
      $(document).trigger('content-ready', $new_module[0]);
      return $new_module;
    }

    var handle_keypress = function(e) {
      // What non 'p' do we need to worry about?
      // $(this).find('p').is(":focus") &&
      if (e.which == 13) {
        e.preventDefault();
        var $new_module = insert_new_module_after($(this));
        $new_module.find('p').first().focus();
      }

      // if ($(this).glass().isEmpty() && backspace) remove module
    }

    $(element).find('.glass-module').keypress(handle_keypress);
    if ($(element).hasClass('glass-module')) {
      $(element).keypress(handle_keypress);
    }

    $(element).find('#glass-blank-module-hook').each(function () {
      var $new_module = insert_new_module_after($(this));
      $(this).remove();
    });


    $(element).find('[contenteditable=true]').each(function () {
      $(this).focusout(function () {
        if (!$(this).text().trim()) {
          $(this).html(''); // For FF, it puts a <br type='-moz'> in there
        }
      });
    });
    $(element).find('#glass-change-module').click(function (e) {
      e.preventDefault();
      replaceModuleContent($(this), '#glass-choose-module');
    });
    $(element).find('#glass-choose-module-vid').click(function (e) {
      e.preventDefault();
      replaceModuleContent($(this), '#glass-choose-vid');
    });
    $(element).find('.glass-module-close, #glass-choose-module-p').click(function (e) {
      e.preventDefault();
      var $module = $(this).parents('.glass-module');
      $module.find('.glass-control').appendTo('#glass-parking');
      $module.children().each(function () {
        $(this).fadeIn();
      });
    });
  });

  function replaceModuleContent($me, selector) {
    var $module = $me.parents('.glass-module');
    var $replacement = $(selector);
    $module.children().each(function () {
      $(this).hide();
    });
    $module.append($replacement);
    $replacement.fadeIn();
  }

  function formatHtml($elem) {
    $elem.find('[contenteditable=true]').each(function () {
      $(this).attr('contenteditable', false);
    });
    $elem.find('.glass-control').appendTo('#glass-parking');
    return $elem.html().trim();
  }

  // Return API for other modules
  return {};
})(jQuery);
