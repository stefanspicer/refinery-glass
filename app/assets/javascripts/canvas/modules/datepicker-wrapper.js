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
    // Add PST timezone
    // moment.tz.add('PST|PST PDT|80 70|0101|1Lzm0 1zb0 Op0');

    $(element).find('.datepicker_time_field .time-only').change(function(e){
      e.preventDefault();
      inputFieldChanged(this);
    });

    $(element).find('.datepicker-opener').each(function () {
      initDatePicker($(this));
    });
  });

  /**
   * Create a single datepicker to be used in a modal
   * @return {undefined}
   */
  var initDatePicker = function($btn){
    var $wrapper = $btn.parent().find('.datepicker-wrapper');
    var $dpElement = $wrapper.find('.inline-dp-root');
    var disabledDays = $btn.data('disabled-weekdays') || [];
    var btnFormat = $btn.data('btn-format') || 'MMM. D, YYYY';
    var $ioElem = $($btn.data('io-selector'));
    var callback = $btn.data('on-date-change');

    var icons = {
      time: 'icon icon-clock',
      date: 'icon icon-calendar',
      up: 'icon icon-angle-up',
      down: 'icon icon-angle-down',
      previous: 'icon icon-angle-left',
      next: 'icon icon-angle-right',
      today: 'icon icon-crosshair',
      clear: 'icon icon-trash',
      close: 'icon icon-cancel'
    };
    var dpOptions = {
      format: 'MM/DD/YYYY',
      inline: true,
      sideBySide: true, // set to false if you want to time picker to be accessible in toolbar.
      daysOfWeekDisabled: disabledDays,
      icons: icons
    };

    var $dp;

    if($dpElement.length === 0){
      console.warn("Datepicker error - root node not found");
      return null;
    }

    $dpElement.datetimepicker(dpOptions);

    $dp = $dpElement.data('DateTimePicker');

    if($ioElem.val()) {
      $dp.date(moment.utc($ioElem.val()));
    }

    /**
     * Handles the datepicker's value changing.
     * @param  {Event} e - the dp.change event. Contains date and oldDate
     * @return {undefined}
     */
    var dpDateChanged = function(e) {
      var format      = e.data.format;
      var $inputField = $wrapper.find('input.' + (format === 'LT' ? 'time' : 'date') + '-only');

      $inputField.val(e.date.format(format));
    };

    $dpElement.on('dp.change', {format: 'MM/DD/YYYY'}, dpDateChanged);
    $dpElement.on('dp.change', {format: 'LT'},         dpDateChanged);

    /**
     * Toggles the visiblity of the dp
     * @param  {Event} e - The click event on the button that toggled the visiblity
     * @return undefined
     */
    var toggleVisibility = function(e) {
      e.preventDefault();

      $btn.addClass('toggled');
      $wrapper.toggleClass('active');

      if (!$wrapper.hasClass('active')) {
        saveDate();
      }
    };

    /**
     * Save the chosen datetime - the datepicker is closing
     * @return undefined
     */
    var saveDate = function (e) {
      var icons = $btn.find('i');
      if($dp !== undefined){
        if (callback && closing) {
          callback($dp.date());
        }

        $btn.html(' ' + $dp.date().format(btnFormat)).prepend(icons[1]).prepend(icons[0]);
        $ioElem.val($dp.date().format('YYYY-MM-DD'));
      }
    };

    // When either the close button or the button that opens the datepicker are clicked,
    // Toggle the visiblity of the corresponding datetimepicker.
    //
    $wrapper.find('.close-dp').click(toggleVisibility);
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

    $wrapper.find('input[type=text]').change(function(e){
      e.preventDefault();
      inputFieldChanged(this, $dp);
    });
  };

  /**
   * [inputFieldChanged description]
   * @param  {[type]} inputField [description]
   * @param  {object} (optional) $dp - a DateTimePicker
   * @return {[type]}            [description]
   */
  var inputFieldChanged = function(inputField, $dp){

    var $inputField = $(inputField);
    var inputfieldFormat = $inputField.hasClass('time-only') ? 'LT' : 'MM/DD/YYYY';

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
      if($dp !== undefined) {
        setDateTimePickerDateTime($dp, isTime, newMomentObject);
      }
      // If there were any error classes added to this input field's parent  then remove them.
      $inputField.parent().removeClass('has-error');
      // Set the input field's value to the formatted value.
      $inputField.val(newMomentObject.format(originalFormat));
    } else {

      setDefaultDateOrTime($inputField, $dp);
      // If validation failed then add the 'has-error' class to the input field's parent
      // Note: 'has-error' is a bootstrap class.
      $inputField.parent().addClass('has-error');
    }
  };

  /**
   * Method for resetting a specific part of the datepicker to it's default value
   * @param {Object} $inputField - The specific field (date or time) to reset
   * @param {DatePicker} $dp     - The current datetimepicker
   */
  function setDefaultDateOrTime($inputField, $dp){
    var inputfieldFormat = $inputField.hasClass('time-only') ? 'LT' : 'MM/DD/YYYY';
    var isTime = inputfieldFormat === 'LT' ? true : false;
    var newMoment;

    if(isTime){
      newMoment = moment('10:00 AM', 'H:mm A');
      $inputField.val(newMoment.format('H:mm A'));
      setDateTimePickerDateTime($dp, isTime, newMoment);
    } else {
      newMoment = moment();
      $inputField.val(newMoment.format(inputfieldFormat));
      setDateTimePickerDateTime($dp, isTime, newMoment);
    }
  }

  /**
   * Resets the values of the dp's input fields while
   * still preserving the date store for the dp so if
   * opened again, the user can continue where they left off.
   * @param  {Object} $wrapper - The DOM element that contains the datepicker wrapper
   * @return undefined
   */
  function resetDP($btn){
    var $wrapper = $btn.parent().find('.datepicker-wrapper');
    $wrapper.find('input[type=text]').each(function(){
      $(this).val(''); // reset the value in the input fields
    });

    var $ioElem  = $($btn.data('io-selector'));
    $ioElem.val('');
  }

  function setDateTimePickerDateTime($dp, isTime, newMomentObject){
    if($dp !== undefined){
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

  // Return API for other modules
  return {
    reset: resetDP
  };
})(jQuery);

// FIXME: this was in dp change ...I don't think we use it
// $($btn.data('date-input')).val($dp.date().format('MM/DD/YYYY'));

// FIXME: Advisor requests "anytime" needs this
// var originalHTML = $btn.html();
// var $btnClearDP = $btn.siblings('.clear-dp');
// $btnClearDP.click(function(e){
//   e.preventDefault();
//   $btn.removeClass('toggled').html(originalHTML); // return text back to its original
//   $btnClearDP.addClass('toggled');
//   $wrapper.removeClass('active');
//   resetDP($btn);
// });

// if($btnClearDP.length > 0 && $btnClearDP.hasClass('toggled')) {
//   $btnClearDP.removeClass('toggled');
// }
