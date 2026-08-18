import React from 'react';
import { Carousel } from 'antd';

export const CultureCarousel: React.FC<any> = ({ items }) => (
  <div className="rounded-xl overflow-hidden shadow-md">
    <Carousel autoplay>
      {items.map((item: any) => (
        <div key={item.id} className="relative h-64">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="text-sm opacity-90">{item.description}</p>
          </div>
        </div>
      ))}
    </Carousel>
  </div>
);
