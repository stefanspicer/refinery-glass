#!/bin/bash

env -i git pull --rebase
set PATH=/var/home/dev/.rvm/gems/ruby-2.1.1@rccav/bin:/var/home/dev/.rvm/gems/ruby-2.1.1@global/bin:/var/home/dev/.rvm/rubies/ruby-2.1.1/bin:/var/home/dev/.rvm/bin:/usr/local/bin:/usr/bin:/bin:/opt/bin:/usr/x86_64-pc-linux-gnu/gcc-bin/4.3.4
bundle exec rake db:migrate RAILS_ENV=staging
bundle exec rake db:seed RAILS_ENV=staging
bundle exec rake assets:precompile RAILS_ENV=staging
env -i ../modperlctl graceful
