'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import { 
  Linkedin, Calendar, Clock, Send, Trash2, RefreshCw, 
  Check, X, AlertCircle, Image, FileText, Loader2, Upload, File
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://apex-voice-crm-production.up.railway.app';

interface LinkedInPost {
  id: number;
  content: string;
  image_url: string | null;
  pdf_path: string | null;
  scheduled_for: string;
  timezone: string;
  status: 'scheduled' | 'publishing' | 'published' | 'failed';
  published_at: string | null;
  error_message: string | null;
  created_at: string;
}

export default function LinkedInPage() {
  const [posts, setPosts] = useState<LinkedInPost[]>([]);
  const [history, setHistory] = useState<LinkedInPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [profileName, setProfileName] = useState('');
  
  // New post form
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('08:00');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStatus();
    fetchPosts();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/api/linkedin/status`);
      const data = await res.json();
      setConfigured(data.configured);
      if (data.profile?.name) {
        setProfileName(data.profile.name);
      }
    } catch (e) {
      console.error('Failed to fetch LinkedIn status:', e);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const [postsRes, historyRes] = await Promise.all([
        fetch(`${API_URL}/api/linkedin/posts`),
        fetch(`${API_URL}/api/linkedin/history`)
      ]);
      
      const postsData = await postsRes.json();
      const historyData = await historyRes.json();
      
      setPosts(postsData.posts || []);
      setHistory(historyData.history || []);
    } catch (e) {
      console.error('Failed to fetch posts:', e);
    }
    setLoading(false);
  };

  const schedulePost = async () => {
    if (!content.trim()) {
      alert('Please enter content for your post');
      return;
    }

    setSubmitting(true);
    try {
      // Upload PDF if selected
      let pdfPath = null;
      if (pdfFile) {
        const formData = new FormData();
        formData.append('pdf', pdfFile);
        
        const uploadRes = await fetch(`${API_URL}/api/linkedin/upload-pdf`, {
          method: 'POST',
          body: formData
        });
        
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          pdfPath = uploadData.pdfPath;
        } else {
          alert('Failed to upload PDF: ' + (uploadData.error || 'Unknown error'));
          setSubmitting(false);
          return;
        }
      }

      const scheduledFor = scheduleDate 
        ? new Date(`${scheduleDate}T${scheduleTime}:00`).toISOString()
        : null;

      const res = await fetch(`${API_URL}/api/linkedin/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          imageUrl: imageUrl || null,
          pdfPath,
          scheduledFor
        })
      });

      const data = await res.json();
      
      if (data.success) {
        setContent('');
        setImageUrl('');
        setPdfFile(null);
        setPdfName('');
        setScheduleDate('');
        setScheduleTime('08:00');
        fetchPosts();
        alert(`Post scheduled for ${new Date(data.post.scheduled_for).toLocaleString()}`);
      } else {
        alert(data.error || 'Failed to schedule post');
      }
    } catch (e) {
      console.error('Error scheduling post:', e);
      alert('Failed to schedule post');
    }
    setSubmitting(false);
  };

  const publishNow = async (postId: number) => {
    if (!confirm('Publish this post to LinkedIn now?')) return;
    
    try {
      const res = await fetch(`${API_URL}/api/linkedin/posts/${postId}/publish`, {
        method: 'POST'
      });
      
      const data = await res.json();
      
      if (data.success) {
        alert('Post published successfully!');
        fetchPosts();
      } else {
        alert(data.error || 'Failed to publish post');
      }
    } catch (e) {
      console.error('Error publishing post:', e);
      alert('Failed to publish post');
    }
  };

  const deletePost = async (postId: number) => {
    if (!confirm('Delete this scheduled post?')) return;
    
    try {
      await fetch(`${API_URL}/api/linkedin/posts/${postId}`, {
        method: 'DELETE'
      });
      fetchPosts();
    } catch (e) {
      console.error('Error deleting post:', e);
    }
  };

  const processQueue = async () => {
    try {
      const res = await fetch(`${API_URL}/api/linkedin/process-queue`, {
        method: 'POST'
      });
      const data = await res.json();
      alert(`Processed ${data.processed} posts`);
      fetchPosts();
    } catch (e) {
      console.error('Error processing queue:', e);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">Scheduled</span>;
      case 'publishing':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">Publishing...</span>;
      case 'published':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Published</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">Failed</span>;
      default:
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">LinkedIn Agent</h1>
            <p className="text-gray-500 mt-1">Schedule and publish posts to LinkedIn</p>
          </div>
          <div className="flex items-center gap-4">
            {configured ? (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl">
                <Check size={18} />
                <span className="font-medium">{profileName || 'Connected'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl">
                <AlertCircle size={18} />
                <span className="font-medium">Not Configured</span>
              </div>
            )}
            <button
              onClick={processQueue}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Process Queue"
            >
              <RefreshCw size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {!configured && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
              <div>
                <h3 className="font-medium text-yellow-800">LinkedIn Not Configured</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Add your LinkedIn credentials to the backend environment:
                </p>
                <code className="block mt-2 bg-yellow-100 px-3 py-2 rounded text-sm text-yellow-800">
                  LINKEDIN_EMAIL=your@email.com<br />
                  LINKEDIN_PASSWORD=yourpassword
                </code>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* New Post Form */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Linkedin size={20} className="text-blue-600" />
              Create Post
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  placeholder="What do you want to share?"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{content.length} / 3000 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image size={16} className="inline mr-1" />
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <File size={16} className="inline mr-1" />
                  PDF Document (creates carousel)
                </label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setPdfFile(e.target.files[0]);
                        setPdfName(e.target.files[0].name);
                      }
                    }}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label
                    htmlFor="pdf-upload"
                    className="flex-1 border-2 border-dashed border-gray-200 rounded-lg px-4 py-3 cursor-pointer hover:border-blue-400 transition-colors flex items-center gap-2"
                  >
                    <Upload size={18} className="text-gray-400" />
                    <span className="text-gray-500">
                      {pdfName || 'Click to upload PDF...'}
                    </span>
                  </label>
                  {pdfName && (
                    <button
                      onClick={() => { setPdfFile(null); setPdfName(''); }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">LinkedIn will convert PDF to a carousel post</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Date (leave empty for tomorrow 8AM)
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock size={16} className="inline mr-1" />
                    Time
                  </label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={schedulePost}
                disabled={submitting || !content.trim()}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Calendar size={18} />
                    Schedule Post
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Scheduled Posts */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-blue-600" />
              Scheduled Posts
            </h2>

            {loading ? (
              <div className="text-center py-8 text-gray-400">
                <Loader2 size={32} className="animate-spin mx-auto" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                <p>No scheduled posts</p>
                <p className="text-sm mt-1">Create your first post above</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {posts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(post.status)}
                        <span className="text-xs text-gray-500">
                          {new Date(post.scheduled_for).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => publishNow(post.id)}
                          className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                          title="Publish Now"
                        >
                          <Send size={16} />
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-4">
                      {post.content}
                    </p>
                    {post.image_url && (
                      <p className="text-xs text-blue-500 mt-2 truncate">
                        📷 {post.image_url}
                      </p>
                    )}
                    {post.pdf_path && (
                      <p className="text-xs text-purple-500 mt-2 truncate">
                        📄 {post.pdf_path.split('/').pop()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Post History */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-green-600" />
            Post History
          </h2>

          {history.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No posts published yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b">
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Content</th>
                    <th className="pb-3 font-medium">Published</th>
                    <th className="pb-3 font-medium">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((post) => (
                    <tr key={post.id} className="border-b border-gray-50">
                      <td className="py-3">{getStatusBadge(post.status)}</td>
                      <td className="py-3 text-sm text-gray-700 max-w-md truncate">
                        {post.content}
                      </td>
                      <td className="py-3 text-sm text-gray-500">
                        {post.published_at ? new Date(post.published_at).toLocaleString() : '-'}
                      </td>
                      <td className="py-3 text-sm text-red-500">
                        {post.error_message || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
