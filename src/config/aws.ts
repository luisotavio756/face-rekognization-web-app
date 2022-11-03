import { ConfigurationOptions } from 'aws-sdk';

const configOptions: ConfigurationOptions = {
  accessKeyId: process.env.AWS_ACCESS,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION_NAME,
};

export default configOptions;
