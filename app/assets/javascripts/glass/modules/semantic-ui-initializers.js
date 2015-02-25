var GlassSemanticUIinitializers = (function ($){

  $(document).on('content-ready', function (e, element) {
    $('.default-popup').popup({
      inline: true,
      hoverable: true
    });
    $('input.popup').popup({
      on: 'focus',
      preserve: true,
      hoverable: true
    });
  });

  // Return API for other modules
  return {
  };
})(jQuery);
