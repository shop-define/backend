import { Upload } from '@aws-sdk/lib-storage';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getStorage } from '../../../libs/storage';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../../config';

export async function uploadImageToStorage(data: Buffer, extension: string) {
  const upload = new Upload({
    client: getStorage(),
    params: {
      Bucket: config.awsStorage.bucketName,
      Key: `${uuidv4()}.${extension}`,
      Body: data,
      ACL: 'public-read',
    },
  });

  return (await upload.done()).Key;
}

export async function deleteImageFromStorage(name: string): Promise<boolean | undefined> {
  const res = await getStorage().send(
    new DeleteObjectCommand({
      Bucket: config.awsStorage.bucketName,
      Key: name,
    })
  );

  return await res.DeleteMarker;
}
