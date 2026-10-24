import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';

interface SubmittedBuild {
  id: string;
  projectName: string;
  builderName: string;
  school: string;
  githubUrl?: string;
  websiteUrl?: string;
  artifactUrl?: string;
  videoUrl?: string;
  description: string;
  tags: string[];
  submittedAt: string;
  featured: boolean;
}

// GET: Retrieve all builds from KV Redis
export async function GET() {
  try {
    const builds = await kv.get<SubmittedBuild[]>('builds:all') || [];
    return NextResponse.json(builds);
  } catch (error) {
    console.error('Error fetching builds:', error);
    return NextResponse.json({ error: 'Failed to fetch builds' }, { status: 500 });
  }
}

// POST: Save new submission to KV
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.projectName || !body.builderName || !body.school || !body.description || !body.tags) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure at least one project link is provided
    if (!body.githubUrl && !body.websiteUrl && !body.artifactUrl) {
      return NextResponse.json({ error: 'At least one project link required (GitHub, Website, or Artifact)' }, { status: 400 });
    }

    // Validate tags array
    if (!Array.isArray(body.tags) || body.tags.length === 0) {
      return NextResponse.json({ error: 'At least one tag is required' }, { status: 400 });
    }

    // Get all existing builds to generate new ID
    const kvBuilds = await kv.get<SubmittedBuild[]>('builds:all') || [];

    // Generate next ID based on max from KV builds
    const allIds = kvBuilds.map(b => parseInt(b.id, 10));
    const maxId = allIds.length > 0 ? Math.max(...allIds) : 0;
    const newId = String(maxId + 1).padStart(3, '0');

    // Create build object with only provided fields
    const newBuild: SubmittedBuild = {
      id: newId,
      projectName: body.projectName,
      builderName: body.builderName,
      school: body.school,
      description: body.description,
      tags: body.tags,
      submittedAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      featured: false,
    };

    // Add optional fields only if they exist
    if (body.githubUrl) {
      newBuild.githubUrl = body.githubUrl;
    }
    if (body.websiteUrl) {
      newBuild.websiteUrl = body.websiteUrl;
    }
    if (body.artifactUrl) {
      newBuild.artifactUrl = body.artifactUrl;
    }
    if (body.videoUrl) {
      newBuild.videoUrl = body.videoUrl;
    }

    // Store updated builds array in KV
    const updatedBuilds = [...kvBuilds, newBuild];
    await kv.set('builds:all', updatedBuilds);

    return NextResponse.json({ success: true, id: newId }, { status: 201 });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
