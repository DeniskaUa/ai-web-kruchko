import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(request: Request) {
  // Отримуємо вхідні дані від клієнта
  const req = await request.json();

  // Ініціалізуємо Replicate
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN as string,
  });

  // Вхідні дані
  const input = {
    task: "image_captioning",
    image: req.image, // Зображення у форматі Base64 або URL
  };

  try {
    // Викликаємо модель
    const output = await replicate.run(
      "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
      { input }
    );

    console.log("Extracted Text:", output); // Лог результату
    return NextResponse.json({ text: output }, { status: 200 });
  } catch (error) {
    console.error("Error running the model:", error);
    return NextResponse.json(
      { error: "Failed to process the image. Please try again." },
      { status: 500 }
    );
  }
}
