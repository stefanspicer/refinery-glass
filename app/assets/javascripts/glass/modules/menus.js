/**
 * Created by StefanS on 2014-Dec-10
 */

var GlassMenus = (function ($) {
  $(document).on('content-ready', function (e, element) {
    $('.sidebar-left-opener').click(function (e) { e.preventDefault(); });
    $('#sidebar-left').first().sidebar('attach events', '.sidebar-left-opener', 'overlay', 'show');
  });

  // Return API for other modules
  return {
  };
})(jQuery);

var GlassMenus = (function ($) {
  $(document).on('content-ready', function (e, element) {
    $('.sidebar-right-opener').click(function (e) { e.preventDefault(); });
    $('#sidebar-left').first().sidebar('attach events', '.sidebar-left-opener', 'overlay', 'show');
    $('#sidebar-right').first().sidebar('attach events', '.sidebar-right-opener', 'overlay', 'show');
  });

  // Return API for other modules
  return {
  };
})(jQuery);