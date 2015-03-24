require "yaml"

Refinery::Admin::UsersController.class_eval do

  before_filter :filter_users,             :only => [:index]
  skip_before_filter :restrict_controller, :only => [:update]
  before_filter :check_user,               :only => [:update]
  before_filter :set_tmp_password,         :only => [:create]
  before_filter :set_selections,           :only => [:create]
  # after_filter  :after_create_methods,   only: :create
  # after_filter  :after_update_methods,   only: :update

  def set_tmp_password
    time = Time.new
    params[:user][:password] = "lockedout_#{time.strftime("%Y-%m-%d")}"
    params[:user][:password_confirmation] = "lockedout_#{time.strftime("%Y-%m-%d")}"
  end

  def set_selections
    @selected_plugin_names = params[:user][:plugins] || []
    @selected_role_names = params[:user][:roles] || []
  end

  def create
    @user = Refinery::User.new params[:user].except(:roles)
    @user.inviting_user = current_refinery_user.username.split.map(&:capitalize).join(' ')

    if @user.save
      flash.now[:notice] = "Invitation sent to #{@user.email}"
      create_successful
    else
      create_failed
    end
  end

  def edit
    @submit_button_text = 'Update'
    @selected_plugin_names = find_user.plugins.map(&:name)
    @edit_user = true
  end

  def update
    puts "Update called"
    puts @user.inspect
    unless session[:cf].present?
      # Store what the user selected.
      @selected_role_names = params[:user].delete(:roles) || []
      @selected_role_names = @user.roles.select(:title).map(&:title) unless user_can_assign_roles?

      # ensure that plugins are not overwritten when none are specified in an update.
      if params[:user].has_key?(:plugins)
        @selected_plugin_names = params[:user][:plugins]
      else
        @selected_plugin_names = @user.plugins.select(:name).map(&:name)
      end

      if user_is_locking_themselves_out?
        flash.now[:error] = t('lockout_prevented', :scope => 'refinery.admin.users.update')
        render :edit and return
      end

      store_user_memento
    end

    if session[:confirmation_token].present?
      # set user as unconfirmed
      @user.update_attributes(confirmation_token: session[:confirmation_token], confirmed_at: nil)
      @user.save
    end

    if @user.update_attributes params[:user]
      # clear cookie if it was set
      cookies[:pass_errors] = nil if cookies[:pass_errors].present?

      if session[:cf].present?
        @user = Refinery::User.confirm_by_token(session[:cf])

        # clear session variables
        session.delete(:cf)
        session.delete(:user_id)
        session.delete(:confirmation_token)

        sign_out(current_refinery_user)
        sign_in(@user)

        return redirect_to refinery.admin_dashboard_path
      else
        update_successful
      end
    else
      if session[:confirmation_token].present?
        cookies[:pass_errors] = YAML::dump @user.errors.messages
        redirect_to "/accept-invitation?cf=#{session[:cf]}"
      else
        update_failed
      end
    end
  end

  def update_password
    cookies[:pass_errors] = nil if cookies[:pass_errors].present?
    render view: 'refinery/admin/users/update_password', layout: 'refinery/layouts/login'
  end

  def get_emails
    begin
      users = Refinery::User.select('email')
      if params[:user_id].present?
        users = users.where("id NOT IN ('#{params[:user_id]}')").select('email')
      end
      render json: {collection: users.map!{|u| u.email.downcase} }, status: 200
    rescue Exception => e
      logger.warn(e)
      render json: {message: e.message}, status: 500
    end
  end

  def get_usernames
    begin
      users = Refinery::User.select('username')
      if params[:username].present?
        users = users.where("username NOT IN ('#{params[:username].strip}')").select('username')
      end
      render json: {collection: users.map!{|u| u.username.downcase} }, status: 200
    rescue Exception => e
      logger.warn(e)
      render json: {message: e.message}, status: 500
    end
  end
protected


  def after_update_methods
	  # send_onboarding_email(:update)
  end

  def after_create_methods
	  # send_onboarding_email(:create)
  end

  # def send_onboarding_email(action)
  # 	# If the user has had the onboarding checkbox checked or if they are the first admin for the org
  # 	# then send them the onboarding email.
  # 	if (params[:onboarding].present? && params[:onboarding]) || (@user.org.admins.count == 1 && action == :create)
  # 		begin
  # 			Refinery::Feast::Mailer.onboarding_email(@user, request).deliver
  # 		rescue => e
  # 			logger.warn "There was an error delivering the onboarding email to #{@user.name}.:\n#{e.message}\n"
  # 		end
  # 	end
  # end

  def find_available_plugins
    @available_plugins = Refinery::Plugins.registered.in_menu.map { |a|
      { :name => a.name, :title => a.title }
    }.uniq.sort_by { |a| a[:title] }
  end

  def filter_users
    if !current_refinery_user.has_role?(:superuser) && @org.present?
      users = ::Refinery::User.where(:org_id => @org.id).order('username ASC')
    else
      users = ::Refinery::User.order('username ASC')
    end
    puts params[:search].inspect
    puts params[:search].present?.inspect
    users = users.where("username LIKE '%#{params[:search]}%'") if params[:search].present?
    @users = users.paginate(:page => params[:page], :per_page => 15)
  end

  # override the default index action
  def index
  end

  def store_user_memento
    # Store the current plugins and roles for this user.
    @previously_selected_plugin_names = @user.plugins.map(&:name)
    @previously_selected_roles = @user.roles
  end

  def user_memento_rollback!
    @user.plugins = @previously_selected_plugin_names
    @user.roles = @previously_selected_roles
    @user.save
  end

  def update_failed
    @edit_user = true
    user_memento_rollback!
    render :edit
  end

  def update_successful
    if current_refinery_user.plugins.map(&:name).include?('refinery_users')
      redirect_to refinery.admin_users_path,
                  :notice => t('updated', :what => @user.username, :scope => 'refinery.crudify')
    else
      redirect_to refinery.admin_dashboard_path,
                  :notice => t('updated', :what => @user.username, :scope => 'refinery.crudify')
    end
  end

  private
    def check_user
      unless current_refinery_user.plugins.map(&:name).include?('refinery_users') ||
          @user.username == current_refinery_user.username ||
          current_refinery_user.super_user?
        logger.warn "Someone without permission tried to modify user #{@user.inspect}"
        flash.now[:error] = 'Sorry, you may not access that'
        return redirect_to refinery.admin_dashboard_path
      end
    end
end

