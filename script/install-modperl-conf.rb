require 'yaml'
require 'fileutils'

usage            = "USAGE: #{$0} <modperl.conf> <params.yml>"
modperl_conf     = ARGV[0] or abort usage
modperl_conf_bak = ARGV[0] + '.orig'
params_file      = ARGV[1] or abort usage

if !File.exist?(modperl_conf) or !File.exist?(params_file)
  abort usage
end

if !File.exist?(modperl_conf_bak)
  FileUtils.mv(modperl_conf, modperl_conf_bak)
end

conf = YAML.load(IO.read(params_file))

passenger_conf = "
# The location to the Phusion Passenger root directory. This configuration
# option is essential to Phusion Passenger. The correct value is given by the
# installer, and should usually not be changed manually.
PassengerRoot #{conf['passenger_root']}

# This option allows one to specify how much information Phusion Passenger
# should write to the Apache error log file. A higher log level value means
# that more information will be logged.
#
# Possible values are:
#
#    0: Show only errors and warnings.
#    1: Show the most important debugging information. This might be useful for
#       system administrators who are trying to figure out the cause of a
#       problem.
#    2: Show more debugging information. This is typically only useful for
#       developers.
#    3: Show even more debugging information.
PassengerLogLevel 0

# This option allows one to specify the Ruby interpreter to use.
PassengerDefaultRuby #{conf['passenger_ruby']}

# The maximum number of Ruby on Rails application instances that may be
# simultaneously active. A larger number results in higher memory usage, but
# improved ability to handle concurrent HTTP clients.
PassengerMaxPoolSize 20

# The maximum number of seconds that a Ruby on Rails application instance may
# be idle. That is, if an application instance hasn't done anything after the
# given number of seconds, then it will be shutdown in order to conserve
# memory.
PassengerPoolIdleTime 120

# The maximum number of application instances that may be simultaneously active
# for a single application. This helps to make sure that a single application
# will not occupy all available slots in the application pool.
#
# This value must be less than PassengerMaxPoolSize. A value of 0 means that
# there is no limit placed on the number of instances a single application may
# use, i.e. only the global limit of PassengerMaxPoolSize will be enforced.
PassengerMaxInstancesPerApp 0

# When the PassengerUserSwitching option is enabled a Rails application is started
# as the owner of the file config/environment.rb. So if
# /home/webapps/foo/config/environment.rb is owned by joe, then Passenger will
# launch the corresponding Rails application as joe as well.
PassengerUserSwitching Off

# Under no circumstances will Rails applications be run as root. If
# environment.rb is owned by root or by an unknown user, then the Rails
# application will run as the user specified by PassengerDefaultUser.
PassengerDefaultUser #{conf['passenger_user']}

PassengerMinInstances 1
PassengerPreStart http://localhost:#{conf['ror_port']}/
PassengerAppEnv #{conf['ror_env']}


# vim:syn=apache:sw=4:et
"

comment_the_rest   = false
options_in_docroot = false

modperl_conf_file = File.open("../modperl.conf.orig") or die "Unable to open file..."
outfile           = File.open("../modperl.conf", 'w') or die "Unable to open file..."

modperl_conf_file.each_line {|line|
  if line =~ /^\s*PerlHandler\s+Apache2.*Status/ || comment_the_rest
    outfile.write "#" + line
  elsif line =~ /^\s*LoadModule\s+perl_module/
    outfile.write "#" + line
    outfile.write "LoadModule passenger_module #{conf['passenger_so']}\n"
  elsif line =~ /^\s*<Directory\s+\/var\/home\/[^\/]+\/[^\/]+\/>/
    line = line.sub!(/>\s*$/, "ror/public/>\n")
    outfile.write line
    options_in_docroot = true
  elsif options_in_docroot && line =~ /^\s*Options/
    line = line.sub!(/\s*$/, " -MultiViews\n")
    outfile.write line
    options_in_docroot = false
  elsif line =~ /^\s*DocumentRoot\s+/
    line = line.sub!(/www/, "ror/public")
    outfile.write line
  else
    if line =~ /Load the mod_perl startup file/
      comment_the_rest = true
    end

    outfile.write line
  end
}

outfile.write passenger_conf

