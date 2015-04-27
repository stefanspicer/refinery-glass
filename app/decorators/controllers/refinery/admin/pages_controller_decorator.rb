Refinery::Admin::PagesController.class_eval do
  # before_filter :check_permission, :except => ['index', 'new']

  before_filter :check_valid_template, :only => [:create, :update]

  protected
    def render_partial_response?
      false
    end

    def check_valid_template
      unless current_refinery_user.super_user?

        begin
          valid_view_templates = Refinery::Pages.basic_user_view_template_whitelist
        rescue Exception => e
          logger.warn e
        end
        
        # Unless this is a new page or a page without a view template, proceed as normal.
        unless @page.present? && @page.view_template.present?
          if defined?(valid_view_templates) && valid_view_templates.length == 1
            params[:page][:view_template] = valid_view_templates[0]
            return
          end

          if params[:page].present? && params[:page][:view_template].present?
            if defined?(valid_view_templates) && valid_view_templates.include?(params[:page][:view_template])
              logger.warn("Tried to set a page to a template #{params[:page][:view_template]} that is not allowed for this user: #{current_refinery_user.username}")
              params[:page][:view_template] = valid_view_templates[0]
            end
          end
        end
      end
    end

    def load_valid_templates
      if !current_refinery_user.super_user?
        begin
          @valid_view_templates = Refinery::Pages.basic_user_view_template_whitelist
        rescue Exception => e
          logger.warn e
          @valid_view_templates = Refinery::Pages.valid_templates('app', 'views', '{pages,refinery/pages}', '*html*')
        end
      else
        @valid_view_templates = Refinery::Pages.valid_templates('app', 'views', '{pages,refinery/pages}', '*html*')
      end

      @valid_layout_templates = Refinery::Pages.layout_template_whitelist &
        Refinery::Pages.valid_templates('app', 'views', '{layouts,refinery/layouts}', '*html*')

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
