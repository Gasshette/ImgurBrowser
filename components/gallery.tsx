import React from 'react';
import { GalleryFilters } from './gallery-filters';
import { Post } from './post';

export const Gallery = (props: any) => {
  return (
    <>
    <GalleryFilters />
    <Post {...props} />
    </>
  )
}