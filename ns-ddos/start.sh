#!/bin/sh

HOME=`dirname $0`
cd $HOME

RTMEM="${RTMEM:-200M}"
RTGC="${RTGC:--XX:+UseG1GC -XX:+UseStringDeduplication -XX:MaxGCPauseMillis=100}"
RTJVM="-Xms${RTMEM} -Xmx${RTMEM} ${RTGC}"

JAR="./lib/sflowrt.jar"

exec java ${RTJVM} ${RTAPP} ${RTPROP} $@ -jar ${JAR}

