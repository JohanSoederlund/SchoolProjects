#!/bin/sh

node_modules_server="./CLIENT/node_modules"
node_modules_client"./SERVER/node_modules"

if [ -e "$node_modules_server"]; then
    //run npm install
if [ -e "$node_modules_client"]; then
    //run npm install

# MONGOD
mongod=/usr/local/mongodb/bin/mongod
mongod_data=../MongoDB/data
#mongod_log=/Users/work/mongodb_log/mongodb.log
prog=mongod.sh
RETVAL=0

stop() {
    grep_mongo=`ps aux | grep -v grep | grep "${mongod}"`
    if [ ${#grep_mongo} -gt 0 ]
    then
	echo "Stop MongoDB."
	PID=`ps x | grep -v grep | grep "${mongod}" | awk '{ print $1 }'`
	`kill -2 ${PID}`
	RETVAL=$?
    else
	echo "MongoDB is not running."
    fi
}
start() {
    grep_mongo=`ps aux | grep -v grep | grep "${mongod}"`
    if [ -n "${grep_mongo}" ]
    then
	echo "MongoDB is already running."
    else
	echo "Start MongoDB."
	`${mongod} --dbpath ${mongod_data} --logpath ${mongod_log} --fork --logappend`
	RETVAL=$?
    fi
}

case "$1" in
    start)
	start
	;;
    stop)
	stop
	;;
    restart)
	stop
	start
	;;
    *)
	echo $"Usage: $prog {start|stop|restart}"
	exit 1
esac

exit $RETVAL


# NGINX
