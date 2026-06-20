# NotesAI - AWS Production Deployment Runbook

Follow these exact steps in the AWS Console to bring your NotesAI microservices architecture to life.

---

## Step 1: Create the Image Repositories (Amazon ECR)

GitHub Actions needs a place to store your Docker images.

1. Go to **Elastic Container Registry (ECR)** in the AWS Console.
2. Click **Create repository**.
3. Create 5 separate repositories with the exact names below (leave all other settings as default):
   - `notesai-frontend`
   - `notesai-backend`
   - `notesai-ocr`
   - `notesai-ai`
   - `notesai-pdf`

---

## Step 2: Create the Storage Bucket (Amazon S3)

Your PDFs and images need a place to live.

1. Go to **S3**.
2. Click **Create bucket**.
3. Name it something globally unique (e.g., `notesai-production-bucket-2026`).
4. Ensure **Block all public access** is checked (your backend will use presigned URLs to grant temporary access, which is the most secure method).
5. Click **Create bucket**.

---

## Step 3: Set up the Server (Amazon EC2 & EBS)

We need a powerful server to run your ECS containers and a persistent hard drive to keep your database safe.

1. Go to **EC2** and click **Launch instance**.
2. **Name**: `NotesAI-Host`
3. **OS**: Select **Ubuntu Server 24.04 LTS** (or 22.04).
4. **Instance Type**: Select `t3.medium` or `t3.large` (OCR and multiple containers require good RAM).
5. **Key Pair**: Create a new key pair (e.g., `notesai-key`) and download the `.pem` file so you can SSH into it.
6. **Network Settings**:
   - Check **Allow SSH traffic from Anywhere**.
   - Check **Allow HTTP traffic from the internet** (Port 80 for your frontend).
   - Check **Allow HTTPS traffic from the internet**.
7. **Storage (EBS)**:
   - Volume 1 (Root): 20 GB (gp3).
   - **Click "Add new volume"**: Size 50 GB (gp3). _This is your persistent external hard disk!_
8. Click **Launch instance**.

---

## Step 4: Configure the Server (SSH & Setup Script)

We need to format that 50GB hard drive and install the ECS agent.

1. Once your EC2 instance is running, copy its **Public IPv4 address**.
2. Open your terminal and SSH into the machine using the key you downloaded:
   ```bash
   ssh -i /path/to/notesai-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
   ```
3. Copy the contents of the `scripts/ec2-setup.sh` file from your project into the terminal and run it.
   _(This script automatically installs Docker, hooks up your 50GB hard drive, and configures it so your database won't lose data if the server reboots)._
4. When the script finishes, **reboot the instance** from the AWS Console.

---

## Step 5: Create the Container Cluster (Amazon ECS)

1. Go to **Elastic Container Service (ECS)**.
2. Click **Create cluster**.
3. **Cluster name**: `notesai-cluster`.
4. Under **Infrastructure**, select **Amazon EC2 instances**.
5. Choose the Auto Scaling group that contains the EC2 instance you just created (if prompted to create one, select your `NotesAI-Host` instance type and Ubuntu).
6. Click **Create**.

---

## Step 6: Create an IAM User for GitHub Actions

GitHub needs permission to deploy to your AWS account.

1. Go to **IAM** -> **Users** -> **Create user**.
2. Name: `github-actions-deployer`.
3. Click Next. Select **Attach policies directly**.
4. Attach these two policies:
   - `AmazonEC2ContainerRegistryPowerUser` (to upload images)
   - `AmazonECS_FullAccess` (to update the cluster)
5. Create the user.
6. Click on the user, go to the **Security credentials** tab, and click **Create access key**.
7. Choose "Command Line Interface (CLI)" and create it. **Save the Access Key ID and Secret Access Key!**

---

## Step 7: Finalize GitHub CI/CD Configuration

1. Open your NotesAI repository on **GitHub**.
2. Go to **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**.
3. Add the following secrets:
   - `AWS_ACCESS_KEY_ID`: (From Step 6)
   - `AWS_SECRET_ACCESS_KEY`: (From Step 6)
   - `AWS_ACCOUNT_ID`: (Your 12-digit AWS account number, found in the top right of the AWS console).
4. Update your frontend environment variables so it points to your EC2 instance:
   - Go to your AWS Console, copy the EC2 Public IPv4 address.
   - Update your repository's `frontend/.env.example` to point to this IP, and ensure it gets copied to `.env` during deployment.
5. **Push to the `main` branch!**

GitHub Actions will now automatically build your 5 microservices, push them to ECR, and command ECS to launch them on your EC2 instance.
