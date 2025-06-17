import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { CustomButton } from '../components/CustomButton';

export function Mp3Page() {
    const { register, handleSubmit, reset } = useForm();
    const [status, setStatus] = useState('');
    const [progress, setProgress] = useState('');
    const downloadId = useRef(null);
    const pollingRef = useRef(null);

    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    // Nueva función para verificar archivo listo y descargarlo
    const verifyFileReadyAndDownload = async () => {
        for (let i = 0; i < 10; i++) {
            console.log(`Intento ${i + 1}: verificando archivo...`);
            const fileRes = await fetch(`${API_BASE}/tasks/api/file/?download_id=${downloadId.current}`);

            if (fileRes.ok) {
                const blob = await fileRes.blob();
                const url = window.URL.createObjectURL(blob);
                const disposition = fileRes.headers.get('Content-Disposition');

                let filename = 'audio.flac';
                if (disposition) {
                    const utf8FilenameMatch = disposition.match(/filename\*\=UTF-8''([^;]+)/);
                    const asciiFilenameMatch = disposition.match(/filename="([^"]+)"/);
                    if (utf8FilenameMatch) {
                        filename = decodeURIComponent(utf8FilenameMatch[1]);
                    } else if (asciiFilenameMatch) {
                        filename = asciiFilenameMatch[1];
                    }
                }

                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();

                setStatus("✅ Descarga completada");
                return true;
            } else {
                const errData = await fileRes.json().catch(() => ({}));
                if (errData.error === "Archivo aún no listo") {
                    // El archivo no está listo, esperar y reintentar
                    await new Promise(res => setTimeout(res, 1000));
                } else {
                    setStatus(`❌ Error al obtener archivo: ${errData.error || 'Error desconocido'}`);
                    return false;
                }
            }
        }
        setStatus("❌ Error: el archivo no estuvo disponible a tiempo");
        return false;
    };

    const checkProgress = async () => {
        console.log("Ejecutando checkProgress...");
        if (!downloadId.current) return;

        try {
            const res = await fetch(`${API_BASE}/tasks/api/progress/?download_id=${downloadId.current}`);
            const data = await res.json();

            if (res.ok) {
                setProgress(data.progress);

                if (data.progress.startsWith('100')) {
                    console.log("Progreso 100% alcanzado");
                    clearInterval(pollingRef.current);
                    setStatus('✅ Descarga completa. Preparando archivo...');

                    await verifyFileReadyAndDownload();
                }
            }
        } catch (error) {
            clearInterval(pollingRef.current);
            setStatus('❌ Error: ' + error.message);
        }
    };

    const onSubmit = async (data) => {
        setStatus('⏳ Iniciando descarga...');
        setProgress('');
        clearInterval(pollingRef.current);  // Para evitar múltiples intervalos

        try {
            const res = await fetch('http://localhost:8000/tasks/api/download/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: data.url }),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Error en la descarga');
            }

            downloadId.current = result.download_id;
            console.log("ID de descarga:", downloadId.current);
            setStatus('⏳ Descargando...');
            pollingRef.current = setInterval(checkProgress, 2000);
        } catch (error) {
            setStatus('❌ Error: ' + error.message);
        }
    };

    useEffect(() => {
        return () => clearInterval(pollingRef.current);
    }, []);

    return (
        <div className='max-w-xl mx-auto'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="text"
                    placeholder="URL del video"
                    {...register('url')}
                    className="bg-zinc-700 p-3 rounded-lg block w-full mb-3"
                />
                <CustomButton type="submit" className="w-full mt-3">
                    Descargar
                </CustomButton>
            </form>

            {status && <p className="mt-4 text-white">{status}</p>}
            {progress && !status.includes('finalizada') && <p className="mt-2 text-white">Progreso: {progress}</p>}
        </div>
    );
}
