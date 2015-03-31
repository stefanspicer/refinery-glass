class Devise::GlassMailer < Devise::Mailer
  def reset_password_instructions(record, token, opts={})
    # Set a custom subject for an email that goes out as
    # an invitation email.
    unless record.confirmed?
      opts[:subject] = "Welcome to #{Refinery::Core.site_name}"
    end

    super
  end
end
