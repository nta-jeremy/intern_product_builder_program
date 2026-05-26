'use client';

import { useEffect } from 'react';

export function ClientScripts() {
  useEffect(() => {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    const saved = localStorage.getItem('yody-theme') || localStorage.getItem('theme');
    const initial = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', initial);
    toggle.textContent = initial === 'dark' ? '☀' : '☾';

    const onToggle = () => {
      const current = document.documentElement.getAttribute('data-theme')
        || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('yody-theme', next);
      toggle.textContent = next === 'dark' ? '☀' : '☾';
    };

    toggle.addEventListener('click', onToggle);
    return () => toggle.removeEventListener('click', onToggle);
  }, []);

  useEffect(() => {
    const toc = document.getElementById('toc');
    if (!toc) return;

    const links = toc.querySelectorAll('a');
    const sections: { el: Element; link: Element }[] = [];
    links.forEach((link) => {
      const id = link.getAttribute('href')?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el) sections.push({ el, link });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove('active'));
          const match = sections.find((s) => s.el === entry.target);
          if (match) {
            match.link.classList.add('active');
            if (window.innerWidth <= 1000) {
              match.link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
          }
        }
      });
    }, { rootMargin: '-10% 0px -80% 0px' });

    sections.forEach((s) => observer.observe(s.el));

    const clickHandlers: Array<() => void> = [];
    links.forEach((link) => {
      const onClick = (e: Event) => {
        e.preventDefault();
        const id = link.getAttribute('href')?.slice(1);
        if (!id) return;
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.replaceState(null, '', '#' + id);
        }
      };
      link.addEventListener('click', onClick);
      clickHandlers.push(() => link.removeEventListener('click', onClick));
    });

    return () => {
      observer.disconnect();
      clickHandlers.forEach((fn) => fn());
    };
  }, []);

  return null;
}
