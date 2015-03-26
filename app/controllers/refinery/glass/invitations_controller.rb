require 'devise'
require 'yaml'

class Refinery::Glass::InvitationsController < ::ApplicationController
  layout 'refinery/layouts/login'


  def accept_invite

    unless params.has_key?(:cf)
      return redirect_to '/'
    end
    # If there is currently a user logged in, sign them out.
    if current_refinery_user.present?
      sign_out(current_refinery_user)
    end

    # Save the confirmation token
    @cf = params[:cf]
    digested_cf = Devise.token_generator.digest(self, :confirmation_token, session[:cf])
    # Try to get the user
    @user = Refinery::User.where("confirmed_at IS NULL AND confirmation_token = ? AND confirmation_sent_at > ?", digested_cf, 7.days.ago.strftime('%Y-%m-%d %H:%M:%S')).first
    unless @user.present?
      return redirect_to '/'
    end

    render 'refinery/admin/users/confirm_user_form'
  end

  def update_password_handler

    # Try resetting the password
    @user.password              = params[:password]
    @user.password_confirmation = params[:password_confirmation]

    if @user.save
      #confirm the user.

      # if user is confirmed redirect to /admin
    end
    '/update-password/?cf='
    # find user based on cf (and ensure it is valid) (user unconfirmed, invitation sent within last 7 days - or created_at)
    #   - error check
    # user.update_attributes(password, password_confirmation)
    #   - error check
    # confirm_by_token
    # sign_in(user)
    # redirect_to '/admin'
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
