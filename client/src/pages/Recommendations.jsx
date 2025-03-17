import React, { useState } from 'react';
import useRecommendationStore from '../store/recommendationStore';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import { cn } from '../../lib/utils';
import { IoCloseOutline } from 'react-icons/io5';
import { BsShop } from 'react-icons/bs';

export default function Recommendations() {
  const [pinnedIndex, setPinnedIndex] = useState(null);

  const recommendations = useRecommendationStore(
    (state) => state.recommendations
  );
  const isLoading = useRecommendationStore((state) => state.isLoading);

  return (
    <div className="bg-none flex items-center justify-center text-white flex-col w-full h-[75%] p-10">
      <motion.h1
        className="self-start text-2xl font-extrabold"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ ease: 'easeInOut' }}
      >
        Recommendations
      </motion.h1>
      <div className="overflow-auto overflow-x-hidden size-full">
        <motion.div
          initial={{ x: -1000 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 py-5"
        >
          {recommendations.map((product, i) => {
            const isPinned = pinnedIndex === i;

            return (
              <motion.div
                className={cn(' bg-sky-500 shadow-sm h-full cursor-pointer', {
                  'card ': !isPinned,
                  'fixed h-4/5 w-4/5 z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl cursor-default grid grid-cols-[30%_auto] grid-rows-1 p-5':
                    isPinned,
                })}
                key={i}
                id={i == 1 ? 'firstCard' : ''}
                initial={{ scale: 1 }}
                whileHover={{ scale: isPinned ? 1 : 1.1 }}
                onClick={!isPinned ? () => setPinnedIndex(i) : undefined}
                layout
              >
                {isPinned && (
                  <div
                    className="top-5 right-5 absolute cursor-pointer text-black"
                    onClick={() => setPinnedIndex(null)}
                  >
                    <IoCloseOutline className="size-10" />
                  </div>
                )}
                <motion.figure
                  className={cn('w-full h-40', {
                    'h-full rounded-xl overflow-hidden': isPinned,
                  })}
                  layout
                >
                  <motion.img
                    src={
                      product.images[0].hi_res ??
                      product.images[0].large ??
                      product.images[0].thumb
                    }
                    alt="Product Image"
                    initial={{ objectPosition: '0% 0%' }}
                    whileHover={{ objectPosition: '100% 100%' }}
                    className={cn('w-full h-full object-cover')}
                    layout
                  />
                </motion.figure>
                <div className={cn('card-body', { 'overflow-auto': isPinned })}>
                  <motion.h2
                    layout
                    className={cn('card-title', { 'line-clamp-2': !isPinned })}
                  >
                    {product.title}
                  </motion.h2>
                  <p
                    className={cn({
                      'line-clamp-3': !isPinned,
                      'shrink grow-0': isPinned,
                    })}
                  >
                    {product.description}
                  </p>
                  {isPinned && (
                    <>
                      <h2 className="text-xl">Other Details</h2>
                      <div className="grid grid-cols-[5.5rem_auto] row-auto gap-3">
                        <div className="card-actions w-full">
                          <div className="badge badge-outline w-full text-white">
                            {product.average_rating}
                            <FaStar className="text-yellow-300 size-5" />
                          </div>
                        </div>
                        <p className="inline-flex items-center gap-2 text-base font-bold">
                          <BsShop className="size-5" />
                          {product.store}
                        </p>
                        <div className="badge badge-outline w-22 shrink">
                          Details
                        </div>
                        <p className="inline-flex gap-3 shrink">
                          {product.details
                            ? ` ${product.details}`
                            : ' No details for this product'}
                        </p>
                        <div className="badge badge-outline w-22">Features</div>
                        <p className="inline-flex gap-3">
                          {product.features
                            ? ` ${product.features}`
                            : ' No features for this product'}
                        </p>
                      </div>
                    </>
                  )}
                  {!isPinned && (
                    <div className="card-actions justify-end inline-flex items-center">
                      <div className="badge badge-outline text-white">
                        {product.average_rating}
                        <FaStar className="text-yellow-300 size-5" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <div className="bg-sky-500 shadow-sm h-90 cursor-pointer card">
                <figure className="w-full h-40 bg-gradient-to-r from-neutral-300 to-stone-400 animate-pulse"></figure>
                <div className="card-body">
                  <motion.h2 layout className="card-title">
                    <div class="h-10 rounded bg-gradient-to-r from-neutral-300 to-stone-400 animate-pulse w-full"></div>
                  </motion.h2>
                  <p className="w-full h-full bg-gradient-to-r from-neutral-300 to-stone-400 animate-pulse rounded"></p>
                </div>
              </div>
            ))}
        </motion.div>
      </div>
    </div>
  );
}
