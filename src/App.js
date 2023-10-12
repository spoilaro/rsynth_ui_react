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

    let vanillaProcessorUrl = "processors/VanillaV2Processor.js";
    let wasmProcessorUrl = "processors/WasmReverb.js";

    //await audioCtx.audioWorklet.addModule(vanillaProcessorUrl);
    await audioCtx.audioWorklet.addModule(wasmProcessorUrl);

    source = audioCtx.createMediaStreamSource(input_stream);

    //let vanillaProcessor = new AudioWorkletNode(audioCtx, "vanilla-reverbv2");
    let wasmProcessor = new AudioWorkletNode(audioCtx, "wasm-reverb");

    WebAssembly.compileStreaming(
      fetch("./processors/pkg/synth_processor_bg.wasm"),
    ).then((mod) => {
      wasmProcessor.port.postMessage(mod);
    });

    // Change the processor here to switch
    source.connect(wasmProcessor).connect(audioCtx.destination);
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
