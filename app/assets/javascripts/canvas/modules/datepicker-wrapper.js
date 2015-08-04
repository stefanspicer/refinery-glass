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
    $('.datepicker-opener').each(function () {
      initDatePicker($(this));
    });
  });

  /**
   * Create a single datepicker to be used in a modal
   * @return {undefined}
   */
  var initDatePicker = function($btn){
    var $container = $($btn.data('container-selector'));
    var $dpElement = $container.find('.inline-dp-root');
    var format = 'MM/DD/YYYY';
    var disabledDays = $btn.data('disable-weekdays') || [];

    if($dpElement.length === 0){
      console.log("Datepicker error - root node not found");
      return null;
    }

    $dpElement.datetimepicker({
      format: format,
      inline: true,
      daysOfWeekDisabled: disabledDays
    });

    var $dp = $dpElement.data('DateTimePicker');

    setDateTimePickerDateTime($dp, false, moment($($btn.data('date-input')).val(), "YYYY-MM-DD"));

    /**
     * Handles the datepicker's value changing.
     * @param  {Event} e - the dp.change event. Contains date and oldDate
     * @return {undefined}
     */
    var changeInputOnDatepickerChange = function(e) {
      var format      = e.data.format;
      var $wrapper    = $($btn.data('container-selector')).find('.datepicker-wrapper');
      var $inputField = $wrapper.find('input.' + (format === 'LT' ? 'time' : 'date') + '-only');

      $inputField.val(e.date.format(format));
      handleDateChange($btn, $dp, $wrapper.hasClass('active'));
    };

    $dpElement.on('dp.change', {dpElement: $dpElement, format: 'MM/DD/YYYY'}, changeInputOnDatepickerChange);
    $dpElement.on('dp.change', {dpElement: $dpElement, format: 'LT'},         changeInputOnDatepickerChange);

    var toggleVisibility = function(e) {
      e.preventDefault();
      var $wrapper = $($btn.data('container-selector')).find('.datepicker-wrapper');
      handleDateChange($btn, $dp, $wrapper.hasClass('active'));
      $wrapper.toggleClass('active');
    };

    $container.find('.close-dp').click(toggleVisibility);
    $btn.click(toggleVisibility);

    // NOTE: TEMPORARILY REMOVED. THIS WOULD SWITCH BETWEEN THE DATEPICKER AND THE TIME
    //       PICKER DEPENDING ON WHAT INPUT IS IN FOCUS - JK
    // $('.datepicker-fields input[type=text]').focus(function(e){
    //   e.preventDefault();

    //   if($dp.format() === 'MM/DD/YYYY' && $(this).hasClass('time-only')){
    //     $dp.hide().format('LT').show();
    //   } else if($dp.format() === 'LT' && $(this).hasClass('date-only')) {
    //     $dp.hide().format('MM/DD/YYYY').show();
    //   }
    // });

    $container.find('input[type=text]').change(function(e){
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
        $inputField.val(newMomentObject.format(originalFormat));
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

  function handleDateChange($btn, $dp, closing) {
    var callback = $btn.data('on-date-change');
    if (callback && closing) {
      callback($dp.date());
    }

    $($btn.data('date-input')).val($dp.date().format('MM/DD/YYYY'));
  }

  // Return API for other modules
  return {};
})(jQuery);
