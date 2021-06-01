import dayjs from 'dayjs';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import SmartView from './smart.js';

import {StatisticsFilterType} from '../utilities/constants.js';
import {statisticsRuntimeAdapter} from '../utilities/date.js';

const BAR_HEIGHT = 50;

const getGenresData = (watchedFilms) => {
  const allGenres = watchedFilms.map((film) => film.genres).flat();
  const uniqueGenres = [...new Set(allGenres)];
  const quantityPerGenre = uniqueGenres.map((currentGenre) => allGenres.filter((genre) => genre === currentGenre).length);

  return {
    labels: uniqueGenres,
    quantity: quantityPerGenre,
  };
}

const getTopGenreName = (genresData) => {
  const index = genresData.quantity.indexOf(Math.max(...genresData.quantity));
  const genreName = index >= 0 ? genresData.labels[index] : '';

  return genreName;
};

const getTotalRuntime = (watchedFilms) => {
  let totalRuntime = 0;

  for (const film of watchedFilms) {
    totalRuntime += film.runningTime;
  }

  return statisticsRuntimeAdapter(totalRuntime);
};

const renderChart = (statisticCtx, watchedFilms) => {
  const genresData = getGenresData(watchedFilms);

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genresData.labels,
      datasets: [{
        data: genresData.quantity,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 32,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const getChartHeight = (genresData) => {
  return genresData.labels.length * BAR_HEIGHT;
}

const createStatisticsTemplate = ({currentFilms, currentStatisticsFilterType} = {}) => {
  const genresData = getGenresData(currentFilms);
  const totalRuntimeData = getTotalRuntime(currentFilms);

  //!!! Заменить заглушку ранга на реальные данные
  return `<section class="statistic">
            <p class="statistic__rank">
              Your rank
              <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
              <span class="statistic__rank-label">Movie Buff</span>
            </p>

            <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
              <p class="statistic__filters-description">Show stats:</p>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${currentStatisticsFilterType === StatisticsFilterType.ALL_TIME ? 'checked' : ''}>
              <label for="statistic-all-time" class="statistic__filters-label">All time</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${currentStatisticsFilterType === StatisticsFilterType.TODAY ? 'checked' : ''}>
              <label for="statistic-today" class="statistic__filters-label">Today</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${currentStatisticsFilterType === StatisticsFilterType.WEEK ? 'checked' : ''}>
              <label for="statistic-week" class="statistic__filters-label">Week</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${currentStatisticsFilterType === StatisticsFilterType.MONTH ? 'checked' : ''}>
              <label for="statistic-month" class="statistic__filters-label">Month</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${currentStatisticsFilterType === StatisticsFilterType.YEAR ? 'checked' : ''}>
              <label for="statistic-year" class="statistic__filters-label">Year</label>
            </form>

            <ul class="statistic__text-list">
              <li class="statistic__text-item">
                <h4 class="statistic__item-title">You watched</h4>
                <p class="statistic__item-text">${currentFilms.length} <span class="statistic__item-description">movies</span></p>
              </li>
              <li class="statistic__text-item">
                <h4 class="statistic__item-title">Total duration</h4>
                <p class="statistic__item-text">${totalRuntimeData.hours} <span class="statistic__item-description">h</span> ${totalRuntimeData.minutes} <span class="statistic__item-description">m</span></p>
              </li>

              <li class="statistic__text-item">
                <h4 class="statistic__item-title">Top genre</h4>
                <p class="statistic__item-text">${getTopGenreName(genresData)}</p>
              </li>
            </ul>

            <div class="statistic__chart-wrap">
              <canvas class="statistic__chart" width="1000" height="${getChartHeight(genresData)}"></canvas>
            </div>

          </section>`;
};

export default class Statistics extends SmartView {
  constructor(watchedFilms) {
    super();

    this._state = {
      currentFilms: watchedFilms,
      currentStatisticsFilterType: StatisticsFilterType.ALL_TIME,
    };

    this._watchedFilms = watchedFilms;
    this._daysChart = null;

    this._statisticsFilterTypeChangeHandler = this._statisticsFilterTypeChangeHandler.bind(this);

    this._setChart();
  }

  _setChart() {
    if (this._daysChart !== null) {
      this._daysChart = null;
    }

    this.getElement().querySelector('.statistic__filters').addEventListener('change', this._statisticsFilterTypeChangeHandler);

    const daysCtx = this.getElement().querySelector('.statistic__chart');
    this._daysChart = renderChart(daysCtx, this._state.currentFilms);
  }

  _statisticsFilterTypeChangeHandler(evt) {
    const currentStatisticsFilterType = evt.target.value;

    const currentFilms = currentStatisticsFilterType !== StatisticsFilterType.ALL_TIME
      ? this._watchedFilms.slice().filter((film) => dayjs(film.watchedDate) >= dayjs().subtract(1, currentStatisticsFilterType).toDate())
      : this._watchedFilms.slice();

    this.updateState({
      currentFilms,
      currentStatisticsFilterType,
    });
  }

  restoreHandlers() {
    this._setChart();
  }

  removeElement() {
    super.removeElement();

    if (this._daysChart !== null) {
      this._daysChart = null;
    }
  }

  getTemplate() {
    return createStatisticsTemplate(this._state);
  }
}
