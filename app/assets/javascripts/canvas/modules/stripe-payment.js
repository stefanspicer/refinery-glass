var Payment = (function($){

  var stripeResponseHandler;

  $(document).on('content-ready', function (e, element) {
    var $publishedKeyInput = $(element).find('#published_key');
    var $paymentForm = $(element).find('.payment-form');

    // return early if there has been to published_key set.
    if($publishedKeyInput.length === 0 && $paymentForm.length !== 0){
      var published_key_div = '<input type="hidden" id="published_key" value="<%= Rails.configuration.stripe[:publishable_key] %>"/>';

      console.warn('publishedKeyInput not set');
      console.log('to fix add this line into the view with the form: ' + published_key_div);
      return;
    }

    try {
      Stripe.setPublishableKey($publishedKeyInput.val());
    } catch (e) {
      console.warn(e);
      return;
    }

    // If a donation amount button is pressed, insert that amount into the amount field.
    $(element).find('.price-list .btn').unbind('click').click(function(e){
      e.preventDefault();
      var btn = $(this);
      var amt = btn.data('amount');
      if(btn.hasClass('monthly-amt')){
        $('input[type="radio"]#monthly').prop("checked", true);
      } else{
        $('input[type="radio"]#one-time').prop("checked", true);
      }
      $('#donation_amount').val(amt).focus();
    });

    // Listen for and handle a payment form submission
    $paymentForm.submit(function(e) {
      var $form = $(this);
      var $termsModal = $('#accept-terms-modal');

      // If there is a EULA that must be agreed to before proceeding,
      if($termsModal.length > 0){
        $termsModal.modal('refresh');

        $termsModal.find('.btn-success').click(function(e){
          e.preventDefault();
          processStripeToken($form);
          $termsModal.modal('hide');
        });
        $termsModal.modal({closable: false, onVisible: function(){
          $(this).modal('refresh');
        }, onHidden: function(){
          $(this).remove(); // after the agreement has been accepted, remove the modal
        }}).modal('show');
      } else {
        processStripeToken($form);
      }
      return false;
    });
  });

  // Make request to stripe to get a token.
  function processStripeToken($form){
    // Disable the submit button to prevent repeated clicks
    var $submit_btn = $form.find('button[type=submit]');
    CanvasForms.initAjaxForm($form);

    $submit_btn.html('<i class="ui active inline inverted xs loader"></i> Sending').attr('disabled', true);

    Stripe.card.createToken($form, stripeResponseHandler);

    return false;
  }

  stripeResponseHandler = function(status, response) {

    var $form = $('.payment-form');
    var $submit_btn = $form.find('.btn[type=submit]');
    $form.data('submit-btn', $submit_btn);

    if (response.error) {
      CanvasForms.insertStripeErrors($form, [response.error.message]);

      return false;
    } else {
      $form.find('.payment-error-explanation').addClass('hidden');
      // token contains id, last4, and card type
      var token = response.id;
      // Insert the token into the form so it gets submitted to the server
      $form.append($('<input type="hidden" name="stripeToken" />').val(token));

      $form.ajaxSubmit(CanvasForms.paramsForAjaxSubmit($form, '.payment-form'));
    }
  };

  // Return API for other modules
  return {};
})(jQuery);
