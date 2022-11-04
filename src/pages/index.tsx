import { useMemo, useState } from 'react'
import { Rekognition } from 'aws-sdk';
import type { GetServerSideProps, NextPage } from 'next'
import { parseCookies } from 'nookies';
import { FaSignOutAlt } from 'react-icons/fa'

import Button from '../components/Button/Button'

import { Dropzone } from '../components/Dropzone/Dropzone'
import api from '../services/api';
import styles from '../styles/Home.module.css'
import { useAuth } from '../hooks/auth.hook';
import { AxiosError } from 'axios';


const Home: NextPage = () => {
  const { signOut } = useAuth();

  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<Rekognition.CompareFacesResponse | null>(null);
  const [sourceImg, setSourceImg] = useState<File>();
  const [targetImg, setTargetImg] = useState<File>();

  async function handleSubmit() {
    setComparisonResult(null);

    const data = new FormData();

    if (!sourceImg || !targetImg) return;

    setIsComparing(true);

    data.append('sourceImg', sourceImg);
    data.append('targetImg', targetImg);

    try {
      const response = await api.post<Rekognition.CompareFacesResponse>('/faceComparison', data);

      setComparisonResult(response.data);

    } catch (error) {
      if (error instanceof AxiosError) {
        error.response?.status === 401 && signOut();
      } else {
        alert('Ocorreu um erro ao tentar processar as imagens. Por favor, tente novamente com outra imagem. Se o problema persistir contate o suporte.');

        console.error(error);
      }
    } finally {
      setIsComparing(false);
    }
  }

  const resultText = useMemo(() => {
    const hasUnmatchedFaces = comparisonResult?.UnmatchedFaces?.length;
    const similarity = comparisonResult?.FaceMatches?.[0]?.Similarity || 0;
    const parsedSimilarity = parseFloat(similarity.toFixed(2));

    if (hasUnmatchedFaces) {
      return `Não foi possível assimilar as faces nas imagens. Talvez não seja a mesma pessoa ou não foi possível detectar na imagem fornecida. Por favor, tente outra.`
    }


    if (parsedSimilarity > 70) {
      return `Os dois rostos parecem ser a mesma pessoa. A similaridade é de ${parsedSimilarity}%`;
    }

    if (parsedSimilarity > 50) {
      return `Os dois rostos contém semelhanças entre si e podem ser a mesma pessoa. A similaridade é de ${parsedSimilarity}%`;
    }

    return `Os dois rostos contém pouca semelhança. A similaridade é de ${parsedSimilarity}%`;

  }, [comparisonResult]);

  return (
    <>
      <div className={styles.logoutContainer}>
        <button type="button" onClick={signOut}>
          Sair <FaSignOutAlt />
        </button>
      </div>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>
            Reconhecimento facial
          </h1>
          <p>Compare duas imagens e verifique se é a mesma pessoa.</p>
        </header>

        <main className={styles.main}>
          <div className={styles.grid}>
            <div className={styles.cardsContainer}>
              <Dropzone title="Imagem base" onSelectFile={setSourceImg} />
            </div>
            <div className={styles.cardsContainer}>
              <Dropzone title="Imagem para comparação" onSelectFile={setTargetImg} />
            </div>
          </div>
          <Button onClick={handleSubmit}>
            {isComparing ? 'Comparando...' : 'Comparar imagens'}
          </Button>
        </main>
        {comparisonResult && (
          <div className={styles.result}>
            <h2>Resultados</h2>
            <p>{resultText}</p>
          </div>
        )}
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { 'faceReko.token': user } = parseCookies(context);

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
};

export default Home
