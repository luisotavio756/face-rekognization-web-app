import { NextApiResponse, NextApiRequest } from 'next'
import nextConnect from 'next-connect';
import upload from '../../config/upload';
import { FaceCompareService } from '../../services/faceComparison';

interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

interface RequestWithFiles extends NextApiRequest {
  files: {
    targetImg: Array<File>;
    sourceImg: Array<File>;
  }
}

export const config = {
  api: {
    bodyParser: false
  }
};

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  // Handle any other HTTP method
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
  onError: (err, req, res) => {
    console.log(err);

    return res.status(500).json({ message: 'Ocorreu um erro ao tentar comparar as imagens' });
  }
});

apiRoute.use(upload.multer.fields([
  {
    name: 'sourceImg'
  },
  {
    name: 'targetImg'
  }
]));

// Process a POST request
apiRoute.post(async (req: RequestWithFiles, res) => {
  const { sourceImg, targetImg } = req.files;
  const faceCompareService = new FaceCompareService();

  const response = await faceCompareService.compareFaces(sourceImg[0].buffer, targetImg[0].buffer);

  return res.json(response);

});

export default apiRoute;
