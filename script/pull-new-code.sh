#!/bin/bash
env -i git pull --rebase
env -i ../modperlctl graceful
