import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./CSS/NewNav.css"; // Ensure your CSS has .pulse animation

function Logo({ hdLogo, lowResLogo }) {
  const [isHdLoaded, setIsHdLoaded] = useState(false);

  return (
    <a href="/">
      {!isHdLoaded && (
        <img
          src={lowResLogo}
          alt="DarvikFoundation (Low-res)"
          className="pulse"
          style={{ width: 'auto', height: '70px' }}
        />
      )}

      <LazyLoadImage
        src={hdLogo}
        alt="DarvikFoundation"
        effect="blur"
        afterLoad={() => setIsHdLoaded(true)}
        style={{
          width: 'auto',
          height: '70px',
          position: isHdLoaded ? 'static' : 'absolute',
          top: 0,
          left: 0,
          opacity: isHdLoaded ? 1 : 0,
        }}
      />
    </a>
  );
}

export default Logo;
