/**
 * Created by jkrump on 02/02/15.
 */
var CanvasSocialSharing = (function($){

  $(document).on('content-ready', function (e, element) {
    setDefaultOpenGraphImage();
  });

  function setDefaultOpenGraphImage(){
    var ogImageMetaTag = $('meta[property="og:image"]');

    // Check to see if there is already an og:image meta tag set.
    if(ogImageMetaTag.length == 0) {
      var cover = $('.cover');
      // Check to see if the page has a cover image.
      if(cover.length > 0){
        cover = cover.first();
        var coverBackground = $(cover).css('background-image');
        // Use regex to get just url path without url() and quotes.
        var bgURL = /^url\((['"]?)(.*)\1\)$/.exec(coverBackground);

        // If there was a background-image url
        if(bgURL){
          // Set the content to be the value of the background image url for the page cover.
          ogImageMetaTag = ['<meta property="og:image" content="',bgURL[2],'" />'].join('');

          $('head').append(ogImageMetaTag);
        }
      }
    }
  }

  return {};
})(jQuery);
