// ════════════════════════════════════════════════════
//  Gallery.jsx
// ════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { galleryApi } from "../api";

 const Gallery = () => {
  const [images,   setImages]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [category, setCategory] = useState("");
  const [lightbox, setLightbox] = useState(null);

  const CATS = ["", "conference", "workshop", "ceremony", "exhibition", "general"];

  useEffect(() => {
    setLoading(true);
    galleryApi.getAll({ category, limit: 20 })
      .then((res) => setImages(res.data.data?.images || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-dark-2 pt-24 pb-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-white mb-2">Event Gallery</h1>
        <p className="text-gray-400 text-sm">Moments captured from our global medical conferences</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category filter */}
        <div className="flex gap-2 flex-wrap justify-center mb-10">
          {CATS.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-5 py-2 rounded-full text-xs font-medium capitalize transition-all border ${
                category === c
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-600 border-gray-200 hover:border-primary"
              }`}>
              {c || "All"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img._id} onClick={() => setLightbox(img)}
                className="gallery-item relative rounded-xl overflow-hidden h-48 cursor-pointer group">
                <img src={img.imageUrl} alt={img.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="gallery-overlay absolute inset-0 bg-black bg-opacity-50 opacity-0 transition-opacity flex items-end p-3">
                  <p className="text-white text-xs">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <div className="max-w-3xl w-full">
            <img src={lightbox.imageUrl} alt={lightbox.caption} className="w-full rounded-xl" />
            {lightbox.caption && <p className="text-white text-center mt-3 text-sm">{lightbox.caption}</p>}
          </div>
        </div>
      )}
    </div>
  );
};
export default Gallery;