import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(request: Request) {
  const req = await request.json();

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN as string,
  });

  const model = 'zylim0702/remove-object:0e3a841c913f597c1e4c321560aa69e2bc1f15c65f8c366caafc379240efd8ba';

  const input = {
    mask: req.mask,   // Base64 or URL of the mask image
    image: req.image, // Base64 or URL of the original image
    };

  try {
    const output = await replicate.run(model, { input });

    if (!output) {
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }

    return NextResponse.json({ output }, { status: 201 });
  } catch (error) {
    console.error('Error running model:', error);
    return NextResponse.json({ error: 'Failed to process the image.' }, { status: 500 });
  }
}
