Refinery::Admin::PagesController.class_eval do
  protected
    def render_partial_response?
      false
    end
end
