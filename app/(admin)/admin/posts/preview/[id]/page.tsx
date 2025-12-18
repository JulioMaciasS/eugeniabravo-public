'use client';

import { Suspense, use } from 'react';
import { useSearchParams } from 'next/navigation';
import BlogPostPreviewComponent from '@/components/blog/BlogPostPreviewComponent';
import LoadingBlogPost from '@/components/blog/LoadingBlogPost';

export default function AdminPostPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  return (
    <Suspense fallback={<LoadingBlogPost />}>
      <PreviewWithSearchParams postId={id} />
    </Suspense>
  );
}

function PreviewWithSearchParams({ postId }: { postId: string }) {
  const searchParams = useSearchParams();
  const from = searchParams?.get('from');
  
  return <BlogPostPreviewComponent postId={postId} referrer={from} />;
}
