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
