
const elementos = document.querySelectorAll(".scroll-left, .scroll-left2, .scroll-right, .scroll-right2, .scroll-top, .scroll-top2, .scroll-bottom, .scroll-bottom2, .scroll-escala, .scroll-txt, .perspectivax");
function fadeScroll() {
  const alturaJanela = window.innerHeight;

  elementos.forEach(elemento => {
    const elementoTop = elemento.getBoundingClientRect().top;
    if (elementoTop < alturaJanela * 0.85) {
      elemento.classList.add("ativo7");
    } else {
      elemento.classList.remove("ativo7");
    }
  });
}
fadeScroll();
window.addEventListener("scroll", fadeScroll);
