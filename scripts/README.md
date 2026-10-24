# Migration Scripts

## migrate-builds-to-redis.ts

One-time migration script to move all builds from `data/builds.json` to Vercel KV Redis.

### Prerequisites

1. Ensure you have Vercel KV environment variables set up:
   - `KV_URL`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

2. Install `tsx` (TypeScript executor):
   ```bash
   npm install --save-dev tsx
   ```

### Running the Migration

**Option 1: Using npm script (recommended)**
```bash
npm run migrate:builds
```

**Option 2: Using tsx directly**
```bash
npx tsx scripts/migrate-builds-to-redis.ts
```

**Option 3: Using ts-node**
```bash
npx ts-node scripts/migrate-builds-to-redis.ts
```

### What it does

1. Reads all builds from `data/builds.json`
2. Checks existing builds in Redis (by ID)
3. Migrates only builds that don't already exist in Redis
4. Merges new builds with existing Redis builds
5. Saves the complete list back to Redis

### Safety Features

- **Idempotent**: Safe to run multiple times - won't duplicate builds
- **Non-destructive**: Only adds builds, never removes existing ones
- **Deduplication**: Skips builds that already exist in Redis (by ID)

### After Migration

Once the migration is complete and verified:

1. ✅ Test that the API endpoint `/api/submit` returns all builds correctly
2. ✅ Verify the frontend displays all builds
3. ✅ Optionally archive or delete `data/builds.json` (it's no longer used)
4. ✅ The API route now only uses Redis - no more static file dependency
