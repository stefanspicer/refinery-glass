Refinery::PagesController.class_eval do

  before_filter :before_show, only: [:show]

  protected

    def before_show
      accessible?
    end

    def accessible?
      page = Refinery::Page.find_by_path(request.path)
      return error_404 unless (page.present? && page.live?)
    end

    def set_og_tags
      @og = {}
      set_og_image
    end

    def set_og_image
      
    end
end