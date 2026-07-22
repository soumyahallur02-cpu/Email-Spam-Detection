document.addEventListener('DOMContentLoaded', () => {
  const card = document.querySelector('.prediction-card');

  card.animate(
    [
      { opacity: 0, transform: 'translateY(30px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
    {
      duration: 800,
      easing: 'ease-out',
    },
  );
});
