"use client";

import { useState, useEffect, useRef } from 'react';

const scormPackageUrl = '/scorm/1/index_lms.html'
export default function EvaluacionPage() {
    const [scormData, setScormData] = useState({
        completion: 0,
        score: 0,
        status: 'not attempted'
    });

    const iframeRef = useRef(null);
    const scormApiRef = useRef(null);

    // Configuración del API SCORM
    useEffect(() => {
        // Creamos una API SCORM básica para comunicarnos con el contenido
        const scormApi = {
            initialize: (value) => {
                console.log('SCORM inicializado:', value);
                setScormData(prev => ({ ...prev, status: 'initialized' }));
                return "true";
            },
            setValue: (key, value) => {
                console.log(`SCORM setValue: ${key} = ${value}`);

                // Manejamos algunos valores SCORM comunes
                if (key === "cmi.core.lesson_status" || key === "cmi.completion_status") {
                    setScormData(prev => ({ ...prev, status: value }));
                }
                else if (key === "cmi.core.score.raw" || key === "cmi.score.raw") {
                    setScormData(prev => ({ ...prev, score: parseInt(value) }));
                }
                else if (key === "cmi.progress_measure") {
                    setScormData(prev => ({ ...prev, completion: parseFloat(value) * 100 }));
                }

                return "true";
            },
            getValue: (key) => {
                console.log(`SCORM getValue: ${key}`);
                // Implementación básica para devolver algunos valores
                return "";
            },
            commit: () => {
                console.log('SCORM commit');
                // Aquí podríamos enviar los datos a nuestro backend
                return "true";
            },
            terminate: () => {
                console.log('SCORM terminado');
                setScormData(prev => ({ ...prev, status: 'terminated' }));
                return "true";
            }
        };

        // Guardamos la referencia y exponemos la API al iframe
        scormApiRef.current = scormApi;
        window.API = scormApi; // SCORM 1.2
        window.API_1484_11 = scormApi; // SCORM 2004

        return () => {
            // Limpieza al desmontar
            delete window.API;
            delete window.API_1484_11;
        };
    }, []);

    // Función para cargar un paquete SCORM específico
    const loadScormPackage = (packageUrl) => {
        if (iframeRef.current) {
            iframeRef.current.src = packageUrl;
        }
    };

    // Cargar el paquete SCORM cuando cambia la URL
    useEffect(() => {
        if (scormPackageUrl && iframeRef.current) {
            loadScormPackage(scormPackageUrl);
        }
    }, [scormPackageUrl]);

    return (
        <>
            <div className="about">
                <h1>About 1</h1>
            </div>
            <div className="flex flex-col h-full">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold">Visor de SCORM</h2>

                    <div className="mt-4 bg-white p-4 rounded shadow">
                        <p><strong>Estado:</strong> {scormData.status}</p>
                        <p><strong>Puntuación:</strong> {scormData.score}</p>
                        <p><strong>Progreso:</strong> {scormData.completion}%</p>
                        <div className="w-full bg-gray-200 rounded h-2 mt-2">
                            <div
                                className="bg-green-500 h-2 rounded"
                                style={{ width: `${scormData.completion}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="flex-grow border border-gray-300 rounded">
                    <iframe
                        ref={iframeRef}
                        src={scormPackageUrl}
                        className="w-full h-full"
                        title="Contenido SCORM"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </>

    );
};
