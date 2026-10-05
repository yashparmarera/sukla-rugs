'use client';

import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { heroImages } from '@/components/hero/hero-images';

const SESSION_KEY = 'shukla-entry-seen';
const SLIDE_DURATION = 2200;
const ACCESS_PASSWORD = 'suklarugs20';

interface BrandEntranceProps {
  children: React.ReactNode;
}

export const BrandEntrance: React.FC<BrandEntranceProps> = ({ children }) => {
  const [isLeaving, setIsLeaving] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const hasBeenSeen = useSyncExternalStore(
    () => () => undefined,
    () => window.sessionStorage.getItem(SESSION_KEY) === 'true',
    () => false
  );
  const isVisible = !hasBeenSeen && !isDismissed;

  const moveSlide = (direction: number) => {
    setActiveImage((current) => (current + direction + heroImages.length) % heroImages.length);
  };

  useEffect(() => {
    if (!isVisible || isLeaving || activeImage === heroImages.length - 1) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveImage((current) => Math.min(current + 1, heroImages.length - 1));
    }, SLIDE_DURATION);

    return () => window.clearTimeout(timer);
  }, [activeImage, isLeaving, isVisible]);

  const enterWebsite = () => {
    window.sessionStorage.setItem(SESSION_KEY, 'true');
    setIsLeaving(true);
    window.setTimeout(() => {
      setIsDismissed(true);
      setIsLeaving(false);
    }, 850);
  };

  const revealPasswordField = () => {
    setShowPassword(true);
  };

  const submitPassword = (event: React.FormEvent) => {
    event.preventDefault();
    if (password.trim().toLowerCase() === ACCESS_PASSWORD) {
      setError(false);
      enterWebsite();
    } else {
      setError(true);
    }
  };

  return (
    <>
      {children}

      {isVisible && (
        <section
          className={`brand-entrance ${isLeaving ? 'brand-entrance--leaving' : ''}`}
          aria-label="Sukla Rugs brand entrance"
          aria-live="polite"
        >
          <div className="brand-entrance__image-stage" aria-hidden="true">
            {heroImages.map((image, index) => (
              <div
                key={image.src}
                className={`brand-entrance__image ${index === activeImage ? 'brand-entrance__image--active' : ''}`}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  priority={index === 0}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            ))}
            <div className="brand-entrance__veil" />
          </div>

          <div className="brand-entrance__content">
            <p className="brand-entrance__eyebrow">Handcrafted in Bhadohi · Designed for the world</p>
            <div className="brand-entrance__rule" />
            <p className="brand-entrance__wordmark">Sukla Rugs</p>
            <h1>Website Under Maintenance</h1>
            <p className="brand-entrance__description">
              This website is not live for the public yet. Enter the password to view the private demo.
            </p>

            {!showPassword ? (
              <button type="button" className="brand-entrance__cta" onClick={revealPasswordField} autoFocus>
                <span>Open full website</span>
                <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.5} />
              </button>
            ) : (
              <form className="brand-entrance__access" onSubmit={submitPassword}>
                <label className="brand-entrance__access-label" htmlFor="brand-entrance-password">
                  Enter access password
                </label>
                <div className="brand-entrance__access-row">
                  <input
                    id="brand-entrance-password"
                    type="password"
                    className="brand-entrance__access-input"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(false);
                    }}
                    placeholder="Password"
                    autoFocus
                    autoComplete="off"
                    aria-invalid={error}
                    aria-describedby={error ? 'brand-entrance-password-error' : undefined}
                  />
                  <button type="submit" className="brand-entrance__cta brand-entrance__cta--submit">
                    <span>Enter</span>
                    <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.5} />
                  </button>
                </div>
                {error && (
                  <p id="brand-entrance-password-error" className="brand-entrance__access-error" role="alert">
                    Incorrect password. Please try again.
                  </p>
                )}
              </form>
            )}

            <p className="brand-entrance__disclaimer">
              <span aria-hidden="true">✦</span> Going live for the public on 20 October.
            </p>
          </div>

          <div className="brand-entrance__controls" aria-label={`Image ${activeImage + 1} of ${heroImages.length}`}>
            <button type="button" className="brand-entrance__arrow" onClick={() => moveSlide(-1)} aria-label="Previous entrance image">
              <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.5} />
            </button>
            <div className="brand-entrance__progress">
            {heroImages.map((image, index) => (
              <span key={image.src} className={index <= activeImage ? 'brand-entrance__progress-item--active' : ''} />
            ))}
            </div>
            <button type="button" className="brand-entrance__arrow" onClick={() => moveSlide(1)} aria-label="Next entrance image">
              <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} />
            </button>
          </div>
        </section>
      )}
    </>
  );
};