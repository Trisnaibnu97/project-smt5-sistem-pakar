import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Komponen Logo Rumah Sahabat — SDIT Ummul Quro Bogor
 * 
 * PANDUAN MENGGANTI LOGO:
 * 1. Jika Anda memiliki file logo sendiri (misalnya format .png, .jpg, atau .svg),
 *    cukup letakkan file tersebut di folder:
 *    frontend/public/logo.png (atau frontend/public/logo.svg)
 * 2. Komponen ini otomatis memprioritaskan file `/logo.png` atau `/logo.svg`.
 * 3. Jika file gambar belum diganti, komponen akan menampilkan icon default Rumah Sahabat.
 */
export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl',
  };

  return (
    <div className={`overflow-hidden flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
      <img
        src="/logo.png"
        alt="Logo Rumah Sahabat"
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback visual jika file gagal dimuat
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};
