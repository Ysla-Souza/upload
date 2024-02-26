'use client'
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image'
import { useEffect, useState } from 'react';


// inicialização do firebase
const firebaseConfig = {
  apiKey: "AIzaSyA0MeeV2KnRJFNOggBvXeQ8XBGoFZs0z6g",
  authDomain: "upload-bb620.firebaseapp.com",
  projectId: "upload-bb620",
  storageBucket: "upload-bb620.appspot.com",
  messagingSenderId: "205814754857",
  appId: "1:205814754857:web:3d30127a7d1b3ca3263638"
};
const firebaseApp = initializeApp(firebaseConfig);

export default function Home() {
  //estado para armazenar o vídeo que está sendo carregado
  const [video, setVideo] = useState<any>(null);

  //estado que armazena a url do video recém-carregado
  const [videoUrl, setVideoUrl] = useState('');

  //estado que recebe a lista de vídeos armazenados no storage
  const [files, setFiles] = useState<any []>([]);

  //hook que é o primeiro a executar quando o componente é carregado
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        //inicialização do storage
        const storage = getStorage();
        const storageRef = ref(storage, 'images');

        //função que coleta todos os videos baseado na referência recebida
        const filesList = await listAll(storageRef);

        //função que transforma a lista de elementos do tipo File em objetos com chaves name e url
        const filesWithUrlPromises = filesList.items.map(async (itemRef: any) => {
          const url = await getDownloadURL(itemRef);
          return { name: itemRef.name, url };
        });

        const filesWithUrl: any[] = await Promise.all(filesWithUrlPromises);
        setFiles(filesWithUrl);
      } catch (error) {
        console.error('Erro ao listar arquivos:', error);
      }
    };

    fetchFiles();
  }, []);

  const addVideo = async () => {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${video.name}`);
    await uploadBytes(storageRef, video);
    
    const downloadUrl = await getDownloadURL(storageRef);
    setVideoUrl(downloadUrl);
  };

  const handleImageChange = (e: any) => {
    if (e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Olá
      <input type="file" onChange={handleImageChange} />
      <button
        type="button"
        onClick={ addVideo }
      >
        Carregar imagem
      </button>

      { 
        files.length > 0 && files.map((file: any, index: number) => (
          <video key={index}  width="640" height="360" controls>
            <source src={ file.url } type="video/mp4" />
            Seu navegador não suporta o elemento de vídeo.
          </video>
        ))
      }
    </main>
  )
}
