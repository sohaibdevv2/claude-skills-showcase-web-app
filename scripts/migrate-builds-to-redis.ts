/**
 * One-time migration script to move static builds.json data to Vercel KV Redis
 * 
 * Run this script once to migrate all builds from builds.json to Redis:
 * npx tsx scripts/migrate-builds-to-redis.ts
 * 
 * Or with ts-node:
 * npx ts-node scripts/migrate-builds-to-redis.ts
 */

import { kv } from '@vercel/kv';
import buildsData from '../data/builds.json';

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

async function migrate() {
  try {
    console.log('🔄 Starting migration from builds.json to Redis...\n');

    // Get existing builds from Redis (if any)
    const existingKvBuilds = await kv.get<SubmittedBuild[]>('builds:all') || [];
    const existingIds = new Set(existingKvBuilds.map(b => b.id));
    
    console.log(`📊 Found ${existingKvBuilds.length} existing builds in Redis`);
    console.log(`📊 Found ${buildsData.builds.length} builds in builds.json\n`);

    // Get static builds from JSON
    const staticBuilds = buildsData.builds as SubmittedBuild[];

    // Filter out builds that already exist in Redis (by ID)
    const buildsToMigrate = staticBuilds.filter(build => !existingIds.has(build.id));

    if (buildsToMigrate.length === 0) {
      console.log('✅ All builds from builds.json already exist in Redis. No migration needed.');
      return;
    }

    console.log(`📦 Migrating ${buildsToMigrate.length} new builds to Redis...\n`);

    // Merge: existing KV builds + new builds from JSON
    const allBuilds = [...existingKvBuilds, ...buildsToMigrate];

    // Save to Redis
    await kv.set('builds:all', allBuilds);

    console.log('✅ Migration complete!');
    console.log(`   - Total builds in Redis: ${allBuilds.length}`);
    console.log(`   - Migrated: ${buildsToMigrate.length}`);
    console.log(`   - Already existed: ${existingKvBuilds.length}\n`);

    // List migrated builds
    if (buildsToMigrate.length > 0) {
      console.log('📋 Migrated builds:');
      buildsToMigrate.forEach(build => {
        console.log(`   - ${build.id}: ${build.projectName} by ${build.builderName}`);
      });
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrate()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
