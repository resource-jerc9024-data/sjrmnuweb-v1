(function(){
  const form = document.getElementById('registrationForm');
  if(!form) return;

  function invalidate(el, msg){
    el.setCustomValidity(msg || '');
    el.reportValidity();
  }

  form.addEventListener('input', (e)=>{
    const t = e.target;
    if(t.name === 'phone'){
      const v = t.value.replace(/\D/g,'');
      if(v.length && !/^\d{10}$/.test(v)) invalidate(t, 'Enter 10 digit number');
      else invalidate(t, '');
    } else if(t.name === 'email'){
      if(t.validity.typeMismatch) invalidate(t, 'Enter a valid email');
      else invalidate(t, '');
    } else {
      invalidate(t, '');
    }
  });

  form.addEventListener('submit', (e)=>{
    // Intentionally left blank: Firestore submission is handled in index.html module script
    // Keep this listener no-op to avoid duplicate handling or blocking default logic
  });
})();

// Set dynamic year in footer credits
(function(){
  const y = document.getElementById('currentYear');
  if(y) y.textContent = new Date().getFullYear();
})();

// Scroll sequence (lightweight, no external deps)
(function(){
  const hero = document.querySelector('.scroll-section');
  const container = document.getElementById('imageContainer');
  if(!hero || !container) return;

  const images = ['images/3.jpg','images/1.jpg','images/2.jpg'];
  const counterEl = document.querySelector('.image-counter');
  const currentEl = document.getElementById('currentImage');
  const totalEl = document.getElementById('totalImages');
  const progressBar = document.querySelector('.progress-bar');
  const contentSection = document.querySelector('.form-wrap');

  if(totalEl) totalEl.textContent = images.length;

  function preload(srcs){
    return Promise.all(srcs.map(src=>new Promise(res=>{const i=new Image();i.onload=()=>res();i.onerror=()=>res();i.src=src;})));
  }

  function createSlide(urls){
    const slide = document.createElement('div');
    slide.className = 'image-slide';
    urls.forEach(u=>{const img=document.createElement('img');img.src=u;img.alt='Gallery Image';slide.appendChild(img)});
    container.appendChild(slide);
    return slide;
  }

  function initLayout(){
    container.innerHTML='';
    const isDesktop = window.innerWidth >= 1024;
    const slides = [];
    if(isDesktop){
      images.forEach(u=>slides.push(createSlide([u])));
    } else {
      // Mobile: first alone, then grouped 2+3
      slides.push(createSlide([images[0]]));
      slides.push(createSlide([images[1], images[2]]));
    }
    (slides[0] && slides[0].classList.add('active'));
    return slides;
  }

  let slides = [];
  let rafId;
  function setupScroll(){
    const imageDisplayRatio = 0.8;
    const transitionRatio = 0.2;
    let lastIndex = -1;

    function loop(){
      const scrollY = window.scrollY;
      const heroTop = hero.offsetTop;
      const heroHeight = hero.offsetHeight - window.innerHeight;
      const contentTop = contentSection ? contentSection.offsetTop : Number.MAX_SAFE_INTEGER;
      const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(Math.max((scrollY - heroTop) / heroHeight, 0), 0.999);

      // progress bar (visible only during hero scroll)
      if(progressBar){
        const scrollProgress = (window.scrollY / totalScrollHeight) * 100;
        progressBar.style.width = scrollProgress + '%';
        const inHero = scrollY >= heroTop && scrollY < contentTop;
        progressBar.style.opacity = inHero ? '1' : '0';
      }

      // counter visibility
      if(counterEl){
        if(scrollY < contentTop - 100) counterEl.classList.remove('hidden');
        else counterEl.classList.add('hidden');
      }

      // index calc
      const n = slides.length;
      let index = 0, cum = 0;
      for(let i=0;i<n;i++){
        cum += imageDisplayRatio / n;
        if(progress < cum){ index = i; break; }
        if(i < n-1){
          cum += transitionRatio / (n-1);
          if(progress < cum){ index = i; break; }
        } else index = i;
      }

      if(index !== lastIndex){
        slides.forEach((s,i)=>s.classList.toggle('active', i===index));
        if(currentEl) currentEl.textContent = (index+1);
        lastIndex = index;
      }

      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
  }

  function reinit(){
    if(rafId) cancelAnimationFrame(rafId);
    slides = initLayout();
    setupScroll();
  }

  preload(images).then(()=>{
    slides = initLayout();
    setupScroll();
  });

  let t;
  window.addEventListener('resize', ()=>{clearTimeout(t); t=setTimeout(reinit, 250)});
  window.addEventListener('orientationchange', ()=>{setTimeout(reinit, 300)});
})();

// Make scroll indicator act as skip-to-form button
(function(){
  const indicator = document.querySelector('.scroll-indicator');
  const target = document.querySelector('.form-wrap');
  if(!indicator || !target) return;
  const go = ()=> target.scrollIntoView({behavior:'smooth', block:'start'});
  indicator.addEventListener('click', go);
  indicator.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      go();
    }
  });
})();
