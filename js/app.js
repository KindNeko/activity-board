async function getBoardData(url = "../data/data.json") {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

class BoardDataItem {
  static PERIODS = {
    daily: "day",
    weekly: "week",
    monthly: "mon",
  };
  constructor(data, container = ".board__wrapper", view = "weekly") {
    this.data = data;
    this.container = document.querySelector(container);
    this.view = view;

    this._createMarkup();
  }

  _createMarkup() {
    const { title, timeframes } = this.data;

    const id = title.toLowerCase().replace(/ /g, "-");
    const { current, previous } = timeframes[this.view.toLowerCase()];

    this.container.insertAdjacentHTML(
      "beforeend",
      `<div class="board__item board--${id}">
			<article class="tracking-card">
				<div class="tracking-card__header">
					<h3 class="tracking-card__title">${title}</h3>
					<img
						class="tracking-card__menu"
						src="images/icon-ellipsis.svg"
						alt="menu"
					/>
				</div>
				<div class="tracking-card__main">
					<div class="tracking-card__time">${current}hrs</div>
					<div class="tracking-card__prev-period">Last ${
            BoardDataItem.PERIODS[this.view]
          } - ${previous}hrs</div>
				</div>
			</article>
		</div>`
    );

    this.time = this.container.querySelector(
      `.board--${id} .tracking-card__time`
    );
    this.prev = this.container.querySelector(
      `.board--${id} .tracking-card__prev-period`
    );
  }

  changeView(view) {
    this.view = view.toLowerCase();
    const { current, previous } = this.data.timeframes[this.view.toLowerCase()];

    this.time.innerText = `${current}hrs`;
    this.prev.innerText = `Last ${
      BoardDataItem.PERIODS[this.view]
    } - ${previous}hrs`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  getBoardData().then((data) => {
    const activities = data.map((activity) => new BoardDataItem(activity));

    const selectors = document.querySelectorAll(".view-selector__item");
    selectors.forEach((selector) => {
      selector.addEventListener("click", () => {
        selectors.forEach((sel) =>
          sel.classList.remove("view-selector__item--active")
        );
        selector.classList.add("view-selector__item--active");

        const currentView = selector.innerText.trim().toLowerCase();
        activities.forEach((activity) => activity.changeView(currentView));
      });
    });
  });
});
