import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import urlToTitleMap from './urlToTitleMap.json'

const urlToTitle = (url) => urlToTitleMap[url] || null;

const BreadcrumbsItem = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
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
