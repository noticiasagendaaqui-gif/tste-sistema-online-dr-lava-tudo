
import React, { useState, useEffect } from 'react';

const BeforeAfterGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('todos');
  const [isSliding, setIsSliding] = useState({});

  const galleryData = [
    {
      id: 1,
      category: 'residencial',
      title: 'Cozinha Residencial',
      location: 'Savassi, BH',
      service: 'Limpeza Profunda',
      before: '/api/placeholder/400/300?text=Cozinha+Antes',
      after: '/api/placeholder/400/300?text=Cozinha+Depois',
      description: 'Limpeza completa de cozinha com desengorduramento de forno e fogão.'
    },
    {
      id: 2,
      category: 'comercial',
      title: 'Escritório Corporativo',
      location: 'Centro, BH',
      service: 'Limpeza Comercial',
      before: '/api/placeholder/400/300?text=Escritório+Antes',
      after: '/api/placeholder/400/300?text=Escritório+Depois',
      description: 'Limpeza semanal de escritório com 50 funcionários.'
    },
    {
      id: 3,
      category: 'pos-obra',
      title: 'Apartamento Pós-Reforma',
      location: 'Funcionários, BH',
      service: 'Limpeza Pós-Obra',
      before: '/api/placeholder/400/300?text=Apartamento+Antes',
      after: '/api/placeholder/400/300?text=Apartamento+Depois',
      description: 'Remoção completa de pó e resíduos de construção após reforma.'
    },
    {
      id: 4,
      category: 'residencial',
      title: 'Banheiro Suite',
      location: 'Lourdes, BH',
      service: 'Limpeza de Banheiro',
      before: '/api/placeholder/400/300?text=Banheiro+Antes',
      after: '/api/placeholder/400/300?text=Banheiro+Depois',
      description: 'Limpeza profunda com remoção de calcário e fungos.'
    },
    {
      id: 5,
      category: 'carpetes',
      title: 'Sala de Estar',
      location: 'Belvedere, BH',
      service: 'Higienização de Carpetes',
      before: '/api/placeholder/400/300?text=Carpete+Antes',
      after: '/api/placeholder/400/300?text=Carpete+Depois',
      description: 'Higienização profunda com remoção de manchas e ácaros.'
    },
    {
      id: 6,
      category: 'comercial',
      title: 'Loja de Roupas',
      location: 'Shopping, BH',
      service: 'Limpeza Comercial',
      before: '/api/placeholder/400/300?text=Loja+Antes',
      after: '/api/placeholder/400/300?text=Loja+Depois',
      description: 'Limpeza completa de loja com tratamento de vitrines.'
    }
  ];

  const categories = [
    { id: 'todos', name: 'Todos os Serviços', count: galleryData.length },
    { id: 'residencial', name: 'Residencial', count: galleryData.filter(item => item.category === 'residencial').length },
    { id: 'comercial', name: 'Comercial', count: galleryData.filter(item => item.category === 'comercial').length },
    { id: 'pos-obra', name: 'Pós-Obra', count: galleryData.filter(item => item.category === 'pos-obra').length },
    { id: 'carpetes', name: 'Carpetes', count: galleryData.filter(item => item.category === 'carpetes').length }
  ];

  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, [selectedImage]);

  const filteredGallery = filter === 'todos' 
    ? galleryData 
    : galleryData.filter(item => item.category === filter);

  const openModal = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const handleSlider = (imageId, position) => {
    setIsSliding(prev => ({
      ...prev,
      [imageId]: position
    }));
  };

  const BeforeAfterSlider = ({ item, showControls = true }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    };

    return (
      <div 
        className="relative overflow-hidden rounded-lg cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Before Image */}
        <img
          src={item.before}
          alt={`${item.title} - Antes`}
          className="w-full h-64 object-cover"
        />
        
        {/* After Image */}
        <div 
          className="absolute top-0 left-0 h-full overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={item.after}
            alt={`${item.title} - Depois`}
            className="w-full h-64 object-cover"
            style={{ width: `${10000 / sliderPosition}%` }}
          />
        </div>

        {/* Slider */}
        {showControls && (
          <>
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
              Antes
            </div>
            <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
              Depois
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Resultados <span className="text-primary-600">Impressionantes</span>
          </h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Veja a transformação que nossos serviços proporcionam. 
            Arraste a linha para comparar antes e depois!
          </p>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`px-6 py-3 rounded-full transition-all ${
                filter === category.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-secondary-600 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGallery.map(item => (
            <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <BeforeAfterSlider item={item} />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium">
                    {item.service}
                  </span>
                  <button
                    onClick={() => openModal(item)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <i data-feather="expand" className="w-5 h-5"></i>
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-secondary-900 mb-2">
                  {item.title}
                </h3>
                
                <div className="flex items-center space-x-2 mb-3 text-secondary-600">
                  <i data-feather="map-pin" className="w-4 h-4"></i>
                  <span className="text-sm">{item.location}</span>
                </div>
                
                <p className="text-secondary-600 text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 bg-white rounded-xl p-8 grid md:grid-cols-4 gap-6 text-center shadow-lg">
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
            <div className="text-secondary-600">Projetos Realizados</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">98%</div>
            <div className="text-secondary-600">Satisfação dos Clientes</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">24h</div>
            <div className="text-secondary-600">Tempo de Resposta</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">10+</div>
            <div className="text-secondary-600">Anos de Experiência</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-secondary-900 mb-4">
            Quer Ver Sua Casa Assim?
          </h3>
          <p className="text-secondary-600 mb-6">
            Solicite um orçamento e veja a transformação que podemos fazer!
          </p>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors">
            Solicitar Orçamento Gratuito
          </button>
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-xl font-bold">{selectedImage.title}</h3>
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-300 p-2"
              >
                <i data-feather="x" className="w-6 h-6"></i>
              </button>
            </div>
            
            <BeforeAfterSlider item={selectedImage} />
            
            <div className="mt-4 text-white text-center">
              <p className="mb-2">{selectedImage.description}</p>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <span>{selectedImage.service}</span>
                <span>•</span>
                <span>{selectedImage.location}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BeforeAfterGallery;
