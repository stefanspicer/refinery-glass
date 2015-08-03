/**
 * A module for handling methods relating to an inline datetimepicker which is inside a wrapper
 * and behaves somewhat like a modal.
 * Note: To see documentation for the datetimepicker used visit: http://eonasdan.github.io/bootstrap-datetimepicker
 *       For documentation of moment.js visit: http://momentjs.com/docs
 * @author Joseph Krump
 * @param  {Jquery} $)
 * @return {Object} - An object containing any of the publicly accessible methods of this module.
 */
var DatePickerWrapper = (function($){

  $(document).on('content-ready', function (e, element) {
    registerDisplayListener();
    initDatePicker();

    // A temporary line so as to not to have to dig into the css and change this - JK
    // $('.datepicker-wrapper').css('position','relative');
  });

  /**
   * Create a single datepicker to be used in a modal
   * @return {undefined}
   */
  var initDatePicker = function(){

    var $dp = makeDatePicker('MM/DD/YYYY');

    if($dp === null) {
      return 1; // return early if there is no datepicker on this page.
    }

    var $dpElement = $dp.element;
    var $closeButtons = $('.close-dp');

    $closeButtons.click(function(e){
      e.preventDefault();
      var $datepickerWrapper = $(this).parents('.datepicker-wrapper');
      $datepickerWrapper.removeClass('active');

    });

    $('.datepicker-fields input[type=text]').focus(function(e){
      e.preventDefault();

      // NOTE: TEMPORARILY REMOVED. THIS WOULD SWITCH BETWEEN THE DATEPICKER AND THE TIME
      //       PICKER DEPENDING ON WHAT INPUT IS IN FOCUS - JK

      // if($dp.format() === 'MM/DD/YYYY' && $(this).hasClass('time-only')){
      //   $dp.hide().format('LT').show();
      // } else if($dp.format() === 'LT' && $(this).hasClass('date-only')) {
      //   $dp.hide().format('MM/DD/YYYY').show();
      // }
    }).change(function(){
      var $inputField = $(this);
      var inputfieldFormat = $(this).hasClass('time-only') ? 'LT' : 'MM/DD/YYYY';

      // get the number of integers in the string.
      var intsCount = $inputField.val().replace(/[^0-9]/g,"").length;
      var originalFormat = inputfieldFormat;
      // The format used for Time as 'HH:MM am/pm' is LT
      var isTime = originalFormat === 'LT' ? true : false;

      inputfieldFormat = setDateFormat(inputfieldFormat, intsCount);

      var newMomentObject = moment($inputField.val(), inputfieldFormat);

      // Based on whether the momentObject is valid or not (using moment.js .isValid()), add, or remove the 'has-error'
      // class and change the value in the input field and for the datetimepicker.
      if(newMomentObject.isValid()){

        setDateTimePickerDateTime($dp, isTime, newMomentObject);
        // If there were any error classes added to this input field's parent  then remove them.
        $inputField.parent().removeClass('has-error');
        // Set the input field's value to the formatted value.
        $inputField.val(currentDate.format(originalFormat));
      } else {
        var newMoment;

        if(isTime){
          newMoment = moment('12:00 PM', 'FT');
          $inputField.val();
          setDateTimePickerDateTime($dp, isTime, newMoment);
        } else {
          newMoment = moment();
          $inputField.val(newMoment.format(originalFormat));
          setDateTimePickerDateTime($dp, isTime, newMoment);
        }
        // If validation failed then add the 'has-error' class to the input field's parent
        // Note: 'has-error' is a bootstrap class.
        $inputField.parent().addClass('has-error');
      }
    });
  };

  function setDateTimePickerDateTime($dp, isTime, newMomentObject){
    var currentDate = $dp.date();

    // Set the appropriate values to update the current moment object that is used to keep track of
    // the datetimepicker widget's datetime.
    if(isTime){
      currentDate.hour(newMomentObject.hour()).minute(newMomentObject.minute());
    } else {
      currentDate.year(newMomentObject.year()).month(newMomentObject.month()).date(newMomentObject.date());
    }

    // Set the datetimepicker to be the moment that was set.
    $dp.date(currentDate);
    return currentDate;
  }

  /**
   * Sets the correct datepicker format to use based on the number of
   * ints in the string that was entered.
   * @param {string} inputfieldFormat - The string that was entered into a date text field.
   * @param {int} intsCount - The number of integers persent in the date string that was entered.
   * @return {string} - a string containing the date format to use.
   */
  function setDateFormat(inputfieldFormat, intsCount){

   if(inputfieldFormat === 'MM/DD/YYYY' && intsCount <= 7){
      inputfieldFormat= 'MM/DD/YY';
    }
    return inputfieldFormat;
  }

  /**
   * Make a datetimepicker widget and set listeners on it.
   * @param  {string} format - the datetime format for picker
   * @return {DateTimePicker} - The DateTimePicker widgeth that was made.
   */
  var makeDatePicker = function(format){
    var $dpElement = $('.inline-dp-root');

    if($dpElement === undefined || $dpElement.length === 0){
      return null;
    }
    $dpElement.datetimepicker({
      format: format,
      inline: true,
      daysOfWeekDisabled: [0] // no appointments on Sunday
    }).on('dp.change', {dpElement: $dpElement, format: 'MM/DD/YYYY'}, changeInputOnDatepickerChange).on('dp.change', {dpElement: $dpElement, format: 'LT'}, changeInputOnDatepickerChange);

    return $dpElement.data("DateTimePicker");
  };

  /**
   * Handles the datepicker's value changing.
   * @param  {Event} e - the dp.change event. Contains date and oldDate
   * @return {undefined}
   */
  var changeInputOnDatepickerChange = function(e) {

    var format = e.data.format;
    var $dpElement = e.data.dpElement
    var $inputField = $dpElement.parents('.datepicker-wrapper').find('input.' + (format === 'LT' ? 'time' : 'date') + '-only');

    $inputField.val(e.date.format(format));
  }

  /**
   * registers the listeners for the buttons that toggle the datepicker displaying
   * @return {undefined} - nothing
   */
  var registerDisplayListener = function(){
    $('.datepicker-buttons .btn-toggle-icons').unbind('click', handleButtonClick).click(handleButtonClick);
  };

  /**
   * Process what happens when one of the date selection buttons is pressed.
   * @param  {Event} e - click event
   * @return {undefined}
   */
  var handleButtonClick = function(e){
    e.preventDefault();

    var $btn = $(this);
    var $pickerButtons = $btn.parents('.datepicker-buttons');
    var $datepickerContainer = $pickerButtons.siblings('.datepicker-container');
    var $siblingDatePickerWrapper = $datepickerContainer.find('.datepicker-wrapper');

    if($btn.hasClass('show-picker')){
      // Toggle visibility of the container. This line can be removed if the wrapper sticks with being
      // position: absolute; - JK
      // if($siblingDatePickerWrapper.hasClass('active')){
      //   $datepickerContainer.fadeOut(200);
      // } else {
      //   $datepickerContainer.show(10);
      // }
      if($btn.hasClass('toggled') && !$siblingDatePickerWrapper.hasClass('active')){
        $btn.siblings('.btn-toggle-icons').removeClass('toggled');
      } else {
        $btn.toggleClass('toggled').siblings('.btn-toggle-icons').toggleClass('toggled');
      }

      $siblingDatePickerWrapper.toggleClass('active');
    } else {
      // $datepickerContainer.fadeOut(200);
      // Clear time
      //
      $siblingDatePickerWrapper.find('input[type=text]').val(null);

      $btn.addClass('toggled').siblings('.btn-toggle-icons').removeClass('toggled');
      $siblingDatePickerWrapper.removeClass('active');
    }
  };

  // Return API for other modules
  return {};
})(jQuery);
