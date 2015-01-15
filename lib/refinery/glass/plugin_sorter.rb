Refinery::Plugin.class_eval do
  def position
    if self.name == 'authors'
      return 0
    end
    if @position
      return @position
    end

    case self.name
    when "refinery_dashboard"
      return 5
    when "refinery_pages"
      return 10
    when "refinerycms_blog"
      return 15
    when "refinerycms_inquiries"
      return 85
    when "refinery_users"
      #return 90
      return 0
    when "refinery_settings"
      return 0 #hide
    when "refinery_images"
      return 0 #hide
    when "refinery_files"
      return 0 #hide
    else
      return 50
    end
  end

  def position=(val)
    @position = val
  end
end
