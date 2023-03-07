#!/bin/bash
sleep 30
sudo yum update -y
sudo yum upgrade -y
sudo amazon-linux-extras install nginx1.12 -y


sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs


sudo yum install unzip -y
mkdir ~/webapp

unzip webapp.zip -d ~/webapp
cd ~/webapp && npm i



sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service
sudo systemctl enable webapp.service
sudo systemctl start webapp.service