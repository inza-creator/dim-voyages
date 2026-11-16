#!/bin/bash
cd /opt/dimvoyages
setsid -f stdbuf -oL -eL bash /opt/dimvoyages/deploiement/deployer.sh \
  >/opt/dimvoyages/deploiement/deploy.log 2>&1
echo started
