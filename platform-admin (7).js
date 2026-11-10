document.addEventListener('DOMContentLoaded', () => {

  // تفعيل أزرار التنقل داخل لوحة التحكم
  document.querySelectorAll('[data-tab]').forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.tab;

      document.querySelectorAll('.tab-content').forEach(section => {
        section.style.display = 'none';
      });

      const activeSection = document.getElementById(target);
      if (activeSection) {
        activeSection.style.display = 'block';
      }

      document.querySelectorAll('[data-tab]').forEach(btn => {
        btn.classList.remove('active');
      });

      button.classList.add('active');
    });
  });

  // إظهار أول قسم افتراضيًا
  const firstSection = document.querySelector('.tab-content');
  if (firstSection) {
    firstSection.style.display = 'block';
  }

  const firstButton = document.querySelector('[data-tab]');
  if (firstButton) {
    firstButton.classList.add('active');
  }

  // زر العودة للأعلى
  const topButton = document.getElementById('backToTop');

  if (topButton) {
    window.addEventListener('scroll', () => {
      topButton.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    topButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

});
