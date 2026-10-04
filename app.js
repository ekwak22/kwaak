(() => {
  'use strict';
  const entries = window.accomplishments || [];
  const page = document.body.dataset.page;
  const grid = document.querySelector('#story-grid');
  const search = document.querySelector('#search');
  const dialog = document.querySelector('#story-dialog');
  let limit = 9;
  let activeStory = null;
  let savedLanguage;
  try { savedLanguage = localStorage.getItem('kwaak-language'); } catch (_) {}
  const queryLanguage = new URLSearchParams(location.search).get('lang');
  let language = ['en', 'ko'].includes(queryLanguage) ? queryLanguage : ['en', 'ko'].includes(savedLanguage) ? savedLanguage : navigator.language.startsWith('ko') ? 'ko' : 'en';
  const t = (en, ko) => language === 'ko' ? ko : en;
  const escape = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const localized = story => language === 'ko' ? { ...story, ...story.ko } : story;
  const categoryName = category => ({person:t('The Person','인물'), nation:t('The Nation','국가'), global:t('The World','세계')})[category];
  const cities = [
    ['2006','Tashkent','타슈켄트','Uzbekistan','우즈베키스탄'],
    ['2007','Lanzhou','란저우','China','중국'],
    ['2008','Almaty','알마티','Kazakhstan','카자흐스탄'],
    ['2009','Pyeongtaek','평택','Republic of Korea','대한민국'],
    ['2010','Shiraz','시라즈','Iran','이란'],
    ['2011','Grozny','그로즈니','Russia','러시아'],
    ['2012','Gaziantep','가지안테프','Türkiye','튀르키예'],
    ['2013','Yeosu','여수','Republic of Korea','대한민국'],
    ['2014','Urumqi','우루무치','China','중국'],
    ['2015','Bursa','부르사','Türkiye','튀르키예'],
    ['2016','Qazvin','카즈빈','Iran','이란'],
    ['2017','Kabul','카불','Afghanistan','아프가니스탄'],
    ['2018','Antalya','안탈리아','Türkiye','튀르키예']
  ];
  const city = document.querySelector('#city');
  function renderCity() {
    if (!city) return;
    const selected = city.value === '' ? '7' : city.value;
    city.replaceChildren(...cities.map((c, i) => { const option = document.createElement('option'); option.value = i; option.textContent = `${c[0]} · ${t(c[1], c[2])}`; return option; }));
    city.value = selected;
    const c = cities[Number(selected)];
    document.querySelector('#city-year').textContent = c[0] + ' / ' + t('SILK ROAD MAYORS FORUM', '실크로드 시장단 포럼');
    document.querySelector('#city-name').textContent = t(c[1], c[2]);
    document.querySelector('#city-country').textContent = t(c[3], c[4]);
    document.querySelector('#city-description').textContent = c[1] === 'Yeosu'
      ? t('Following the city’s 2012 Expo, Yeosu hosted the 2013 forum, continuing its place in an international network of cities.', '2012년 엑스포에 이어 여수는 2013년 포럼을 개최하며 국제 도시 네트워크 속 교류를 이어갔습니다.')
      : t(`${c[1]} is documented as a ${c[0]} forum host in WCO’s record of exchange among cities along the Silk Road.`, `WCO의 실크로드 도시 교류 기록에 따르면 ${c[2]}에서 ${c[0]}년 포럼이 개최되었습니다.`);
  }
  function renderStories() {
    if (!grid) return;
    const query = search.value.trim().toLocaleLowerCase();
    const filtered = entries.map((story, id) => ({ ...story, id })).filter(story => story.category === page && [story.title,story.summary,story.body,story.year,story.tag,...Object.values(story.ko)].join(' ').toLocaleLowerCase().includes(query));
    grid.replaceChildren(...filtered.slice(0, limit).map(story => {
      const s = localized(story);
      const article = document.createElement('article'); article.className = 'story-card';
      article.innerHTML = `<button data-story="${story.id}"><img loading="lazy" src="website/assets/${escape(s.image)}" alt="${escape(t('Archival illustration: ', '기록 이미지: ') + s.title)}"><span class="card-copy"><span class="card-meta">${escape(s.year)} · ${escape(s.tag)}</span><h3>${escape(s.title)}</h3><p>${escape(s.summary)}</p><span class="card-link">${t('Explore the story ↗','이야기 보기 ↗')}</span></span></button>`;
      return article;
    }));
    document.querySelector('#result-count').textContent = t(`${filtered.length} ${filtered.length === 1 ? 'story' : 'stories'} · ${categoryName(page)}`, `${categoryName(page)} · 이야기 ${filtered.length}개`);
    document.querySelector('#empty').hidden = filtered.length > 0;
    document.querySelector('#load-more').hidden = filtered.length <= limit;
  }
  function updateStory() {
    if (activeStory === null || !dialog) return;
    const s = localized(entries[activeStory]);
    document.querySelector('#dialog-title').textContent = s.title;
    document.querySelector('#dialog-meta').textContent = `${s.year} / ${categoryName(s.category)} / ${s.tag}`;
    document.querySelector('#dialog-body').textContent = s.body;
    const image = document.querySelector('#dialog-image');
    image.src = 'website/assets/' + s.image;
    image.alt = t('Archival illustration: ', '기록 이미지: ') + s.title;
    const source = document.querySelector('#dialog-source');
    source.href = 'website/sources/' + s.source + (s.source.endsWith('.pdf') ? '#page=' + s.page : '');
    const sourceKo = s.source === 'miracle-en.pdf' ? `『한강의 기적』 영어 원문 · ${s.page}쪽` : s.source === 'wco-presentation.pptx' ? `WCO 발표자료 · ${s.page}쪽` : '제공된 한국어 약력';
    source.textContent = t('Read the source · ' + s.sourceLabel + ' ↗', '출처 읽기 · ' + sourceKo + ' ↗');
  }
  function applyLanguage(next) {
    language = next;
    document.documentElement.lang = language;
    try { localStorage.setItem('kwaak-language', language); } catch (_) {}
    try { const url = new URL(location.href); url.searchParams.set('lang', language); history.replaceState(null, '', url); } catch (_) {}
    document.querySelectorAll('[data-en][data-ko]').forEach(node => node.textContent = node.dataset[language]);
    document.querySelectorAll('[data-alt-en]').forEach(node => node.alt = language === 'ko' ? node.dataset.altKo : node.dataset.altEn);
    document.querySelectorAll('[data-aria-en]').forEach(node => node.setAttribute('aria-label', language === 'ko' ? node.dataset.ariaKo : node.dataset.ariaEn));
    document.querySelectorAll('[data-placeholder-en]').forEach(node => node.placeholder = language === 'ko' ? node.dataset.placeholderKo : node.dataset.placeholderEn);
    document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === language)));
    document.querySelectorAll('a[href]').forEach(anchor => {
      const raw = anchor.getAttribute('href');
      if (/^(index|person|nation|world)\.html(?:[?#]|$)/.test(raw)) {
        const url = new URL(raw, location.href); url.searchParams.set('lang', language);
        anchor.setAttribute('href', url.pathname.split('/').pop() + url.search + url.hash);
      }
    });
    document.querySelector('meta[name="description"]').content = t('Explore the life, national vision and international work of Kwaak YoungHoon in English and Korean.', '곽영훈의 삶과 철학, 국가 비전과 국제활동을 영어와 한국어로 만나보세요.');
    renderStories(); renderCity(); updateStory();
  }
  document.addEventListener('click', event => {
    const languageButton = event.target.closest('[data-lang]');
    if (languageButton) { const activeId = document.activeElement?.closest('[data-story]')?.dataset.story; applyLanguage(languageButton.dataset.lang); }
    const storyButton = event.target.closest('[data-story]');
    if (storyButton && dialog) { activeStory = Number(storyButton.dataset.story); updateStory(); dialog.showModal(); document.body.style.overflow = 'hidden'; }
  });
  search?.addEventListener('input', () => { limit = 9; renderStories(); });
  document.querySelector('#load-more')?.addEventListener('click', () => { const previous = grid.children.length; limit += 9; renderStories(); grid.children[previous]?.querySelector('button').focus({preventScroll:true}); });
  document.querySelector('#reset')?.addEventListener('click', () => { search.value = ''; limit = 9; renderStories(); search.focus(); });
  city?.addEventListener('change', renderCity);
  document.querySelector('.close')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('close', () => { document.body.style.overflow = ''; activeStory = null; });
  dialog?.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
  const menu = document.querySelector('.menu'), nav = document.querySelector('nav');
  function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); }
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
  window.addEventListener('pageshow', () => { const requested = new URLSearchParams(location.search).get('lang'); if (['en','ko'].includes(requested) && requested !== language) applyLanguage(requested); });
  applyLanguage(language);
})();
