/**
 * Created by jkrump on 18/12/14.
 */

var GlassImages = (function ($) {
    $(document).on('content-ready', function (e, element) {
        $('#image-upload').click(function (e) {
            e.preventDefault();
            $('#refinery-image-input').trigger('click');
            console.log($('#refinery-image-input'));
            console.log('clicked!');
        });
        
    });

    // Return API for other modules
    return {
    };
})(jQuery);

