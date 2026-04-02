require('dotenv').config();
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { getS3Client } = require('./src/config/aws');

async function testS3Upload() {
    console.log('=== S3 Upload Test ===');
    console.log('Bucket:', process.env.AWS_S3_BUCKET_NAME);
    console.log('Region in .env:', process.env.AWS_REGION);
    
    // Create S3 client normally
    const s3 = getS3Client();
    const bucket = process.env.AWS_S3_BUCKET_NAME;

    try {
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: 'images/test-upload-check-region.txt',
            Body: Buffer.from('Testing upload with eu-north-1 region!'),
            ContentType: 'text/plain',
        });

        const result = await s3.send(command);
        console.log('✅ SUCCESS! HTTP Status:', result.$metadata.httpStatusCode);
        console.log('Upload worked! You can test uploading in your frontend now.');
    } catch (err) {
        console.error('❌ UPLOAD FAILED!');
        console.error('Error Code:', err.Code);
        console.error('Error Message:', err.message);
    }
}

testS3Upload();
