#!/bin/bash
# Lance le déploiement détaché : le SSH Windows coupe les builds longs.
cd /opt/dimvoyages
: > /opt/dimvoyages/deploiement/deploy.log
setsid -f stdbuf -oL -eL bash -c '
  bash /opt/dimvoyages/deploiement/deployer.sh
  echo "DIM_DEPLOY_EXIT:$?"
' >/opt/dimvoyages/deploiement/deploy.log 2>&1
echo started
