const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getS3Client } = require('../config/aws');
const crypto = require('crypto');

exports.uploadFile = async (file, folder = 'uploads') => {
    const s3Client = getS3Client();
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!bucketName) {
        throw new Error('AWS_S3_BUCKET_NAME is not configured in .env');
    }

    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        throw new Error('AWS credentials (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY) are not configured in .env');
    }

    if (!file.buffer || file.buffer.length === 0) {
        throw new Error('File buffer is empty — multer may not be using memoryStorage');
    }

    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const extension = file.originalname.split('.').pop();
    const key = `${folder}/${uniqueSuffix}.${extension}`;

    console.log('🚀 Uploading to S3:', {
        bucket: bucketName,
        key,
        contentType: file.mimetype,
        bodySize: file.buffer.length,
        region: process.env.AWS_REGION || 'us-east-1'
    });

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    });

    try {
        const result = await s3Client.send(command);
        console.log('✅ S3 PutObject response:', result.$metadata.httpStatusCode);
    } catch (err) {
        console.error('❌ S3 Upload Error:', {
            name: err.name,
            message: err.message,
            code: err.Code || err.$metadata?.httpStatusCode,
        });
        throw err; // Re-throw so the controller/global handler catches it
    }

    // Return the public URL
    const region = process.env.AWS_REGION || 'us-east-1';
    return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
};

exports.deleteFile = async (fileUrl) => {
    if (!fileUrl) return;

    const s3Client = getS3Client();
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!bucketName) return;

    // Extract key from URL
    try {
        const url = new URL(fileUrl);
        // url.pathname starts with '/' so we substring(1)
        const key = url.pathname.substring(1);

        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key
        });

        await s3Client.send(command);
    } catch (error) {
        console.error('Error deleting file from S3:', error);
    }
};
