#!/bin/bash

## Copyright (C) 2009  Przemyslaw Pawelczyk <przemoc@gmail.com>
## License: GNU General Public License v2, v3
#
# Lockable script boilerplate

### HEADER ###

LOCKFILE="/var/home/dev/`basename $0`.lock"
LOCKFD=99

# PRIVATE
_lock()             { flock -$1 $LOCKFD; }
_no_more_locking()  { _lock u; _lock xn && rm -f $LOCKFILE; }
_prepare_locking()  { eval "exec $LOCKFD>\"$LOCKFILE\""; trap _no_more_locking EXIT; }

# ON START
_prepare_locking

# PUBLIC
exlock_now()        { _lock xn; }  # obtain an exclusive lock immediately or fail
exlock()            { _lock x; }   # obtain an exclusive lock
shlock()            { _lock s; }   # obtain a shared lock
unlock()            { _lock u; }   # drop a lock

### BEGIN OF SCRIPT ###

# Simplest example is avoiding running multiple instances of script.
exlock_now || exit 1

# Remember! Lock file is removed when one of the scripts exits and it is
#           the only script holding the lock or lock is not acquired at all.



env -i git pull --rebase
set PATH=/var/home/dev/.rvm/gems/ruby-2.1.1@rccav/bin:/var/home/dev/.rvm/gems/ruby-2.1.1@global/bin:/var/home/dev/.rvm/rubies/ruby-2.1.1/bin:/var/home/dev/.rvm/bin:/usr/local/bin:/usr/bin:/bin:/opt/bin:/usr/x86_64-pc-linux-gnu/gcc-bin/4.3.4
bundle exec rake db:migrate RAILS_ENV=staging
bundle exec rake db:seed RAILS_ENV=staging
bundle exec rake assets:precompile RAILS_ENV=staging
env -i ../modperlctl graceful
