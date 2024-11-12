import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(request: Request) {
  // 1. Get request data (in JSON format) from the client
  const req = await request.json();

  // 2. Initialize the replicate object with our Replicate API token
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN as string,
  });

  // 3. Set the model that we're about to run
  const model =
    'tencentarc/gfpgan:0fbacf7afc6c144e5be9767cff80f25aff23e52b0708f17e20f9879b2f21516c';
   
  // 4. Set the image which is the image we uploaded from the client
  const input = {
    img: req.image,
    scale: 2,
    version: "v1.4"
  };

  // 5. Run the Replicate's model (to remove background) and get the output image
  const output = await replicate.run(model, { input });

  // 6. Check if the output is NULL then return error back to the client
  if (!output) {
    console.log('Something went wrong');
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }

  // 7. Otherwise, we show output in the console (server-side)
  //  and return the output back to the client
  console.log('Output', output);
  return NextResponse.json({ output }, { status: 201 });
}
