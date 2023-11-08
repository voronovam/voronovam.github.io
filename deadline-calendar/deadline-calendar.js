const rusMonths = {
    1: 'января',
    2: 'февраля',
    3: 'марта',
    4: 'апреля',
    5: 'мая',
    6: 'июня',
    7: 'июля',
    8: 'августа',
    9: 'сентября',
    10: 'октября',
    11: 'ноября',
    12: 'декабря',
};

const inputDeadline = document.getElementById('inputDeadline');
const deadline = document.getElementById('deadline');
const calendar = document.getElementById('calendar');
const exportButton = document.getElementById('exportCalendar');

//формат даты
function formatRusDate(date) {
    const [day, month, year] = date.split(' ');
    const monthNumber = Object.keys(rusMonths).find(key => rusMonths[key] === month);
    return `${day} ${rusMonths[monthNumber]} ${year}`;
}

//следит за выбором даты
inputDeadline.addEventListener('change', function () {
    const selectedDate = new Date(inputDeadline.value);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
        alert('Время истекло. Выбери новую дату.');
        inputDeadline.value = '';
    } else {
        exportButton.classList.remove('hide');
        setTimeout(function (){ //для корректной отрисовки выбранной даты
            displayCalendar(currentDate, selectedDate);
        }, 10);

        displaySelectedDate(selectedDate);
        localStorage.setItem('savedDeadline', inputDeadline.value);
    }
});

// прошедшие даты нельзя выбрать
function setMinDateForInput(inputElement) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1); // + 1 день
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const minDate = `${year}-${month}-${day}`;
    inputElement.setAttribute('min', minDate);
}
setMinDateForInput(inputDeadline);

//выводит календарь
function displayCalendar(start, end) {
    calendar.innerHTML = '';

    end.setDate(end.getDate() + 1);

    /*
    // index от меньшего к большему
    let index = 0;

    while (start <= end) {
        const dateDiv = document.createElement('div');
        dateDiv.classList.add('calendar__day');

        const innerDiv = document.createElement('div');
        innerDiv.classList.add('calendar__index');
        innerDiv.textContent = ++index;

        const textDiv = document.createElement('div');
        textDiv.textContent = formatRusDate(start.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }));

        dateDiv.appendChild(innerDiv);
        dateDiv.appendChild(textDiv);
        calendar.appendChild(dateDiv);

        start.setDate(start.getDate() + 1);
    }*/

    // index от большего к меньшему
    const daysCount = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    for (let i = daysCount; i >= 1; i--) {
        const dateDiv = document.createElement('div');
        dateDiv.classList.add('calendar__day');

        const innerDiv = document.createElement('div');
        innerDiv.classList.add('calendar__index');
        innerDiv.textContent = i;

        const textDiv = document.createElement('div');
        textDiv.textContent = formatRusDate(start.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }));

        dateDiv.appendChild(innerDiv);
        dateDiv.appendChild(textDiv);
        calendar.appendChild(dateDiv);

        start.setDate(start.getDate() + 1);
    }
}

//показывает выбранную дату
function displaySelectedDate(selectedDate) {
    deadline.textContent = formatRusDate(selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }));
}

//проверяет есть ли выбранная дата
const savedDeadline = localStorage.getItem('savedDeadline');
if (savedDeadline) {
    displaySelectedDate(new Date(savedDeadline));
    const savedDate = new Date(savedDeadline);
    const currentDate = new Date();

    if (savedDate >= currentDate) {
        exportButton.classList.remove('hide');
        displayCalendar(currentDate, savedDate);
    }
}

exportButton.addEventListener('click', () => {
    const element = calendar;
    const opt = {
        margin:       .2,
        filename:     'deadline_calendar.pdf',
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf(element, opt);
});


