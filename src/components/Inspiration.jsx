const Inspiration = () => {
  const images = [
    { img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400', title: 'Summer Vibes' },
    { img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400', title: 'Street Style' },
    { img: 'https://images.unsplash.com/photo-1529139574466-a302d27f6054?w=400', title: 'Casual Work' },
    { img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400', title: 'Weekend' },
  ];

  return (
    <div className="px-5">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
        <span className="text-red-500 mr-2">📌</span> Style Inspirations
      </h3>
      
      <div className="columns-2 gap-3 space-y-3">
        {images.map((item, i) => (
          <div key={i} className="break-inside-avoid rounded-xl overflow-hidden shadow-sm bg-white">
            <img src={item.img} className="w-full object-cover" alt="Fashion" />
            <div className="p-3">
              <p className="text-xs font-bold text-gray-700">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inspiration;