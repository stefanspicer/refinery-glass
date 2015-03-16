/**
 * Created by jkrump on 16/03/15.
 */

var GlassDateTime = (function ($) {
  $(document).on('content-ready', function (e, element) {
    $('.datetimepicker').datetimepicker();
  });

  return {}

})(jQuery);