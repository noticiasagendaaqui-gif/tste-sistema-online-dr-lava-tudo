
import React, { useState } from 'react';

const BlogManagement = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: '10 Dicas para Manter sua Casa Sempre Limpa',
      slug: '10-dicas-casa-limpa',
      author: 'Admin',
      category: 'Dicas de Limpeza',
      status: 'publicado',
      publishDate: '2024-01-20',
      views: 245,
      excerpt: 'Descubra como manter sua casa organizada e limpa com essas dicas simples...',
      content: 'Conteúdo completo do post...',
      tags: ['limpeza', 'casa', 'organização']
    },
    {
      id: 2,
      title: 'Como Remover Manchas Difíceis de Carpetes',
      slug: 'remover-manchas-carpetes',
      author: 'Admin',
      category: 'Tutoriais',
      status: 'rascunho',
      publishDate: '',
      views: 0,
      excerpt: 'Aprenda técnicas profissionais para remover as manchas mais difíceis...',
      content: 'Conteúdo completo do post...',
      tags: ['carpete', 'manchas', 'limpeza']
    }
  ]);

  const [categories, setCategories] = useState([
    'Dicas de Limpeza',
    'Tutoriais',
    'Produtos',
    'Novidades',
    'Casa e Decoração'
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterCategory, setFilterCategory] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');

  const [newPost, setNewPost] = useState({
    title: '',
    category: '',
    status: 'rascunho',
    excerpt: '',
    content: '',
    tags: ''
  });

  const filteredPosts = posts.filter(post => {
    const matchesStatus = filterStatus === 'todos' || post.status === filterStatus;
    const matchesCategory = filterCategory === 'todas' || post.category === filterCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const handleAddPost = () => {
    const post = {
      id: posts.length + 1,
      ...newPost,
      slug: newPost.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
      author: 'Admin',
      publishDate: newPost.status === 'publicado' ? new Date().toISOString().split('T')[0] : '',
      views: 0,
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    
    setPosts([...posts, post]);
    setNewPost({ title: '', category: '', status: 'rascunho', excerpt: '', content: '', tags: '' });
    setShowAddModal(false);
  };

  const handleUpdatePost = () => {
    setPosts(posts.map(post => 
      post.id === editingPost.id 
        ? { 
            ...editingPost, 
            slug: editingPost.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
            tags: typeof editingPost.tags === 'string' 
              ? editingPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
              : editingPost.tags
          }
        : post
    ));
    setEditingPost(null);
  };

  const deletePost = (postId) => {
    if (window.confirm('Tem certeza que deseja excluir este post?')) {
      setPosts(posts.filter(post => post.id !== postId));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'publicado': return 'bg-green-100 text-green-800';
      case 'rascunho': return 'bg-yellow-100 text-yellow-800';
      case 'arquivado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const PostModal = ({ post, onSave, onClose, isEdit = false }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {isEdit ? 'Editar Post' : 'Novo Post'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              value={post.title}
              onChange={(e) => isEdit 
                ? setEditingPost({...post, title: e.target.value})
                : setNewPost({...post, title: e.target.value})
              }
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                value={post.category}
                onChange={(e) => isEdit 
                  ? setEditingPost({...post, category: e.target.value})
                  : setNewPost({...post, category: e.target.value})
                }
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">Selecione...</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={post.status}
                onChange={(e) => isEdit 
                  ? setEditingPost({...post, status: e.target.value})
                  : setNewPost({...post, status: e.target.value})
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="rascunho">Rascunho</option>
                <option value="publicado">Publicado</option>
                <option value="arquivado">Arquivado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resumo</label>
            <textarea
              value={post.excerpt}
              onChange={(e) => isEdit 
                ? setEditingPost({...post, excerpt: e.target.value})
                : setNewPost({...post, excerpt: e.target.value})
              }
              className="w-full border rounded-lg px-3 py-2"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
            <textarea
              value={post.content}
              onChange={(e) => isEdit 
                ? setEditingPost({...post, content: e.target.value})
                : setNewPost({...post, content: e.target.value})
              }
              className="w-full border rounded-lg px-3 py-2"
              rows="10"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (separadas por vírgula)
            </label>
            <input
              type="text"
              value={isEdit 
                ? (Array.isArray(post.tags) ? post.tags.join(', ') : post.tags)
                : post.tags
              }
              onChange={(e) => isEdit 
                ? setEditingPost({...post, tags: e.target.value})
                : setNewPost({...post, tags: e.target.value})
              }
              className="w-full border rounded-lg px-3 py-2"
              placeholder="limpeza, casa, dicas"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {isEdit ? 'Atualizar' : 'Criar'} Post
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão do Blog</h2>
          <p className="text-gray-600 mt-1">Gerencie posts, categorias e conteúdo</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          Novo Post
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Posts</p>
              <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">📰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Publicados</p>
              <p className="text-2xl font-bold text-gray-900">{posts.filter(p => p.status === 'publicado').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-xl">📄</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rascunhos</p>
              <p className="text-2xl font-bold text-gray-900">{posts.filter(p => p.status === 'rascunho').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-purple-600 text-xl">👁️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Views</p>
              <p className="text-2xl font-bold text-gray-900">{posts.reduce((acc, p) => acc + p.views, 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Buscar posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="todos">Todos os Status</option>
            <option value="publicado">Publicado</option>
            <option value="rascunho">Rascunho</option>
            <option value="arquivado">Arquivado</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="todas">Todas as Categorias</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Posts */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{post.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{post.excerpt}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {post.category}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(post.status)}`}>
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {post.publishDate ? new Date(post.publishDate).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {post.views}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingPost(post)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPosts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum post encontrado com os filtros aplicados.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <PostModal
          post={newPost}
          onSave={handleAddPost}
          onClose={() => {
            setShowAddModal(false);
            setNewPost({ title: '', category: '', status: 'rascunho', excerpt: '', content: '', tags: '' });
          }}
        />
      )}

      {editingPost && (
        <PostModal
          post={editingPost}
          isEdit={true}
          onSave={handleUpdatePost}
          onClose={() => setEditingPost(null)}
        />
      )}
    </div>
  );
};

export default BlogManagement;
