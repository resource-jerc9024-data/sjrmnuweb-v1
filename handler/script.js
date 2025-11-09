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

  const images = ['images/1.jpg','images/2.jpg'];
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

  // Static rendering: create a single slide with both images
  function renderStatic(){
    container.innerHTML='';
    const slide = createSlide(images);
    slide.classList.add('active');
    if(currentEl) currentEl.textContent = '1';
  }

  preload(images).then(renderStatic);
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
