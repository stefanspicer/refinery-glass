Refinery::Plugin::META = {
  "refinery_dashboard"    => {position: 0 , icon: 'gcicon gcicon-dashboard'},
  "refinery_pages"        => {position: 5, icon: 'gcicon gcicon-pages'     },
  "refinerycms_blog"      => {position: 15, icon: 'gcicon gcicon-feather'  },
  "refinerycms_inquiries" => {position: 85, icon: 'gcicon gcicon-wrench'   },
  "refinery_users"        => {position: 90, icon: 'gcicon gcicon-group'    },
  "refinery_settings"     => {position: 0 , icon: 'gcicon gcicon-wrench'   }, #hide
  "refinery_images"       => {position: 0 , icon: 'gcicon gcicon-wrench'   }, #hide
  "refinery_files"        => {position: 0 , icon: 'gcicon gcicon-wrench'   }, #hide
}

Refinery::Plugin::META.default     =  {position: 50, icon: 'gcicon gcicon-wrench'}

Refinery::Plugin.class_eval do
  def position
    positions_override = Refinery::Core.config.backend_menu_positions
    return positions_override[self.name] if (positions_override.present? && positions_override.has_key?(self.name))
    return @position                     if @position
    return Refinery::Plugin::META[self.name][:position]
  end

  def position=(val)
    @position = val
  end

  def icon
    icons_override = Refinery::Core.config.backend_menu_icons
    return icons_override[self.name] if icons_override.present? && icons_override.has_key?(self.name)
    return @icon_str                 if @icon_str
    return Refinery::Plugin::META[self.name][:icon]
  end

  def icon=(val)
    @icon_str = val
  end

  def show_for_superuser_only=(val)
    @show_for_superuser_only = val
  end

  def show_for_superuser_only
    return @show_for_superuser_only
  end
end
