import React, { useState, useEffect } from 'react';
import { X, Send, MessageSquare, User, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  parent_comment_id: string | null;
  user: {
    first_name: string;
    last_name: string;
    user_type: string;
  };
  replies: Comment[];
}

interface ProgramDiscussionDialogProps {
  programId: string;
  programTitle: string;
  onClose: () => void;
}

function ProgramDiscussionDialog({ programId, programTitle, onClose }: ProgramDiscussionDialogProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('program_comments')
        .select(`
          *,
          user:local_users(first_name, last_name, user_type)
        `)
        .eq('program_id', programId)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const commentsWithReplies = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: replies } = await supabase
            .from('program_comments')
            .select(`
              *,
              user:local_users(first_name, last_name, user_type)
            `)
            .eq('parent_comment_id', comment.id)
            .order('created_at', { ascending: true });

          return {
            ...comment,
            replies: replies || []
          };
        })
      );

      setComments(commentsWithReplies);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const userStr = sessionStorage.getItem('currentUser');
      if (!userStr) {
        alert('Vous devez être connecté pour commenter');
        return;
      }

      const user = JSON.parse(userStr);
      const { error } = await supabase
        .from('program_comments')
        .insert({
          program_id: programId,
          user_id: user.id,
          content: newComment.trim()
        });

      if (error) throw error;

      setNewComment('');
      await loadComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Erreur lors de la publication du commentaire');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      const userStr = sessionStorage.getItem('currentUser');
      if (!userStr) {
        alert('Vous devez être connecté pour répondre');
        return;
      }

      const user = JSON.parse(userStr);
      const { error } = await supabase
        .from('program_comments')
        .insert({
          program_id: programId,
          user_id: user.id,
          content: replyContent.trim(),
          parent_comment_id: parentId
        });

      if (error) throw error;

      setReplyContent('');
      setReplyTo(null);
      await loadComments();
    } catch (error) {
      console.error('Error posting reply:', error);
      alert('Erreur lors de la publication de la réponse');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;

    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Discussion</h2>
            <p className="text-sm text-gray-600">{programTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Chargement des commentaires...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun commentaire pour le moment</p>
              <p className="text-sm text-gray-400 mt-2">Soyez le premier à commenter</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="space-y-4">
                <div className="flex space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-gray-900">
                          {comment.user.first_name} {comment.user.last_name}
                          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                            {comment.user.user_type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(comment.created_at)}</span>
                          {comment.is_edited && <span>(modifié)</span>}
                        </div>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                    <button
                      onClick={() => setReplyTo(comment.id)}
                      className="text-sm text-[#4F6D0B] hover:text-[#4F6D0B]/80 mt-2"
                    >
                      Répondre
                    </button>

                    {replyTo === comment.id && (
                      <div className="mt-3 flex space-x-2">
                        <input
                          type="text"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Écrivez votre réponse..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                          onKeyPress={(e) => e.key === 'Enter' && handleSubmitReply(comment.id)}
                        />
                        <button
                          onClick={() => handleSubmitReply(comment.id)}
                          disabled={submitting || !replyContent.trim()}
                          className="px-4 py-2 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90 transition disabled:opacity-50"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setReplyTo(null);
                            setReplyContent('');
                          }}
                          className="px-4 py-2 text-gray-600 hover:text-gray-900"
                        >
                          Annuler
                        </button>
                      </div>
                    )}

                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-8 mt-4 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-gray-500" />
                            </div>
                            <div className="flex-1">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="font-semibold text-sm text-gray-900">
                                    {reply.user.first_name} {reply.user.last_name}
                                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                                      {reply.user.user_type}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    <span>{formatDate(reply.created_at)}</span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
            />
            <button
              onClick={handleSubmitComment}
              disabled={submitting || !newComment.trim()}
              className="px-6 py-2 bg-[#4F6D0B] text-white rounded-lg font-medium hover:bg-[#4F6D0B]/90 transition disabled:opacity-50 flex items-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>Envoyer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgramDiscussionDialog;
