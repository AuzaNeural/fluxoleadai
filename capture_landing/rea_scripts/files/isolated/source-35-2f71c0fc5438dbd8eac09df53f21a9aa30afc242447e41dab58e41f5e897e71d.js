
const cardsContainer = document.querySelector("#cards");
const cardsContents = document.querySelectorAll(".card");

cardsContainer.addEventListener("mousemove", e => { cardsContents.forEach(card => {
const rect = card.getBoundingClientRect(),
x = e.clientX - rect.left,
y = e.clientY - rect.top;

card.style.setProperty("--mouse-x", `${x}px`);
card.style.setProperty("--mouse-y", `${y}px`);
});

});
