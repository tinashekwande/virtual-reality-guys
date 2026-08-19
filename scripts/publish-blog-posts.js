// scripts/publish-blog-posts.js

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Read .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('.env.local file not found at:', envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`^${name}=(.*)$`, 'm'));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const serviceRoleKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Supabase URL or Service Role Key missing in .env.local');
  process.exit(1);
}

// 2. Initialize Supabase Admin Client
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// Publish logic
async function publish() {
  console.log('Starting blog post publishing...');

  try {
    // 3. Query all blog posts with status='draft'
    const { data: drafts, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id, title, slug')
      .eq('status', 'draft');

    if (fetchError) {
      console.error('Error fetching draft posts:', fetchError.message);
      process.exit(1);
    }

    if (!drafts || drafts.length === 0) {
      console.log('No draft blog posts found.');
      process.exit(0);
    }

    console.log(`Found ${drafts.length} draft posts. Publishing...`);

    // 4. Update each draft post
    const now = new Date().toISOString();
    
    const { data: updated, error: updateError } = await supabase
      .from('blog_posts')
      .update({
        status: 'published',
        published_at: now
      })
      .eq('status', 'draft')
      .select();

    if (updateError) {
      console.error('Error updating posts:', updateError.message);
      process.exit(1);
    }

    // 5. Log which posts were published
    console.log(`Successfully published ${updated.length} posts:`);
    updated.forEach(p => console.log(` - ${p.title} (Slug: ${p.slug})`));

  } catch (err) {
    // 6. Handle errors gracefully
    console.error('Unexpected error during publishing:', err);
    process.exit(1);
  }
}

publish();
