import { mountCanvas } from '@thisismydesign/cursor-canvas-web/runtime';
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';

// The publish script copies the target canvas to this exact path.
import Canvas from './canvas.canvas';

mountCanvas('root', <Canvas />);
