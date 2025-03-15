import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const supabase = await createClient();

  // Verify user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Search for users by name or email
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, email, avatar_url')
    .or(`display_name.ilike.%${query}%,email.ilike.%${query}%`)
    .neq('id', user.id) // Exclude current user
    .limit(10);

  if (error) {
    console.error('Error searching users:', error);
    return NextResponse.json(
      { error: 'Failed to search users' },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}