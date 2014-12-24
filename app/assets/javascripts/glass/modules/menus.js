/**
 * Created by StefanS on 2014-Dec-10
 */

var GlassMenus = (function ($) {
  $(document).on('content-ready', function (e, element) {
    $(element).find('.sidebar-left-opener').click(function (e) { e.preventDefault(); });
    $(element).find('#sidebar-left').first().sidebar('attach events', '.sidebar-left-opener', 'overlay', 'show');
  });

  // Return API for other modules
  return {
  };
})(jQuery);

