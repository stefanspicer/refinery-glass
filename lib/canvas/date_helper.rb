module Canvas
  module DateHelper

    def format_datetime_attributes(resource)
      resource_class = resource.class.name.to_s.constantize
      
      resource_class.datetime_attrs.each do |dt|
        attribute = resource[dt.to_sym]
        # LINES FOR HELPING WITH DEBUGGING
        # puts '---------------------------------------'
        # puts resource.attributes
        # puts '---------------------------------------'
        # puts "#{dt}: #{attribute}"
        # puts resource_class.datetime_attrs

        if attribute.present? && attribute.is_a?(Hash)
          date = attribute[:date]
          time = attribute[:time]
          # puts '&&&&&&&&&&&&&&&&&&&&&'
          # puts date
          # puts time
          # puts '&&&&&&&&&&&&&&&&&&&&&'
          if date.present? && time.present?
            datetime = DateTime.strptime("#{date} #{time}", '%m/%d/%Y %H:%M %P')
          elsif date.present?
            datetime =  DateTime.strptime(date, '%m/%d/%Y')
          elsif time.present?
            datetime =  DateTime.strptime(time, '%H:%M %P')
          end

          # Convert to utc if this is for a datetime attribute.
          # datetime = datetime if datetime.present? && (resource_class.columns.find {|column| (column.name == dt) && (column.sql_type == 'datetime')}).present?

          # Assign the formatted date, time or datetime to the param
          resource[dt.to_sym] = datetime
        end
      end
    end
  end
end