import { NextResponse } from 'next/server';
import Config from '@/models/config'; 

export async function POST(req) {
  try {
    const { openaiapikey, nextauthsecret } = await req.json();

    const existingConfig = await Config.findOne();
    if (existingConfig) {
      await Config.updateOne({}, { openai_api_key: openaiapikey, nextauth_secret: nextauthsecret });
    } else {
      await Config.create({ openai_api_key: openaiapikey, nextauth_secret: nextauthsecret });
    }

    return NextResponse.json({ message: 'Keys updated successfully.' }, { status: 200 });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json(
      { message: 'An error occurred while updating the keys.' },
      { status: 500 }
    );
  }
}
export async function GET() {
    try {
      // Fetch the current configuration keys from the database
      const configData = await Config.findOne();
      return NextResponse.json(configData || {}, { status: 200 });
    } catch (error) {
      console.error(error.message);
      return NextResponse.json(
        { message: 'An error occurred while fetching the keys.' },
        { status: 500 }
      );
    }
  }