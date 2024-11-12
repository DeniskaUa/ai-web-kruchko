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
    image: req.image, // Зображення у форматі Base64 або URL
  };

  try {
    // Викликаємо модель
    const output = await replicate.run(
      "abiruyt/text-extract-ocr:a524caeaa23495bc9edc805ab08ab5fe943afd3febed884a4f3747aa32e9cd61",
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
