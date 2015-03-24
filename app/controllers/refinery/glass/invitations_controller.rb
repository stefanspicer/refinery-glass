require 'devise'
require 'yaml'

class Refinery::Glass::InvitationsController < ::ApplicationController
  layout 'refinery/layouts/login'

  def accept_invite
    # try to confirm the user
    if params.has_key?(:cf) || session[:cf].present?
      previous_attempt = params.has_key?(:cf) && session[:cf].present?

      session[:cf] = params[:cf]
      session[:confirmation_token] = Devise.token_generator.digest(self, :confirmation_token, session[:cf])

      if previous_attempt && session[:user_id]
        @user = Refinery::User.find(session[:user_id])
        @user.update_attributes(confirmation_token: session[:confirmation_token], confirmed_at: nil)
        @user.save
      end

      @user = Refinery::User.confirm_by_token(session[:cf])

      # If this token is no good, redirect to the homepage.
      unless @user.id
        return redirect_to '/'
      end

      unless !@user.present? || @user.errors.present?
        if signed_in?
          sign_out(current_refinery_user)
        end

        unless @user.errors.present?
          sign_in(@user)
        end

        session[:user_id] = @user.id
        if cookies[:pass_errors].present?
          set_user_errors
        end
      end
      render 'refinery/admin/users/update_password'
    else
      redirect_to '/'
    end
  end

  private
    def set_user_errors
      error_messages = YAML::load cookies[:pass_errors]
      if error_messages.present?
        error_messages.each_key do |e|
          error_messages[e].each do |msg|
            @user.errors.add(e, msg)
          end
        end
      end
      # clear cookie if it was set
      cookies[:pass_errors] = nil if cookies[:pass_errors].present?
    end
end
