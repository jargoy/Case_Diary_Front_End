# Deploying this Angular SSR app to AWS EC2

## 1. Build the Docker image locally

From the repository root:

```bash
docker build -t user-app:latest .
```

## 2. Push the image to a registry

Option A: Docker Hub

```bash
docker tag user-app:latest <your-dockerhub-username>/user-app:latest
docker push <your-dockerhub-username>/user-app:latest
```

Option B: Amazon ECR

Follow AWS docs to create a repository, authenticate, then push.

## 3. Start an EC2 instance

- Use Amazon Linux 2023, Ubuntu 22.04, or another Linux AMI.
- Open the security group for TCP port 80 (and 4000 if you want direct access).

## 4. Install Docker on EC2

For Ubuntu:

```bash
sudo apt update
sudo apt install -y docker.io
sudo usermod -aG docker $USER
newgrp docker
```

For Amazon Linux 2023:

```bash
sudo dnf install -y docker
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
newgrp docker
```

## 5. Pull and run the container on EC2

```bash
docker pull <your-registry>/user-app:latest

docker run -d --name user-app -p 80:4000 -e PORT=4000 <your-registry>/user-app:latest
```

If you want to use port 4000 directly instead of 80:

```bash
docker run -d --name user-app -p 4000:4000 -e PORT=4000 <your-registry>/user-app:latest
```

## 6. Verify

Open your EC2 public IP in the browser:

- `http://<ec2-public-ip>/` if you mapped port 80
- `http://<ec2-public-ip>:4000/` if you used port 4000

## 7. Optional: run updates

When you push a new image, update the EC2 container:

```bash
docker pull <your-registry>/user-app:latest
docker stop user-app
docker rm user-app
docker run -d --name user-app -p 80:4000 -e PORT=4000 <your-registry>/user-app:latest
```
