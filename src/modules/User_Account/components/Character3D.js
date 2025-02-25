// Model.js
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

const Model = ({ modelPath }) => {
  const { scene } = useGLTF(modelPath)
  
  return <primitive object={scene} scale={1.5} />
}

export default Model
