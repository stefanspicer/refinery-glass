require 'devise'

class Refinery::ConfirmationsController < Devise::ConfirmationsController

  protected
  # The path used after confirmation.
  def after_confirmation_path_for(resource_name, resource)
    cookies[:pass_errors] = nil if cookies[:pass_errors].present?
    admin_update_password_path
  end
end