import { ConfigurationOptions } from 'aws-sdk';

const configOptions: ConfigurationOptions = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};

export default configOptions;
