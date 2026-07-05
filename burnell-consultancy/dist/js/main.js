// Mobile nav toggle + submenu accessibility. No framework, no third-party JS.
(function(){
  var toggle=document.querySelector('.nav-toggle');
  var nav=document.getElementById('primary-nav');
  if(toggle&&nav){
    toggle.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded',open?'true':'false');
    });
  }
  // On mobile, tapping a group heading expands its submenu.
  document.querySelectorAll('.nav-group').forEach(function(btn){
    btn.addEventListener('click',function(e){
      if(window.matchMedia('(max-width:900px)').matches){
        e.preventDefault();
        var exp=btn.getAttribute('aria-expanded')==='true';
        btn.setAttribute('aria-expanded',exp?'false':'true');
        var sub=btn.nextElementSibling;
        if(sub) sub.style.display=exp?'none':'block';
      }
    });
  });
  // Progressive-enhancement form handler: posts via fetch if a JSON endpoint is
  // wired later; otherwise falls back to the form's native action.
  document.querySelectorAll('form.lead-form').forEach(function(form){
    form.addEventListener('submit',function(){
      // No-op by default: the static build lets the browser navigate to the
      // action URL. Replace with a fetch() to your Formspark/Pages Function.
    });
  });
})();
