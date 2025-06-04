const sliderWrapper = document.getElementById('sliderWrapper');
const slides = sliderWrapper ? sliderWrapper.querySelectorAll('img') : [];
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;

// スライドを表示する関数
function showSlide(index) {
  if (sliderWrapper) {
    sliderWrapper.style.transform = `translateX(-${index * 100}%)`;
  }
}

// ボタン操作（クリック）
if (prevBtn && nextBtn && slides.length > 0) {
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  });

  // キーボード操作（←→キー）
  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    } else if (event.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    }
  });

  // 自動切り替え：5秒ごと
  setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }, 5000);

  // 初期スライド表示
  showSlide(currentIndex);
}
