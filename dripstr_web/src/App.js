import ThreeScene from './shared/Three';

function App() {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center">
      {/* DaisyUI Button */}
      <button className="btn btn-primary mb-8">Hello DaisyUI</button>

      {/* Three.js Scene */}
      <div className="w-full h-[80vh]">
        <ThreeScene />
      </div>
    </div>
  );
}

export default App;
