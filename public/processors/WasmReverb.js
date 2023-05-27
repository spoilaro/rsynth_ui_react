import { initSync } from "./pkg/synth_processor.js";

let wasm;

class WasmReverb extends AudioWorkletProcessor {
  // When constructor() undefined, the default constructor will be implicitly
  // used.
  //
  constructor(options) {
    super();

    this.port.onmessage = (event) => {
      console.log("Module received");

      const mod = event.data;

      wasm = initSync(mod);

      // let res = ww.process_audio(3300);
      //
      // console.log(res);
    };
  }

  process(inputs, outputs) {
    console.time("Process");
    if (typeof wasm !== "undefined" && wasm !== null) {
      let res = wasm.process_audio(3300);

      console.log(res);
    }

    console.timeEnd("Process");
    return true;
  }
}

registerProcessor("wasm-reverb", WasmReverb);
