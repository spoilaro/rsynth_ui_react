import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";

let audioCtx = null;
// let analyser;
// let bufferLength;
// let dataArray;
let source;
let input_stream;

function App() {
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      input_stream = stream;
    });
  }, []);

  const startSound = async () => {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    //let processorUrl = "processors/VanillaV2Processor.js";
    let processorUrl = "processors/WasmReverb.js";

    await audioCtx.audioWorklet.addModule(processorUrl);
    source = audioCtx.createMediaStreamSource(input_stream);

    //const testProcessor = new AudioWorkletNode(audioCtx, "vanilla-reverbv2");
    //
    let testProcessor = new AudioWorkletNode(audioCtx, "wasm-reverb");
    WebAssembly.compileStreaming(
      fetch("./processors/pkg/synth_processor_bg.wasm")
    ).then((mod) => {
      testProcessor.port.postMessage(mod);
    });

    // WebAssembly.compileStreaming(fetch("./processors/pkg/pack_test_bg.wasm")).then(module => {
    //   // Pass the module to the AudioWorkletProcessor
    //   testProcessor.port.postMessage({ type: "init-wasm", wasmData: module })
    // });
    // let audio = new Audio("sounds/tech_sound.mp3");

    source.connect(testProcessor).connect(audioCtx.destination);
  };

  const stopSound = async () => {
    await audioCtx.stop();
  };

  const toggleSound = async () => {
    audioCtx ? await stopSound() : await startSound();
  };
  return (
    <div className="App">
      <button onClick={toggleSound}>START</button>
    </div>
  );
}

export default App;
