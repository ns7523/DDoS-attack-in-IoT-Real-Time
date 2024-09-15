#!/bin/sh

usage ()
{
  echo "Usage   : $0 <github-user> <github-project>"
  echo "Example : $0 sflow-rt flow-trend"
  echo "Catalog : https://sflow-rt.com/download.php#applications"
  exit
}

if [ "$#" -ne 2 ]; then
  usage
fi
cd `dirname $0`
java -cp lib/sflowrt.jar com.sflow.rt.GetApp github $1 $2
if [ "$?" -eq 0 ]; then
  echo ""
  echo "==================================="
  echo "Restart sflow-rt to run application"
  echo "==================================="
fi
cd - > /dev/null
