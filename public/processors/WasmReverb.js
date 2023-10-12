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
    //console.time("Process time");
    if (typeof wasm !== "undefined" && wasm !== null) {

      let input = inputs[0]
      let output = outputs[0]
      
      let input_channel = input[0]
      let output_channel = output[0]

      let processed_channel = wasm.process_audio(sampleRate, input_channel, output_channel);

      outputs[0][0] = processed_channel

      //console.log(`Output channel: ${input_channel}`)
      console.log(`OUTPUT: ${processed_channel}`)
    }

    //console.timeEnd("Process time");
    return true;
  }
}

registerProcessor("wasm-reverb", WasmReverb);
