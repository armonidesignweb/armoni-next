import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Project } from '@/models/Project';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const seed = searchParams.get('seed');

    await connectToDatabase();

    if (seed === 'true') {
      const existing = await Project.countDocuments();
      if (existing === 0) {
        const STATIC_PROJECTS = [
          {
            slug: 'bogazici-residences',
            title: { tr: 'Boğaziçi Residences', en: 'Boğaziçi Residences', de: 'Boğaziçi Residences', ru: 'Boğaziçi Residences', ar: 'Boğaziçi Residences' },
            description: { tr: 'İstanbul Boğazı\'na nazır lüks konut projesi', en: '', de: '', ru: '', ar: '' },
            location: 'Residential', // using location for category for now
            year: 2024,
            coverImage: '/images/projeler/project-1.jpg',
            gallery: ['/images/projeler/project-2.jpg'],
            isActive: true,
            order: 1
          },
          {
            slug: 'grand-mira-hotel',
            title: { tr: 'Grand Mira Hotel', en: 'Grand Mira Hotel', de: 'Grand Mira Hotel', ru: 'Grand Mira Hotel', ar: 'Grand Mira Hotel' },
            description: { tr: 'Butik otel lobi ve lounge tasarımı', en: '', de: '', ru: '', ar: '' },
            location: 'Hospitality',
            year: 2024,
            coverImage: '/images/projeler/project-3.jpg',
            gallery: ['/images/projeler/project-4.jpg'],
            isActive: true,
            order: 2
          },
          {
            slug: 'nisantasi-penthouse',
            title: { tr: 'Nişantaşı Penthouse', en: 'Nişantaşı Penthouse', de: 'Nişantaşı Penthouse', ru: 'Nişantaşı Penthouse', ar: 'Nişantaşı Penthouse' },
            description: { tr: 'Özel villa yatak odası koleksiyonu', en: '', de: '', ru: '', ar: '' },
            location: 'Residential',
            year: 2023,
            coverImage: '/images/projeler/project-5.jpg',
            gallery: ['/images/projeler/project-6.jpg'],
            isActive: true,
            order: 3
          }
        ];
        await Project.insertMany(STATIC_PROJECTS);
      }
    }

    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await connectToDatabase();

    const maxOrderProj = await Project.findOne().sort('-order');
    const newOrder = maxOrderProj && maxOrderProj.order !== undefined ? maxOrderProj.order + 1 : 1;
    
    // auto slug
    if (!body.slug && body.title?.tr) {
      body.slug = body.title.tr.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    } else if (!body.slug) {
      body.slug = 'proj-' + Date.now();
    }

    const project = await Project.create({ ...body, order: newOrder });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, orderedIds } = body;

    await connectToDatabase();

    if (action === 'reorder' && Array.isArray(orderedIds)) {
      const operations = orderedIds.map((id, index) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { order: index } },
        }
      }));
      await Project.bulkWrite(operations);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in projects PUT:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
