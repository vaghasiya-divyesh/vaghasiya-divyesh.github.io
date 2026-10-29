/* Progressive enhancements. All research, papers, contact details and CV work without JavaScript. */
(() => {
  'use strict';
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.hidden = false;
    document.documentElement.classList.add('has-menu');
    const closeMenu = () => { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); } });
    document.addEventListener('click', e => { if (!e.target.closest('.site-header')) closeMenu(); });
  }
  document.querySelectorAll('[data-print]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => window.print());
  });
  const filters = document.querySelector('.publication-filters');
  const papers = [...document.querySelectorAll('[data-publication]')];
  const applyFilter = filter => {
    let count = 0;
    papers.forEach(p => { p.hidden = filter !== 'all' && p.dataset.publication !== filter; if (!p.hidden) count++; });
    filters?.querySelectorAll('[data-filter]').forEach(b => { const active = b.dataset.filter === filter; b.setAttribute('aria-pressed', String(active)); b.classList.toggle('is-active', active); });
    const status = document.querySelector('#filter-status');
    if (status) status.textContent = `Showing ${count} ${filter === 'all' ? 'publications' : filter === 'journal' ? 'journal articles' : 'preprint'}.`;
  };
  if (filters && papers.length) {
    filters.hidden = false;
    filters.addEventListener('click', e => { const b = e.target.closest('[data-filter]'); if (b) applyFilter(b.dataset.filter); });
    // A research link must still reveal its paper after a visitor has selected another filter.
    const revealTarget = () => { if (papers.some(p => `#${p.id}` === window.location.hash)) applyFilter('all'); };
    window.addEventListener('hashchange', revealTarget);
    revealTarget();
  }
  const controls = document.querySelector('.demo-controls');
  if (controls) {
    controls.hidden = false;
    let values = [2, 4, 4];
    let missing = null;
    const cells = [0, 1, 2].map(n => document.getElementById(`value-${n}`));
    const result = document.getElementById('demo-result');
    const recover = document.getElementById('recover-symbol');
    const eraseButtons = [...document.querySelectorAll('[data-erase]')];
    const render = () => {
      cells.forEach((cell, i) => { cell.textContent = i === missing ? '?' : values[i]; cell.classList.toggle('is-missing', i === missing); cell.classList.remove('is-recovered'); });
      eraseButtons.forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.erase) === missing)));
      recover.disabled = missing === null;
    };
    eraseButtons.forEach(b => b.addEventListener('click', () => {
      missing = Number(b.dataset.erase); render();
      result.textContent = `Symbol ${'abc'[missing]} is missing. Use the two visible values to recover it.`;
    }));
    recover.addEventListener('click', () => {
      if (missing === null) return;
      const index = missing;
      const known = values.filter((_, i) => i !== index);
      const recovered = ((-known[0] - known[1]) % 5 + 5) % 5;
      values[index] = recovered;
      missing = null; render(); cells[index].classList.add('is-recovered');
      result.textContent = `${'abc'[index]} = −(${known[0]} + ${known[1]}) ≡ ${recovered} (mod 5). The missing symbol is recovered.`;
    });
    document.getElementById('new-example').addEventListener('click', () => {
      const a = Math.floor(Math.random() * 5), b = Math.floor(Math.random() * 5);
      values = [a, b, (5 - (a + b) % 5) % 5]; missing = null; render();
      result.textContent = 'A new group of three values. Choose a symbol to erase.';
    });
  }
})();
