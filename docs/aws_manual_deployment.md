# NotesAI - Manual AWS Deployment Guide

If you prefer to deploy everything manually without using GitHub Actions, follow these steps. This guide assumes you have already created your EC2 instance, S3 bucket, and ECR repositories.

## Step 1: Install AWS CLI locally
You must have the AWS Command Line Interface installed on your computer.
1. Download and install the AWS CLI for Windows/Mac/Linux.
2. Open your terminal and run `aws configure`.
3. Enter your `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and set your region to `ap-south-1`.

## Step 2: Build and Push Images to ECR
You need to manually push your code to your ECR repositories.

1. **Authenticate Docker with ECR**:
   ```bash
   aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 036230293894.dkr.ecr.ap-south-1.amazonaws.com
   ```

2. **Build and Push the Backend**:
   ```bash
   docker build -t notesai-backend ./backend
   docker tag notesai-backend:latest 036230293894.dkr.ecr.ap-south-1.amazonaws.com/notesai-backend:latest
   docker push 036230293894.dkr.ecr.ap-south-1.amazonaws.com/notesai-backend:latest
   ```

3. **Build and Push the OCR Service**:
   ```bash
   docker build -t notesai-ocr ./ocr_service
   docker tag notesai-ocr:latest 036230293894.dkr.ecr.ap-south-1.amazonaws.com/notesai-ocr:latest
   docker push 036230293894.dkr.ecr.ap-south-1.amazonaws.com/notesai-ocr:latest
   ```

4. **Build and Push the AI Formatter**:
   ```bash
   docker build -t notesai-ai ./ai_formatter
   docker tag notesai-ai:latest 036230293894.dkr.ecr.ap-south-1.amazonaws.com/notesai-ai:latest
   docker push 036230293894.dkr.ecr.ap-south-1.amazonaws.com/notesai-ai:latest
   ```

5. **Build and Push the PDF Formatter**:
   ```bash
   docker build -t notesai-pdf ./pdf_formatter
   docker tag notesai-pdf:latest 036230293894.dkr.ecr.ap-south-1.amazonaws.com/notesai-pdf:latest
   docker push 036230293894.dkr.ecr.ap-south-1.amazonaws.com/notesai-pdf:latest
   ```

6. **Build and Push the Frontend**:
   ```bash
   docker build -t notesai-frontend ./frontend
   docker tag notesai-frontend:latest 036230293894.dkr.ecr.ap-south-1.amazonaws.com/notesai-frontend:latest
   docker push 036230293894.dkr.ecr.ap-south-1.amazonaws.com/notesai-frontend:latest
   ```

## Step 3: Register the ECS Task Definition
Now that AWS has your images, you need to tell ECS how to run them.

1. Go to the AWS Console and search for **ECS**.
2. On the left sidebar, click **Task definitions**.
3. Click **Create new task definition** -> **Create new task definition with JSON**.
4. Open the `infrastructure/ecs-task-def.json` file on your computer, copy all of the text, and paste it into the AWS JSON editor.
5. Click **Create**.

## Step 4: Run the Service
Finally, start the containers on your EC2 instance.

1. On the left sidebar in ECS, click **Clusters**.
2. Click on your `notesai-cluster`.
3. In the "Services" tab (at the bottom), click **Create**.
4. **Compute options**: Select "Launch type", and choose **EC2**.
5. **Deployment configuration**:
   - Application type: **Service**
   - Family: Select `notesai-task` (the task definition you just created).
   - Service name: `notesai-service`.
   - Desired tasks: `1`.
6. Scroll to the bottom and click **Create**.

AWS will now pull your images from ECR and start running all 5 microservices simultaneously on your EC2 server!
