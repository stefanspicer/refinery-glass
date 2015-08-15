require 'active_support/concern'

module Canvas::DateToFormat
  extend ActiveSupport::Concern

  include Canvas::DateHelper
  
  included do
    before_validation :format_datetimes
  end
  
  def format_datetimes
    if defined?(self.class.datetime_attrs)
      format_datetime_attributes(self)
    end
  end

end

# include the extension in ActiveRecord
ActiveRecord::Base.send(:include, Canvas::DateToFormat)