import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(request: Request) {
  // Отримуємо `prompt` від клієнта
  const req = await request.json();

  // Ініціалізуємо Replicate
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN as string,
  });

  
  const input = {
    width: 1024,
    height: 1024,
    prompt: req.prompt,
    scheduler: "K_EULER",
    num_outputs: 1,
    guidance_scale: 0,
    negative_prompt: 'Low quality, low resolution, blurry, overexposed, underexposed, poorly lit, distorted proportions, unnatural poses, missing details, harsh shadows, poorly rendered hands, extra limbs, incorrect anatomy, bad perspective, unrealistic lighting, unbalanced composition, over-saturation, unnatural colors, overly pixelated, artifacts, overcompressed, cartoonish, grainy, poor texture quality, flat, uninspired, repetitive patterns, chaotic background, irrelevant objects, messy, cluttered scene, too dark, too bright, unrealistic physics, text artifacts, watermarks, unwanted logos, noise, oversharpened, monotone, inconsistent style.',
    num_inference_steps: 4,
  };

  try {
    // Викликаємо модель
    const output = await replicate.run(
      'bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637',
      { input }
    );

    console.log("Generated Image URLs:", output); // Лог результату
    return NextResponse.json({ output }, { status: 200 });
  } catch (error) {
    console.error("Error running the model:", error);
    return NextResponse.json(
      { error: "Failed to generate the image. Please try again." },
      { status: 500 }
    );
  }
}
