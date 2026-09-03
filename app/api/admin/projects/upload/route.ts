import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.\-]/g, '');

    const uploadDir = path.join(process.cwd(), 'public', 'images', 'projeler');
    
    // Ensure dir exists
    await mkdir(uploadDir, { recursive: true });
    
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const imageUrl = `/images/projeler/${filename}`;

    return NextResponse.json({ url: imageUrl }, { status: 201 });
  } catch (error) {
    console.error('Error uploading project file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
