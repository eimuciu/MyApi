// App.js
import React, { useState, useEffect } from 'react';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import './App.css'; // Optional for additional styling
import { SlSizeFullscreen } from 'react-icons/sl';

const ResizableRectangle = () => {
  const [rectSize, setRectSize] = useState({ width: 0, height: 0 });
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    fetch('api/data')
      .then((res) => res.json())
      .then((data) => setRectSize(data));
  }, []);

  const handleResize = (e, { size }) => {
    setRectSize({ width: size.width, height: size.height });
  };

  const getPerimeter = () => {
    return (rectSize.width + rectSize.height) * 2;
  };

  const postData = () => {
    if (!isFetching) {
      setIsFetching(true);
      fetch('api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify the content type
        },
        body: JSON.stringify({
          width: rectSize.width.toFixed(2),
          height: rectSize.height.toFixed(2),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            alert('Width cannot be more thant height!');
            setIsFetching(false);
            setRectSize({
              width: Number(data.data.width),
              height: Number(data.data.height),
            });
          } else {
            setIsFetching(false);
            const parsedData = JSON.parse(data.data);
            setRectSize({
              width: Number(parsedData.Width),
              height: Number(parsedData.Height),
            });
          }
        });
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        position: 'relative',
      }}
    >
      <div style={{ position: 'fixed', top: '25%', zIndex: 1, color: 'red' }}>
        {isFetching && 'Waiting for server...'}
      </div>
      <div>Perimeter: {getPerimeter().toFixed(2)}</div>
      <Resizable
        width={rectSize.width}
        height={rectSize.height}
        onResize={handleResize}
        minConstraints={[0, 0]} // Minimum size constraints
        maxConstraints={[window.innerWidth - 50, window.innerHeight - 50]} // Maximum size constraints
        handle={
          <span onMouseUpCapture={postData} className="custom-handle">
            <SlSizeFullscreen />
          </span>
        } // Custom handle for resizing
      >
        <div>
          <svg
            width={rectSize.width}
            height={rectSize.height}
            style={{ border: '1px solid lightgray' }}
          >
            <rect
              x="0"
              y="0"
              width={rectSize.width}
              height={rectSize.height}
              fill="lightblue"
            />
          </svg>
        </div>
      </Resizable>
    </div>
  );
};

function App() {
  return (
    <div>
      <ResizableRectangle />
    </div>
  );
}

export default App;
