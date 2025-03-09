import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import BreadcrumbsItem from './BreadcrumbsItem';
import urlToTitleMap from './urlToTitleMap.json'

const urlToTitle = (url) => urlToTitleMap[url] || null;

const Breadcrumbs = () => {
  const { pathname } = useLocation();

  if (pathname === '/' || !urlToTitle(pathname)) return null;

  return (
    <div className="breadcrumbs">
      <ul className="container">
        <li>
          <Link to="/">Home</Link>
        </li>
        <BreadcrumbsItem path={pathname} />
      </ul>
    </div>
  );
};

Breadcrumbs.propTypes = {
  location: PropTypes.shape({ pathname: PropTypes.string }),
};

export default Breadcrumbs;
