import Image from 'next/image';
import React, { useCallback, useState } from 'react'

import { useDropzone, FileWithPath } from 'react-dropzone'
import { FaPenAlt, FaUpload } from 'react-icons/fa';

import styles from './dropzone.module.css';

interface DropzoneProps {
  title: string;
  onSelectFile(fileUrl: FileWithPath): void;
}

export function Dropzone({ onSelectFile, title }: DropzoneProps) {
  const [selectedFiles, setSelectedFiles] = useState('');

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const fileDrop = acceptedFiles[0];

    const fileUrl = URL.createObjectURL(fileDrop);

    setSelectedFiles(fileUrl);
    onSelectFile(fileDrop)
  }, [onSelectFile]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg']
    },
  });

  return (
    <>
      <div className={styles.dropzone} {...getRootProps()}>
        <input {...getInputProps()} />
        <div className={styles.preview}>
          <Image
            src={selectedFiles || '/default-profile.jpg'}
            alt="Point File"
            height={230}
            width={230}
          />
          <span className={styles.changeIcon}>
          { selectedFiles ? (
            <>
              <FaPenAlt /> Alterar
            </>
          ) : (
            <>
              <FaUpload /> Carregar
            </>
          )}
          </span>
        </div>
        <p>{title}</p>
      </div>
    </>
  )
}
