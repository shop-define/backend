import {
  S3Client,
  HeadBucketCommand,
  CreateBucketCommand,
  BucketLocationConstraint,
  PutBucketPolicyCommand,
} from '@aws-sdk/client-s3';
import { config } from '../../config';

const bucketPolicy = {
  Version: '2012-10-17',
  Statement: [
    {
      Sid: 'PublicReadGetObject',
      Effect: 'Allow',
      Principal: '*',
      Action: 's3:GetObject',
      Resource: `arn:aws:s3:::${config.awsStorage.bucketName}/*`,
    },
  ],
};

let storage: S3Client;

export function getStorage() {
  if (!storage) {
    storage = new S3Client({
      endpoint: config.awsStorage.url,
      credentials: {
        accessKeyId: config.awsStorage.accessKey,
        secretAccessKey: config.awsStorage.secretKey,
      },
      forcePathStyle: true,
      region: config.awsStorage.region,
    });
  }
  return storage;
}

export async function setupBucket() {
  const s3 = getStorage();

  try {
    await s3.send(new HeadBucketCommand({ Bucket: config.awsStorage.bucketName }));
  } catch (e) {
    // eslint-disable-next-line
    if ((e as any).name === 'NotFound') {
      await s3.send(
        new CreateBucketCommand({
          Bucket: config.awsStorage.bucketName,
          ACL: 'public-read',
          CreateBucketConfiguration: {
            LocationConstraint: config.awsStorage.region as BucketLocationConstraint,
          },
        })
      );

      const putBucketPolicyCommand = new PutBucketPolicyCommand({
        Bucket: config.awsStorage.bucketName,
        Policy: JSON.stringify(bucketPolicy),
      });
      await s3.send(putBucketPolicyCommand);
    } else {
      console.log('S3 bucket not created');
    }
  }
}