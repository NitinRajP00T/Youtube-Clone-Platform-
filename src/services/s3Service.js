const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getS3Client } = require('../config/aws');
const crypto = require('crypto');

exports.uploadFile = async (file, folder = 'uploads') => {
    const s3Client = getS3Client();
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!bucketName) {
        throw new Error('AWS_S3_BUCKET_NAME is not configured');
    }

    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const extension = file.originalname.split('.').pop();
    const key = `${folder}/${uniqueSuffix}.${extension}`;

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    });

    await s3Client.send(command);

    // Return the public URL
    // Assuming standard S3 endpoint format depending on region. For general case:
    return `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
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
