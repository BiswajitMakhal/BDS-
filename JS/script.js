var reduceMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;


/* ---------- LOADER ---------- */

(function(){
  var loader = document.getElementById('loader');
  var start = Date.now();
  var minShow = 650;

  function hide(){
    var elapsed = Date.now() - start;
    var wait = Math.max(0, minShow - elapsed);

    setTimeout(function(){
      loader.classList.add('is-hidden');
      document.body.classList.remove('is-loading');

      setTimeout(function(){
        if (loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 700);

    }, wait);
  }

  window.addEventListener('load', hide);

  setTimeout(hide, 4000);
})();


/* ---------- HEADER SCROLL STATE ---------- */

var header = document.getElementById('siteHeader');

window.addEventListener('scroll', function(){

  header.classList.toggle(
    'is-scrolled',
    window.scrollY > 40
  );

}, {
  passive:true
});


/* ---------- CURSOR GLOW ---------- */

var glow = document.getElementById('cursorGlow');

if (
  glow &&
  window.matchMedia('(pointer:fine)').matches &&
  !reduceMotion
) {

  var raf = null;
  var gx = 0;
  var gy = 0;

  window.addEventListener('mousemove', function(e){

    gx = e.clientX;
    gy = e.clientY;

    glow.style.opacity = '1';

    if (!raf) {

      raf = requestAnimationFrame(function(){

        glow.style.transform =
          'translate3d(' +
          gx +
          'px,' +
          gy +
          'px,0) translate3d(-50%,-50%,0)';

        raf = null;
      });

    }

  }, {
    passive:true
  });
}


/* ---------- HERO SLIDER ---------- */

(function(){

  var slider = document.getElementById('heroSlider');

  if (!slider) {
    return;
  }

  var slides = Array.prototype.slice.call(
    slider.querySelectorAll('.hero-slide')
  );

  var dots = Array.prototype.slice.call(
    document.querySelectorAll('.hero-dot')
  );

  if (slides.length < 2) {
    return;
  }

  var current = Math.max(
    0,
    slides.findIndex(function(s){
      return s.classList.contains('is-active');
    })
  );

  var timer = null;
  var intervalMs = 4500;

  function show(index){

    var next = (index + slides.length) % slides.length;

    if (next === current) {
      return;
    }

    slides[current].classList.remove('is-active');

    if (dots[current]) {
      dots[current].classList.remove('is-active');
    }

    current = next;

    slides[current].classList.add('is-active');

    if (dots[current]) {
      dots[current].classList.add('is-active');
    }
  }

  function goNext(){
    show(current + 1);
  }

  function stop(){

    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function start(){

    stop();

    if (reduceMotion) {
      return;
    }

    timer = setInterval(goNext, intervalMs);
  }

  dots.forEach(function(dot){

    dot.addEventListener('click', function(){

      var idx = parseInt(dot.dataset.slide, 10);

      if (!isNaN(idx)) {
        show(idx);
      }

      start();
    });

  });

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);


  /* basic touch swipe support */

  var touchStartX = null;

  slider.addEventListener('touchstart', function(e){

    touchStartX = e.changedTouches[0].clientX;
    stop();

  }, {
    passive:true
  });

  slider.addEventListener('touchend', function(e){

    if (touchStartX === null) {
      start();
      return;
    }

    var dx = e.changedTouches[0].clientX - touchStartX;

    if (Math.abs(dx) > 40) {

      if (dx < 0) {
        show(current + 1);
      } else {
        show(current - 1);
      }

    }

    touchStartX = null;

    start();

  }, {
    passive:true
  });


  start();

})();


/* ---------- MENU TABS ---------- */

var tabs = document.querySelectorAll('.menu-tab');
var panels = document.querySelectorAll('.menu-panel');

tabs.forEach(function(tab){

  tab.addEventListener('click', function(){

    tabs.forEach(function(t){
      t.classList.remove('active');
    });

    panels.forEach(function(p){
      p.classList.remove('active');
    });

    tab.classList.add('active');

    document
      .getElementById(tab.dataset.tab)
      .classList.add('active');

   var scroller = document.getElementById('menuTabs');
var target = tab.offsetLeft - (scroller.clientWidth - tab.offsetWidth) / 2;

scroller.scrollTo({
  left: target,
  behavior: 'smooth'
});

  });

});


/* ---------- COPY UPI ID ---------- */

var copyBtn = document.getElementById('copyBtn');
var toast = document.getElementById('toast');
var toastTimer = null;

copyBtn.addEventListener('click', function(){

  var text = document
    .getElementById('upiId')
    .textContent
    .trim();

  function showToast(msg){

    toast.textContent = msg;

    toast.classList.add('show');

    copyBtn.classList.add('copied');

    copyBtn.textContent = 'Copied';

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function(){

      toast.classList.remove('show');

      copyBtn.classList.remove('copied');

      copyBtn.textContent = 'Copy';

    }, 1800);
  }


  if (
    navigator.clipboard &&
    navigator.clipboard.writeText
  ) {

    navigator.clipboard
      .writeText(text)
      .then(function(){

        showToast('UPI ID copied');

      })
      .catch(function(){

        showToast(
          'Copy failed — long press to copy'
        );

      });

  } else {

    var ta = document.createElement('textarea');

    ta.value = text;

    ta.style.position = 'fixed';
    ta.style.opacity = '0';

    document.body.appendChild(ta);

    ta.focus();
    ta.select();

    try {

      document.execCommand('copy');

      showToast('UPI ID copied');

    } catch(e) {

      showToast(
        'Copy failed — long press to copy'
      );

    }

    document.body.removeChild(ta);
  }

});


/* ---------- SCROLL REVEAL ---------- */

var revealEls = document.querySelectorAll('.reveal');

if (
  reduceMotion ||
  !('IntersectionObserver' in window)
) {

  revealEls.forEach(function(el){
    el.classList.add('in-view');
  });

} else {

  var io = new IntersectionObserver(
    function(entries){

      entries.forEach(function(entry){

        if (entry.isIntersecting){

          entry.target.classList.add(
            'in-view'
          );

          io.unobserve(entry.target);
        }

      });

    },
    {
      threshold:0.15
    }
  );

  revealEls.forEach(function(el){
    io.observe(el);
  });

}


/* ---------- BOTTOM TAB BAR SCROLLSPY ---------- */

var tabItems = document.querySelectorAll('.tab-item');

var sectionIds = [
  'home',
  'menu',
  'story',
  'review',
  'pay'
];

var sections = sectionIds
  .map(function(id){
    return document.getElementById(id);
  })
  .filter(Boolean);


function setActiveTab(id){

  tabItems.forEach(function(t){

    t.classList.toggle(
      'active',
      t.dataset.section === id
    );

  });

}


function currentSectionId(){

  var probe = window.innerHeight * 0.35;

  var current = sections[0];

  for (
    var i = 0;
    i < sections.length;
    i++
  ){

    if (
      sections[i].getBoundingClientRect().top -
      probe <=
      0
    ){

      current = sections[i];

    }

  }


  var doc = document.documentElement;

  if (
    window.innerHeight +
    window.scrollY >=
    doc.scrollHeight - 4
  ){

    current =
      sections[sections.length - 1];

  }

  return current
    ? current.id
    : null;
}


var spyTicking = false;

function onScrollSpy(){

  if (spyTicking) {
    return;
  }

  spyTicking = true;

  requestAnimationFrame(function(){

    var id = currentSectionId();

    if (id) {
      setActiveTab(id);
    }

    spyTicking = false;

  });

}


if (sections.length){

  window.addEventListener(
    'scroll',
    onScrollSpy,
    {
      passive:true
    }
  );

  window.addEventListener(
    'resize',
    onScrollSpy
  );

  onScrollSpy();
}


/* ---------- INSTANT TAB FEEDBACK ---------- */

document
  .querySelectorAll(
    '.tab-item, nav.links a, .brand'
  )
  .forEach(function(link){

    link.addEventListener(
      'click',
      function(){

        var href =
          link.getAttribute('href') || '';

        if (
          href.charAt(0) === '#'
        ){

          setActiveTab(
            href.slice(1)
          );

        }

      }
    );

  });