const button = document.querySelector("#sneaky-btn");
const column = button.closest(".col");
const gomaImage = document.querySelector("#goma-img");

let num = 1;
const limit = 6;

["mouseover", "click"].forEach((type) => {
  button.addEventListener(type, function (e) {
    const columnWidth = column.offsetWidth;

    const top = getRandomNum(window.innerHeight - this.offsetHeight);
    const left =
      getRandomNum(columnWidth - this.offsetWidth) +
      (columnWidth - this.offsetWidth) +
      this.offsetWidth;

    gomaImage.setAttribute("src", "assets/sad-goma-" + num + ".gif");
    num = (num % limit) + 1;

    moveElement(this, "left", left);
    moveElement(this, "top", top);
  });
});

const moveElement = (element, animeType, pixels) => {
  anime({
    targets: element,
    [animeType]: `${pixels}px`,
    easing: "easeOutElastic(1, .5)",
  }).play();
};

const getRandomNum = (num) => {
  return Math.floor(Math.random() * num);
};

const yesButton = document.querySelector(".yes-btn");
const btnHolder = document.querySelector(".btn-holder");

yesButton.addEventListener("click", () => {
  gomaImage.setAttribute("src", "assets/labyu-goma.gif");

  if (btnHolder.classList.contains("accepted")) {
    btnHolder.classList.remove("accepted");
  } else {
    btnHolder.classList.add("accepted");
  }
});
