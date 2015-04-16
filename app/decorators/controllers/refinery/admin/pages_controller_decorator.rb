Refinery::Admin::PagesController.class_eval do
  # before_filter :check_permission, :except => ['index', 'new']

  protected
    def render_partial_response?
      false
    end

    # Used to check page permission for basic users.
    # def check_permission
    #   allowed = true
    #
    #   unless current_refinery_user.super_user?
    #
    #     if Refinery::Pages.limit_basic_users
    #       # If the slug of the page trying to be accessed or it's parent's slug are not in
    #       # the whitelist then disallow
    #
    #       if params.has_key?(:page) && params[:page][:parent_id].present?
    #         allowed = check_edit_permissions
    #       elsif params.has_key?(:page)
    #         if @page.present? && !Refinery::Pages.basic_user_view_template_whitelist.include?(@page.slug)
    #           allowed = false
    #         elsif !Refinery::Pages.basic_user_view_template_whitelist.include?(params[:page][:custom_slug])
    #           allowed = false
    #         end
    #       else
    #         page = ::Refinery::Page.find_by_path_or_id(params[:path], params[:id])
    #
    #         unless (page.parent.present? && Refinery::Pages.basic_user_view_template_whitelist.include?(page.parent.slug)) || Refinery::Pages.basic_user_view_template_whitelist.include?(page.slug)
    #           allowed = false
    #         end
    #       end
    #     end
    #   end
    #
    #   return redirect_to action: :index unless allowed
    # end

  private
    # def check_edit_permissions
    #   parent_page = Refinery::Page.find(params[:page][:parent_id])
    #
    #   return parent_page.present? && Refinery::Pages.basic_user_view_template_whitelist.include?(parent_page.slug)
    # end
end
