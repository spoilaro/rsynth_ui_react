import { initSync } from "./pkg/synth_processor.js";

class WasmReverb extends AudioWorkletProcessor {
  // When constructor() undefined, the default constructor will be implicitly
  // used.
  //
  constructor(options) {
    super();

    this.port.onmessage = (event) => {
      console.log("Module received");

      const mod = event.data;

      let wasm = initSync(mod);

      let res = wasm.process_audio(33200);

      console.log(res);
    };
  }

  process(inputs, outputs) {
    return true;
  }
}

registerProcessor("wasm-reverb", WasmReverb);
