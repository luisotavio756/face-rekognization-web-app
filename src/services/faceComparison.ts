import aws, { Rekognition } from 'aws-sdk';

import { CompareFacesResponse } from 'aws-sdk/clients/rekognition';
import awsConfigOptions from '../config/aws';

export class FaceCompareService {
  private client: Rekognition;
  private readonly bucket: string = process.env.AWS_BUCKET_NAME as string;

  constructor() {
    this.client = new aws.Rekognition(awsConfigOptions);
  }

  public async compareFaces(
    sourceFaceImg: Buffer | string,
    targetFaceImg: Buffer | string,
    similarityThreshold = 70,
  ): Promise<CompareFacesResponse> {
    const params: Rekognition.CompareFacesRequest = {
      SourceImage: {
        Bytes: sourceFaceImg,
        // S3Object: {
        //   Bucket: bucket,
        //   Name: 'luis.png'
        // },
      },
      TargetImage: {
        Bytes: targetFaceImg,
        // S3Object: {
        //   Bucket: bucket,
        //   Name: 'fotoCortada.jpeg'
        // },
      },
      SimilarityThreshold: similarityThreshold,
    };

    return new Promise((resolve, reject) => {
      this.client.compareFaces(params, function (err, response) {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }
}
