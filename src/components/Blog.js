import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [posts] = useState([
    {
      id: 1,
      title: '10 Dicas Para Manter Sua Casa Sempre Limpa',
      excerpt: 'Descubra métodos simples e eficazes para manter sua casa organizada e limpa no dia a dia, sem muito esforço.',
      content: `
        <p>Manter a casa limpa não precisa ser uma tarefa árdua. Com algumas estratégias simples, você pode ter um ambiente sempre organizado:</p>

        <h3>1. Faça um pouco todos os dias</h3>
        <p>Em vez de deixar acumular, dedique 15-20 minutos diários para pequenas tarefas de limpeza.</p>

        <h3>2. Tenha um lugar para cada coisa</h3>
        <p>Organize seus pertences de forma que cada item tenha um local específico.</p>

        <h3>3. Use produtos naturais</h3>
        <p>Vinagre, bicarbonato de sódio e limão são ótimos aliados na limpeza doméstica.</p>

        <p>Continue lendo para descobrir as outras 7 dicas essenciais!</p>
      `,
      category: 'Dicas',
      author: 'Equipe LimpaBrasil',
      date: '2024-01-20',
      image: 'https://via.placeholder.com/400x250/4F46E5/FFFFFF?text=Casa+Limpa',
      readTime: '5 min',
      tags: ['limpeza', 'organização', 'casa']
    },
    {
      id: 2,
      title: 'Como Limpar Diferentes Tipos de Piso',
      excerpt: 'Cada tipo de piso requer cuidados específicos. Aprenda as técnicas corretas para manter seus pisos impecáveis.',
      content: `
        <p>Diferentes tipos de piso exigem técnicas e produtos específicos para manter sua beleza e durabilidade:</p>

        <h3>Piso Cerâmico</h3>
        <p>Use detergente neutro e evite produtos ácidos que podem danificar o rejunte.</p>

        <h3>Piso Laminado</h3>
        <p>Nunca use água em excesso. Prefira panos levemente úmidos.</p>

        <h3>Piso de Madeira</h3>
        <p>Use produtos específicos para madeira e sempre na direção das fibras.</p>
      `,
      category: 'Técnicas',
      author: 'Maria Santos',
      date: '2024-01-18',
      image: 'https://via.placeholder.com/400x250/4F46E5/FFFFFF?text=Casa+Limpa',
      readTime: '7 min',
      tags: ['pisos', 'técnicas', 'manutenção']
    },
    {
      id: 3,
      title: 'Produtos Ecológicos: Limpeza Sustentável',
      excerpt: 'Conheça alternativas ecológicas para produtos de limpeza que são eficazes e não agridem o meio ambiente.',
      content: `
        <p>A limpeza sustentável está em alta e por boas razões. Produtos ecológicos são:</p>

        <ul>
          <li>Seguros para a família e pets</li>
          <li>Biodegradáveis</li>
          <li>Eficazes na limpeza</li>
          <li>Econômicos</li>
        </ul>

        <h3>Receitas Caseiras</h3>
        <p>Bicarbonato + vinagre = Desentupidor natural</p>
        <p>Limão + sal = Remove manchas</p>
        <p>Sabão de coco + água = Limpador multiuso</p>
      `,
      category: 'Sustentabilidade',
      author: 'João Silva',
      date: '2024-01-15',
      image: 'https://via.placeholder.com/400x250/4F46E5/FFFFFF?text=Casa+Limpa',
      readTime: '6 min',
      tags: ['ecológico', 'sustentável', 'receitas']
    },
    {
      id: 4,
      title: 'Limpeza Pós-Obra: Guia Completo',
      excerpt: 'Acabou a reforma? Aprenda como fazer uma limpeza pós-obra eficiente e deixar tudo pronto para uso.',
      content: `
        <p>A limpeza pós-obra é fundamental para finalizar qualquer reforma. Veja o passo a passo:</p>

        <h3>1. Remoção de Entulho</h3>
        <p>Retire todos os restos de material de construção.</p>

        <h3>2. Aspiração de Poeira</h3>
        <p>Use aspirador profissional para remover toda a poeira fina.</p>

        <h3>3. Limpeza de Superfícies</h3>
        <p>Limpe paredes, janelas e pisos com produtos adequados.</p>
      `,
      category: 'Pós-Obra',
      author: 'Ana Costa',
      date: '2024-01-12',
      image: 'https://via.placeholder.com/400x250/4F46E5/FFFFFF?text=Casa+Limpa',
      readTime: '8 min',
      tags: ['pós-obra', 'reforma', 'limpeza profunda']
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedPost, setSelectedPost] = useState(null);

  const categories = ['Todos', 'Dicas', 'Técnicas', 'Sustentabilidade', 'Pós-Obra'];

  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, [selectedPost]);

  const filteredPosts = selectedCategory === 'Todos'
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (selectedPost) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="flex items-center text-primary-600 hover:text-primary-700 mb-8 transition-colors"
            >
              <i data-feather="arrow-left" className="w-5 h-5 mr-2"></i>
              Voltar para o blog
            </button>

            {/* Post Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedPost.category}
                </span>
                <span className="text-secondary-500 text-sm">
                  {selectedPost.readTime} de leitura
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                {selectedPost.title}
              </h1>

              <div className="flex items-center space-x-4 text-secondary-600">
                <div className="flex items-center space-x-2">
                  <i data-feather="user" className="w-4 h-4"></i>
                  <span>{selectedPost.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i data-feather="calendar" className="w-4 h-4"></i>
                  <span>{formatDate(selectedPost.date)}</span>
                </div>
              </div>
            </div>

            {/* Post Image */}
            <div className="mb-8">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            {/* Post Content */}
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
            </div>

            {/* Tags */}
            <div className="mt-8 pt-8 border-t border-secondary-200">
              <div className="flex flex-wrap gap-2">
                {selectedPost.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-secondary-100 text-secondary-600 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 bg-primary-50 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                Precisa de Ajuda Profissional?
              </h3>
              <p className="text-secondary-600 mb-6">
                Nossa equipe está pronta para cuidar da limpeza do seu ambiente!
              </p>
              <Link
                to="/agendamento"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Agendar Serviço
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Blog de <span className="text-primary-600">Limpeza</span>
          </h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Dicas, técnicas e novidades do mundo da limpeza profissional
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-secondary-600 hover:bg-primary-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <article
              key={post.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white text-primary-600 px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-4 mb-3 text-sm text-secondary-500">
                  <div className="flex items-center space-x-1">
                    <i data-feather="calendar" className="w-4 h-4"></i>
                    <span>{formatDate(post.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <i data-feather="clock" className="w-4 h-4"></i>
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-secondary-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-secondary-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-secondary-500">
                    <i data-feather="user" className="w-4 h-4"></i>
                    <span>{post.author}</span>
                  </div>

                  <div className="flex items-center text-primary-600 font-medium">
                    <span className="mr-2">Ler mais</span>
                    <i data-feather="arrow-right" className="w-4 h-4"></i>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-16 bg-white rounded-xl p-8 max-w-2xl mx-auto text-center shadow-lg">
          <h3 className="text-2xl font-bold text-secondary-900 mb-4">
            Receba Dicas Semanais
          </h3>
          <p className="text-secondary-600 mb-6">
            Inscreva-se em nossa newsletter e receba dicas exclusivas de limpeza
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Inscrever-se
            </button>
          </div>
          <p className="text-xs text-secondary-500 mt-3">
            Sem spam. Apenas conteúdo útil para você!
          </p>
        </div>
      </div>
    </section>
  );
};

export default Blog;