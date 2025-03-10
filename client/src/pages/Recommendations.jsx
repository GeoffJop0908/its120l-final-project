import React from 'react';
import useRecommendationStore from '../store/recommendationStore';

export default function Recommendations() {
  const recommendations = useRecommendationStore(
    (state) => state.recommendations
  );

  return (
    <div className="bg-none flex items-center justify-center text-white h-[60%] flex-col">
      <div className="overflow-auto">
        <ul className="list bg-base-100 rounded-box shadow-md w-80">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
            Recommendations
          </li>
          {recommendations.map((product, i) => (
            <li className="list-row" key={i}>
              <div>
                <div>{product.name}</div>
                <div className="text-xs uppercase font-semibold opacity-60 line-clamp-1">
                  {product.description || 'No description available'}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
