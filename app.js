(() => {
 'use strict';
 const entries=window.accomplishments||[];
 const category=document.body.dataset.page;
 const search=document.querySelector('#search');
 const dialog=document.querySelector('#image-dialog');
 let activeImage=null,saved;
 try{saved=localStorage.getItem('kwaak-language')}catch(_){}
 const requested=new URLSearchParams(location.search).get('lang');
 let language=['en','ko'].includes(requested)?requested:['en','ko'].includes(saved)?saved:navigator.language.startsWith('ko')?'ko':'en';
 const t=(en,ko)=>language==='ko'?ko:en;
 const cities=[['2006','Tashkent','타슈켄트','Uzbekistan','우즈베키스탄'],['2007','Lanzhou','란저우','China','중국'],['2008','Almaty','알마티','Kazakhstan','카자흐스탄'],['2009','Pyeongtaek','평택','Republic of Korea','대한민국'],['2010','Shiraz','시라즈','Iran','이란'],['2011','Grozny','그로즈니','Russia','러시아'],['2012','Gaziantep','가지안테프','Türkiye','튀르키예'],['2013','Yeosu','여수','Republic of Korea','대한민국'],['2014','Urumqi','우루무치','China','중국'],['2015','Bursa','부르사','Türkiye','튀르키예'],['2016','Qazvin','카즈빈','Iran','이란'],['2017','Kabul','카불','Afghanistan','아프가니스탄'],['2018','Antalya','안탈리아','Türkiye','튀르키예']];
 const city=document.querySelector('#city');
 function renderCity(){
  if(!city)return;
  const selected=city.value===''?'7':city.value;
  city.replaceChildren(...cities.map((c,i)=>{const option=document.createElement('option');option.value=i;option.textContent=c[0]+' · '+t(c[1],c[2]);return option}));
  city.value=selected;const c=cities[Number(selected)];
  const cityImage=document.querySelector('#city-image');if(cityImage){cityImage.src='website/assets/reference-'+[34,33,32,31,30,29,37,40,38,27,41,39,28][Number(selected)]+'.jpg';cityImage.alt=t(c[1]+' — WCO host-city archive',c[2]+' — WCO 개최도시 기록');}
  document.querySelector('#city-year').textContent=c[0]+' / '+t('SILK ROAD MAYORS FORUM','실크로드 시장단 포럼');
  document.querySelector('#city-name').textContent=t(c[1],c[2]);
  document.querySelector('#city-country').textContent=t(c[3],c[4]);
  document.querySelector('#city-description').textContent=c[1]==='Yeosu'?t('Following the city’s 2012 Expo, Yeosu hosted the 2013 forum, continuing its place in an international network of cities.','2012년 엑스포에 이어 여수는 2013년 포럼을 개최하며 국제 도시 네트워크 속 교류를 이어갔습니다.'):t(`${c[1]} hosted the ${c[0]} forum in WCO’s documented sequence of exchange among Silk Road cities.`, `WCO의 실크로드 도시 교류 기록에 따르면 ${c[2]}에서 ${c[0]}년 포럼이 개최되었습니다.`);
 }
 function filterStories(){
  if(!search)return;
  const query=search.value.trim().toLocaleLowerCase();let count=0;
  document.querySelectorAll('.editorial-story').forEach(article=>{const s=entries.find(s=>s.id===Number(article.dataset.storyId));const haystack=[s.title,s.summary,s.role,s.body,s.year,s.tag,...Object.values(s.ko)].join(' ').toLocaleLowerCase();article.hidden=!haystack.includes(query);if(!article.hidden)count++});
  const total=entries.filter(s=>s.category===category).length;
  document.querySelector('#result-count').textContent=t(`${count} of ${total} selected stories`, `선별된 이야기 ${total}개 중 ${count}개`);
  document.querySelector('#empty').hidden=count!==0;
 }
 function updateImage(){if(!activeImage)return;const caption=t(activeImage.dataset.captionEn,activeImage.dataset.captionKo);const image=document.querySelector('#enlarged-image');image.src='website/assets/'+activeImage.dataset.image;image.alt=caption;document.querySelector('#image-caption').textContent=caption;}
 function setLanguage(next){
  language=next;document.documentElement.lang=language;
  try{localStorage.setItem('kwaak-language',language)}catch(_){}
  try{const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url)}catch(_){}
  document.querySelectorAll('[data-en][data-ko]').forEach(n=>n.textContent=n.dataset[language]);
  document.querySelectorAll('[data-alt-en]').forEach(n=>n.alt=t(n.dataset.altEn,n.dataset.altKo));
  document.querySelectorAll('[data-aria-en]').forEach(n=>n.setAttribute('aria-label',t(n.dataset.ariaEn,n.dataset.ariaKo)));
  document.querySelectorAll('[data-placeholder-en]').forEach(n=>n.placeholder=t(n.dataset.placeholderEn,n.dataset.placeholderKo));
  document.querySelectorAll('[data-lang]').forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.lang===language)));
  document.querySelectorAll('a[href]').forEach(a=>{const raw=a.getAttribute('href');if(/^(index|person|nation|world)\.html(?:[?#]|$)/.test(raw)){const u=new URL(raw,location.href);u.searchParams.set('lang',language);a.setAttribute('href',u.pathname.split('/').pop()+u.search+u.hash)}});
  document.querySelector('meta[name="description"]').content=t('Discover Kwaak YoungHoon’s life, national projects and international peace work through selected stories and original images.','주요 이야기와 기록 이미지로 곽영훈의 삶, 국가 프로젝트, 국제 평화활동을 만나보세요.');
  filterStories();renderCity();updateImage();
 }
 document.addEventListener('click',event=>{
  const lang=event.target.closest('[data-lang]');if(lang)setLanguage(lang.dataset.lang);
  const zoom=event.target.closest('[data-image]');if(zoom&&dialog){activeImage=zoom;updateImage();dialog.showModal();document.body.style.overflow='hidden'}
  const jump=event.target.closest('a[href^="#story-"]');if(jump&&search){search.value='';filterStories()}
 });
 search?.addEventListener('input',filterStories);
 document.querySelector('#reset')?.addEventListener('click',()=>{search.value='';filterStories();search.focus()});
 city?.addEventListener('change',renderCity);
 document.querySelector('.close')?.addEventListener('click',()=>dialog.close());
 dialog?.addEventListener('close',()=>{document.body.style.overflow='';activeImage=null});
 dialog?.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close()}});
 const menu=document.querySelector('.menu'),nav=document.querySelector('#navigation');
 function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
 nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus()}});
 window.addEventListener('pageshow',()=>{const l=new URLSearchParams(location.search).get('lang');if(['en','ko'].includes(l)&&l!==language)setLanguage(l)});
 setLanguage(language);
})();
