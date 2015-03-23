/**
 * Created by jkrump on 16/03/15.
 */

var GlassDateTime = (function ($) {
  $(document).on('content-ready', function (e, element) {
    $('.datetimepicker.default').datetimepicker({
      useCurrent: true,
      defaultDate: new Date()
    });
    $('.datetimepicker.side-by-side').datetimepicker({
      sideBySide: true,
      useCurrent: true,
      defaultDate: new Date()
    });
  });

  return {}

})(jQuery);