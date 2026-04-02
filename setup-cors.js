require('dotenv').config();
const { S3Client, PutBucketCorsCommand } = require('@aws-sdk/client-s3');
const { getS3Client } = require('./src/config/aws');

async function configureCORS() {
    console.log('Setting up CORS for bucket:', process.env.AWS_S3_BUCKET_NAME);
    const s3 = getS3Client();

    const corsParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        CORSConfiguration: {
            CORSRules: [
                {
                    AllowedHeaders: ["*"],
                    AllowedMethods: ["GET", "HEAD", "PUT", "POST", "DELETE"],
                    AllowedOrigins: ["*"], // Allows any website to play the videos, including localhost:5173
                    ExposeHeaders: ["ETag", "x-amz-server-side-encryption", "x-amz-request-id", "x-amz-id-2"],
                    MaxAgeSeconds: 3000
                }
            ]
        }
    };

    try {
        const command = new PutBucketCorsCommand(corsParams);
        await s3.send(command);
        console.log('✅ CORS configuration successfully applied!');
        console.log('Please refresh your web browser (localhost:5173), the video should play now.');
    } catch (err) {
        console.error('❌ Failed to update CORS:', err.name, err.message);
    }
}

configureCORS();
