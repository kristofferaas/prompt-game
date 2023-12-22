import Replicate from "replicate";

const PLAYGROUND_V2_1024_AESTHETIC =
  "playgroundai/playground-v2-1024px-aesthetic:42fe626e41cc811eaf02c94b892774839268ce1994ea778eba97103fe1ef51b8";

const PLAYGROUND_V2_1024_INPUT = {
  width: 1024,
  height: 1024,
  scheduler: "K_EULER_ANCESTRAL",
  guidance_scale: 3,
  apply_watermark: false,
  negative_prompt: "",
  num_inference_steps: 50,
};

const STABLE_DIFFUSION =
  "stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478";

type AIOptions = {
  auth: string;
};

export function createAI(options: AIOptions) {
  const { auth } = options;
  const replicate = new Replicate({
    auth,
  });

  async function generateImage(prompt: string) {
    const model = PLAYGROUND_V2_1024_AESTHETIC;
    const input = {
      ...PLAYGROUND_V2_1024_INPUT,
      prompt,
    };
    const output = await replicate.run(model, { input });
    return output as string[];
  }

  return {
    generateImage,
  };
}

export type AI = ReturnType<typeof createAI>;
