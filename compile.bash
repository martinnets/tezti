docker build -t nextjs-app .
docker tag nextjs-app:latest 708504465950.dkr.ecr.us-east-1.amazonaws.com/nextjs-app:latest
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 708504465950.dkr.ecr.us-east-1.amazonaws.com/nextjs-app
docker push 708504465950.dkr.ecr.us-east-1.amazonaws.com/nextjs-app:latest
aws ecs update-service --cluster nextjs-app --service nextjs-app --force-new-deployment
