Refinery::Plugin.class_eval do
  def position
    positions_override = Refinery::Core.config.backend_menu_positions
    if positions_override.present? && positions_override.has_key?(self.name)
      return positions_override[self.name]
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
      return 90
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
