import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { contentApi } from '../../api/contentApi';
import type { BlogPost } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ArrowLeft, Calendar, Eye, User, Share2 } from 'lucide-react';

export const BlogPostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    contentApi.getBlogPostBySlug(slug)
      .then(setPost)
      .catch((err) => setError(err.message || 'Article not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading technical article..." className="min-h-[50vh]" />;
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Article Not Found</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">{error || 'The requested article could not be located.'}</p>
        <Link to="/blog" className="mt-6 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      <div>
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
          <ArrowLeft className="w-4 h-4" /> Back to All Articles
        </Link>
      </div>

      <header className="space-y-4">
        {post.categoryName && (
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900">
            {post.categoryName}
          </span>
        )}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {post.title}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">{post.summary}</p>

        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">{post.authorName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recent'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-slate-400" />
            <span>{post.viewCount} views</span>
          </div>
        </div>
      </header>

      {post.thumbnailUrl && (
        <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl max-h-[450px]">
          <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Article Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed text-base sm:text-lg whitespace-pre-line bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-md">
        {post.content}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap pt-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tags:</span>
          {post.tags.map((t) => (
            <span key={t} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 text-xs font-medium px-3 py-1 rounded-lg">
              #{t}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};
