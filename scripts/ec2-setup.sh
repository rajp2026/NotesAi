#!/bin/bash
set -e

echo "Starting EC2 Setup for NotesAI ECS Cluster on Ubuntu..."

# Update system
sudo apt-get update -y

# Install Docker
echo "Installing Docker..."
sudo apt-get install -y ca-certificates curl gnupg lsb-release

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor --yes -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ubuntu

# Install ECS Agent for Ubuntu
echo "Installing ECS Agent..."
curl -O https://s3.ap-south-1.amazonaws.com/amazon-ecs-agent-ap-south-1/amazon-ecs-init-latest.amd64.deb
sudo dpkg -i amazon-ecs-init-latest.amd64.deb
rm amazon-ecs-init-latest.amd64.deb

# Configure ECS Agent to join cluster
sudo mkdir -p /etc/ecs
echo "ECS_CLUSTER=notesai-cluster" | sudo tee /etc/ecs/ecs.config

# Setup EBS Volume formatting and mounting
# On newer EC2 instances, the volume might be an NVMe drive (/dev/nvme1n1) or standard (/dev/xvdf)
EBS_DEVICE="/dev/nvme1n1"
if [ ! -b "$EBS_DEVICE" ]; then
    EBS_DEVICE="/dev/xvdf"
fi

MOUNT_POINT="/mnt/ebs_data"

if lsblk $EBS_DEVICE > /dev/null 2>&1; then
    # Check if volume is empty (needs formatting)
    FS_TYPE=$(sudo file -s $EBS_DEVICE | awk '{print $2}')
    if [ "$FS_TYPE" = "data" ]; then
        echo "Formatting EBS volume with ext4..."
        sudo mkfs -t ext4 $EBS_DEVICE
    fi
    
    # Mount volume
    sudo mkdir -p $MOUNT_POINT
    sudo mount $EBS_DEVICE $MOUNT_POINT
    
    # Ensure it mounts on reboot
    echo "$EBS_DEVICE $MOUNT_POINT ext4 defaults,nofail 0 2" | sudo tee -a /etc/fstab

    # Create storage dir for ECS volume mapping
    sudo mkdir -p $MOUNT_POINT/storage
    sudo chown -R ubuntu:ubuntu $MOUNT_POINT/storage
    sudo chmod -R 777 $MOUNT_POINT/storage
else
    echo "Warning: EBS Device $EBS_DEVICE not found. Please verify block device name using 'lsblk'."
fi

# Enable and start ECS
sudo systemctl enable ecs
sudo systemctl start ecs

echo "EC2 Setup Complete! Please reboot the instance."
