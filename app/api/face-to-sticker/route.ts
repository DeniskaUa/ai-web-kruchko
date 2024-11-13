import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(request: Request) {
  try {
    // Отримуємо дані від клієнта
    const req = await request.json();

    // Перевірка наявності обов'язкових полів
    if (!req.image || !req.prompt) {
      return NextResponse.json(
        { error: 'Image and prompt are required fields.' },
        { status: 400 }
      );
    }

    // Ініціалізація Replicate з API-токеном
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN as string,
    });

    // Визначення моделі та інпуту
    const model = 'fofr/face-to-sticker:764d4827ea159608a07cdde8ddf1c6000019627515eb02b6b449695fd547e5ef';
    const input = {
      image: req.image, // Зображення від користувача
      steps: 20,
      width: 1024,
      height: 1024,
      prompt: req.prompt, // Промт від користувача
      upscale: false,
      upscale_steps: 10,
      negative_prompt: '',
      prompt_strength: 5,
      ip_adapter_noise: 0.5,
      ip_adapter_weight: 0.2,
      instant_id_strength: 0.8,
    };

    // Запуск моделі
    const output = await replicate.run(model, { input });

    // Перевірка вихідних даних
    if (!output || !Array.isArray(output)) {
      console.error('Model did not return expected output:', output);
      return NextResponse.json(
        { error: 'Model processing failed. Please try again.' },
        { status: 500 }
      );
    }

    // Лог результату
    console.log('Model Output:', output);

    // Повертаємо масив результатів
    return NextResponse.json({ output }, { status: 200 });
  } catch (error) {
    console.error('Error in model execution:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing the request.' },
      { status: 500 }
    );
  }
}