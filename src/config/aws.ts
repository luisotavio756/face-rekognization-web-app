import { ConfigurationOptions } from 'aws-sdk';

const configOptions: ConfigurationOptions = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION_NAME,
};

export default configOptions;
