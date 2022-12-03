BUCKET_NAME=$1
ENV=$2
CLOUDFRONT_ID=$3

cd ..

echo $1
echo $2

echo "Installing dependencies..."
# Install dependencies
npm install

echo "Building application..."
# Build
npm run build:$ENV

echo "Deploying to AWS S3..."
# Sync build with S3 bucket
aws s3 sync build s3://$BUCKET_NAME

echo "Invalidating Cloudfront cache"
aws cloudfront create-invalidation --distribution-id=$CLOUDFRONT_ID --paths "/*"

echo "Deployed!"
read