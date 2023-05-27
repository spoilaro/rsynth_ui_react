// Declare global variables
let reverbBuffer,
  readIndex = 0,
  writeIndex = 0;

class VanillaReverbV2 extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: "dry",

        defaultValue: 0.5,
        minValue: 0,
        maxValue: 1,
        automationRate: "a-rate",
      },
      {
        name: "wet",
        defaultValue: 0.5,
        minValue: 0,
        maxValue: 1,
        automationRate: "a-rate",
      },
      {
        name: "roomSize",

        defaultValue: 0.5,
        minValue: 0,
        maxValue: 1,
        automationRate: "a-rate",
      },
    ];
  }

  constructor(options) {
    super(options);

    // Initialize the reverb buffer

    const reverbDuration = 3; // seconds

    const reverbLength = this.sampleRate * reverbDuration;
    reverbBuffer = new Float32Array(reverbLength);

    for (let i = 0; i < reverbLength; i++) {
      reverbBuffer[i] = Math.random() * 2 - 1;
    }
  }

  // Implement audio processing logic in process function
  process(inputs, outputs, parameters) {
    console.time("Process");
    const input = inputs[0];
    const output = outputs[0];
    const dry = parameters.dry[0];
    const wet = parameters.wet[0];
    const roomSize = parameters.roomSize[0];

    // Calculate the read and write indices
    const delayTime = roomSize * 2;
    const delaySamples = Math.floor(delayTime * this.sampleRate);
    writeIndex = (writeIndex + input[0].length) % reverbBuffer.length;
    readIndex =
      (writeIndex + reverbBuffer.length - delaySamples) % reverbBuffer.length;

    // Process each channel of the input
    for (let channel = 0; channel < input.length; channel++) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];

      // Process the input with the reverb
      for (let i = 0; i < inputChannel.length; i++) {
        const reverbSample = reverbBuffer[readIndex];
        outputChannel[i] = inputChannel[i] * dry + reverbSample * wet;
        reverbBuffer[writeIndex] =
          inputChannel[i] * roomSize + reverbSample * (1 - roomSize);
        readIndex = (readIndex + 1) % reverbBuffer.length;
        writeIndex = (writeIndex + 1) % reverbBuffer.length;
      }
    }

    // Return true to indicate that the processor is still active
    console.timeEnd("Process");
    return true;
  }
}

// Register the AudioWorkletProcessor
registerProcessor("vanilla-reverbv2", VanillaReverbV2);
