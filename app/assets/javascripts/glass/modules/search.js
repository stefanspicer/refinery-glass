/**
 * Created by StefanS on 2014-Dec-23
 */

var GlassSearch = (function ($){
  var watcher;
  var $error_div = [
    '<div id="errorExplanation" class="errorExplanation text-center">',
      '<p>An error occured. Please try again or send us an email</p>',
    '</div>'
  ].join('');

  $(document).on('content-ready', function (e, element) {
    var $search_form = $(element).find('form.search_form');
    if ($search_form.length > 0) {
      // Create a watcher (watch for onchange & onkeypress events)
      watcher = new WatchForChanges.Watcher({
        'onkeypress' : $search_form.find('input#search'),
        'callback'   : do_search,
        'delay'      : 400,
        'maxdelay'   : 1000,
      });

      $search_form.ajaxForm({
        complete: function(xhr, status) {
          watcher.resume();
          if (status != 'success') {
            console.log('not success');
            $search_form.prepend($error_div);
            return;
          }
          xhr.done(function(data) {
            var $content = $(data).find('.sortable_list');
            if ($(data).hasClass('sortable_list')) {
              $content = $(data);
            }
            if ($content.length > 0) {
              $('#errorExplanation').remove();
              console.log('replace content');
              CanvasForms.replaceContent($('.sortable_list'), $content);
            }
            else {
              console.log('done - error');
              $search_form.prepend($error_div);
            }
          });
        },
      });

      $search_form.attr('autocomplete', 'off');
    }
  });

  function do_search($elem) {
    console.log('search');
    $elem.parents('form').submit();
    watcher.pause();
  }

  // Return API for other modules
  return {
  };
})(jQuery);


