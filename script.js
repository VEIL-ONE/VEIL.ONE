// Minimal behaviour: keep UX polished and non-committal.
// Button intentionally does not "release" anything — it shows an elegant toast.
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('issuedButton');
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    // micro animation
    btn.animate([
      { transform: 'translateY(0)' },
      { transform: 'translateY(-6px)' },
      { transform: 'translateY(0)' }
    ], { duration: 380, easing: 'cubic-bezier(.2,.9,.2,1)' });

    // subtle transient toast
    const toast = document.createElement('div');
    toast.className = 'v-toast';
    toast.textContent = 'Status: Issued — not released';
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 360);
    }, 1800);
  });
});

/* Inline toast styles so we don't require extra files */
const style = document.createElement('style');
style.textContent = `
.v-toast{
  position:fixed;
  left:50%;
  bottom:6vh;
  transform:translateX(-50%);
  background:rgba(15,17,19,0.9);
  color:#e6eef2;
  padding:10px 18px;
  border-radius:999px;
  font-weight:600;
  font-size:13px;
  border:1px solid rgba(255,255,255,0.04);
  opacity:1;
  transition:opacity .36s ease, transform .36s;
  z-index:9999;
  box-shadow: 0 12px 40px rgba(2,6,23,0.6);
}
`;
document.head.appendChild(style);
