Devise::PasswordsController.class_evalclass do

  def edit
    if current_refinery_user.present?
      sign_out(current_refinery_user)
    end
    self.resource = resource_class.new
    resource.reset_password_token = params[:reset_password_token]
  end

  # PUT /resource/password
  def update
    self.resource = resource_class.reset_password_by_token(resource_params)
    yield resource if block_given?

    if resource.errors.empty?
      resource.unlock_access! if unlockable?(resource)

      # Added in to set an unconfirmed resource to confirmed.
      if resource.confirmed_on.blank?
        self.resource.confirmed_on = Time.new.strftime('%Y-%m-%d %H:%M:%S')
        self.resource.save
      end

      flash_message = resource.active_for_authentication? ? :updated : :updated_not_active
      set_flash_message(:notice, flash_message) if is_flashing_format?
      sign_in(resource_name, resource)
      respond_with resource, location: after_resetting_password_path_for(resource)
    else
      respond_with resource
    end
  end

  protected

    # Check if a reset_password_token is provided in the request
    def assert_reset_token_passed
      # Allow for a confirm_token to act as a reset_password_token
      # Not in use (JK) params[:reset_password_token] = params[:confirm_token] if params.has_key?(:confirmation_token)
      if params[:reset_password_token].blank?
        set_flash_message(:alert, :no_token)
        redirect_to new_session_path(resource_name)
      end
    end
end
