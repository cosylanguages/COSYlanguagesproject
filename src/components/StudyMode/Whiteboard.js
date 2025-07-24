import React, { useRef, useEffect, useState } from 'react';

const Whiteboard = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState('pen');

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.lineCap = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 5;
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

    return (
        <div className="whiteboard-container">
            <div className="whiteboard-tools">
                <button onClick={() => setTool('pen')}>Pen</button>
                <button onClick={() => setTool('eraser')}>Eraser</button>
            </div>
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                style={{ border: '1px solid black' }}
            />
        </div>
    );
};

export default Whiteboard;
