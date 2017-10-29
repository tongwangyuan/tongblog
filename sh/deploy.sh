#!/bin/bash

GIT_PATH='/data/git_rep/'$1
WEB_PATH='/data/www.tongwangyuan.com/'
WEB_USER='root'
WEB_USERGROUP='root'

echo "Start deployment"
cd $GIT_PATH
echo "pulling source code..."
#git reset --hard origin/master
git clean -f
git pull
#git checkout master
\cp -rf * $WEB_PATH
echo "changing permissions..."
chown -R $WEB_USER:$WEB_USERGROUP $WEB_PATH
echo "Finished."