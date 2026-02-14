import { useState } from 'react';

/**
 * 渐进式图片加载组件
 * 支持 AVIF > WebP > JPG 的回退机制
 *
 * @param {string} imagePath - 不带扩展名的图片路径
 * @param {string} alt - 图片描述
 * @param {string} className - CSS 类名
 * @param {object} rest - 其他 HTML img 属性
 */
function PictureImage({ imagePath, alt, className = '', ...rest }) {
  // 移除可能的扩展名，统一处理
  const cleanPath = imagePath.replace(/\.(jpg|jpeg|png|webp|avif)$/i, '');

  return (
    <picture>
      <source srcSet={`${cleanPath}.avif`} type="image/avif" />
      <source srcSet={`${cleanPath}.webp`} type="image/webp" />
      <img
        src={`${cleanPath}.jpg`}
        alt={alt}
        className={className}
        {...rest}
      />
    </picture>
  );
}

export default PictureImage;
