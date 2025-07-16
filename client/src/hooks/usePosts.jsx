import { useMemo } from 'react';

export const usePosts = (posts, sort, query) => {
  // Сортировка
  const sortedPosts = useMemo(() => {
    if (sort) {
      return [...posts].sort((a, b) => a[sort].localeCompare(b[sort]));
    }
    return posts;
  }, [posts, sort]);

  // Фильтрация
  const sortedAndSearchedPosts = useMemo(() => {
    return sortedPosts.filter(post =>
      post.name.toLowerCase().includes(query.toLowerCase()) ||
      post.email.toLowerCase().includes(query.toLowerCase())
    );
  }, [sortedPosts, query]);

  return sortedAndSearchedPosts;
};