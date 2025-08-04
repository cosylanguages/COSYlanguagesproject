import React, { useRef, useEffect, useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import toast from 'react-hot-toast';
import './Whiteboard.css';

const Whiteboard = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState('pen');
    const { t } = useI18n();

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.lineCap = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 5;

        const savedDrawing = localStorage.getItem('whiteboard');
        if (savedDrawing) {
            const img = new Image();
            img.onload = () => {
                context.drawImage(img, 0, 0);
            };
            img.src = savedDrawing;
        }
    }, []);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        const context = canvasRef.current.getContext('2d');
        context.beginPath();
        context.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const finishDrawing = () => {
        const context = canvasRef.current.getContext('2d');
        context.closePath();
        setIsDrawing(false);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) {
            return;
        }
        const { offsetX, offsetY } = nativeEvent;
        const context = canvasRef.current.getContext('2d');
        if (tool === 'pen') {
            context.strokeStyle = 'black';
            context.lineWidth = 5;
        } else {
            context.strokeStyle = 'white';
            context.lineWidth = 20;
        }
        context.lineTo(offsetX, offsetY);
        context.stroke();
    };

    const handleSaveDrawing = () => {
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL();
        localStorage.setItem('whiteboard', dataUrl);
        toast.success(t('studyMode.whiteboardSaved', 'Whiteboard saved!'));
    };

    const handleClearDrawing = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        localStorage.removeItem('whiteboard');
    };

    return (
        <div className="whiteboard-container">
            <div className="whiteboard-tools">
                <button className={`button ${tool === 'pen' ? '' : 'button--secondary'}`} onClick={() => setTool('pen')}>{t('studyMode.pen', 'Pen')}</button>
                <button className={`button ${tool === 'eraser' ? '' : 'button--secondary'}`} onClick={() => setTool('eraser')}>{t('studyMode.eraser', 'Eraser')}</button>
                <button className="button button--success" onClick={handleSaveDrawing}>{t('studyMode.saveDrawing', 'Save')}</button>
                <button className="button button--danger" onClick={handleClearDrawing}>{t('studyMode.clearDrawing', 'Clear')}</button>
            </div>
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
            />
        </div>
    );
};

export default Whiteboard;
