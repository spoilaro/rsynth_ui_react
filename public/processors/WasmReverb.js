class WasmReverb extends AudioWorkletProcessor {
  // When constructor() undefined, the default constructor will be implicitly
  // used.

  process(inputs, outputs) {
    // Structure
    // inputs = [
    // input_channels = [
    //  channel1, channel2
    // ]
    // ]

    //TODO: Implement reverberation
    return true;
  }
}

registerProcessor("wasm-reverb", WasmReverb);
