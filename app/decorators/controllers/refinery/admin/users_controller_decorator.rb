require "yaml"

Refinery::Admin::UsersController.class_eval do

  before_filter :filter_users,             :only => [:index]
  before_filter :check_user,               :only => [:update]
  before_filter :set_tmp_password,         :only => [:create]
  before_filter :set_selections,           :only => [:create]
  # after_filter  :after_create_methods,   only: :create
  # after_filter  :after_update_methods,   only: :update

  def set_tmp_password
    params[:user][:password] = Devise.friendly_token
    params[:user][:password_confirmation] = params[:user][:password]
  end

  def set_selections
    @selected_plugin_names = params[:user][:plugins] || []
    @selected_role_names = params[:user][:roles] || []
  end

  def create
    @user = Refinery::User.new params[:user].except(:roles)

    if @user.save
      flash.now[:notice]  = "Invitation sent to #{@user.email}"
      @user.inviting_user = current_refinery_user.username.split.map(&:capitalize).join(' ')
      @user.send_reset_password_instructions
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

    users = users.where("username LIKE '%#{params[:search]}%'") if params[:search].present?
    @users = users.paginate(:page => params[:page], :per_page => 20)
  end

  # override the default index action
  def index
    respond_to do |format|
      format.html
      format.js
    end
  end

  def update_failed
    @edit_user = true
    user_memento_rollback!
    render :edit
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

