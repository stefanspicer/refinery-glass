class Devise::GlassMailer < Devise::Mailer
  def reset_password_instructions(record, token, opts={})
    # Set a custom subject for an email that goes out as
    # an invitation email.
    puts "IS CONFIRMED?"
    puts "RECORED: #{record.inspect}"
    puts record.confirmed?.inspect
    unless record.confirmed?
      # Not in use (JK) record.confirm_url = "#{record.confirm_path}?confirm_token=#{token}"
      opts[:subject] = "Welcome to #{Refinery::Core.site_name}"
    end

    super
  end
end
