import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const urlToTitle = (url) => {
  return (
    {
      '/': 'Home',
      '/basics': 'Basics',
      '/basics/vowels': 'Vowels',
      '/basics/consonants': 'Consonants',
      '/basics/consonants/review': 'Review',
      '/basics/consonants/confusion': 'Easily confused consonants',
      '/basics/tones': 'Tones',
      '/basics/tones/classes': 'Consonant classes',
      '/basics/tones/rules': 'Tone rules',
      '/practice': 'Practice',
      '/practice/full': 'Full',
      '/practice/sounds-only': 'Sounds Only',
      '/test': 'Test',
      '/test/overdue': 'Scheduled words',
      '/test/current': 'Practice words',
      '/progress': 'Progress',
      '/settings': 'Settings',
    }[url] || null
  );
};

const BreadcrumbsItem = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean); // 빈 문자열 제거
  let currentPath = '';

  return (
    <>
      {pathSegments.map((segment, index) => {
        currentPath += `/${segment}`;
        const title = urlToTitle(currentPath);

        if (!title) return null;

        const isLast = index === pathSegments.length - 1;
        return (
          <li
            key={currentPath}
            className={isLast ? 'breadcrumb-active' : undefined}
          >
            ⟫{' '}
            {isLast ? (
              <span>{title}</span>
            ) : (
              <Link to={currentPath}>{title}</Link>
            )}
          </li>
        );
      })}
    </>
  );
};

export default BreadcrumbsItem;
