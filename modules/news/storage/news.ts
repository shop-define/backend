import { Upload } from '@aws-sdk/lib-storage';
import { DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getStorage } from '../../../libs/storage';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../../config';

export async function uploadNewsToStorage(htmlContent: string) {
  const upload = new Upload({
    client: getStorage(),
    params: {
      Bucket: config.awsStorage.newsBucketName,
      Key: `${uuidv4()}.html`,
      Body: htmlContent,
      ACL: 'public-read',
    },
  });

  return (await upload.done()).Key;
}

export async function updateNewsInStorage(htmlContent: string, name: string) {
  const upload = new Upload({
    client: getStorage(),
    params: {
      Bucket: config.awsStorage.newsBucketName,
      Key: name,
      Body: htmlContent,
      ACL: 'public-read',
    },
  });

  return (await upload.done()).Key;
}

export async function getNewsFromStorage(name: string) {
  const res = await getStorage().send(
    new GetObjectCommand({
      Bucket: config.awsStorage.newsBucketName,
      Key: name,
    })
  );

  return (await res).Body?.transformToString() ?? '';
}

export async function deleteNewsFromStorage(name: string): Promise<boolean | undefined> {
  const res = await getStorage().send(
    new DeleteObjectCommand({
      Bucket: config.awsStorage.newsBucketName,
      Key: name,
    })
  );

  return (await res).DeleteMarker;
}
