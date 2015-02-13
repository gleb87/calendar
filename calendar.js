/**
 * options:
 *   year/month {number} год/месяц для календаря
 *   value {Date} текущая выбранная дата
 */
function Calendar(options) {
	/* ваш код */
	var self = this;

	var year = options.year;
	var month = options.month;

	var calendarElem;

	var value = options.value;
	if (value) setValue(value, true);

	self.getElement = getElement;
	self.setValue = setValue;

	function setValue(date, quiet) {
		var newYear = date.getFullYear();
		var newMonth = date.getMonth();
		var calendarElemParent = calendarElem && calendarElem.parent();


		if (year != newYear || month != newMonth) {
			deleteCalendarElem();
			year = newYear;
			month = newMonth;
		};

		var calElem = getElement();
		if (calendarElemParent) calendarElemParent.append(calElem);

		var calendarCells = calElem.find("td");
		calendarCells.removeClass("selected");
		calendarCells.eq(getCellByDate(date)).addClass("selected");

		if (!quiet) {
			$(self).triggerHandler({
				type: "select",
				value: date,
			});
		}
	}

	function getElement() {
		if (!calendarElem) createCalendarElem(year, month);

		return calendarElem;
	}

	function deleteCalendarElem() {
		if (!calendarElem) return;

		calendarElem.remove();
		calendarElem = null;
	}

	function createCalendarElem(y, m) {
		calendarElem = $(renderCalendarTable(y, m));

		calendarElem.on("click", "td", onCalendarCellClick);
	}

	function onCalendarCellClick() {
		var date = $(this).html();
		if ( !date ) return;

		setValue( new Date(year, month, date) );
	}

	/**
	 * Возвращает по дате номер TD в таблице
	 * Использование:
	 *  var td = table.find('td').eq(getCellByDate(date))
	 */
	function getCellByDate(date) {
		var date1 = new Date(date.getFullYear(), date.getMonth(), 1);

		return getDay(date1) + date.getDate() - 1;
	}

	/**
	 * получить номер дня недели для date, от 0(пн) до 6(вс)
	 * @param date
	 */
	function getDay(date) { //
		var day = date.getDay();
		if (day == 0) day = 7;
		return day - 1;
	}

	/**
	 * Генерирует таблицу для календаря заданного месяца/года
	 * @param year
	 * @param month
	 */
	function renderCalendarTable(year, month) {
		var monthNames = 'Январь Февраль Март Апрель Май Июнь Июль Август Сентябрь Октябрь Ноябрь Декабрь'.split(' ');

		var d = new Date(year, month);

		var head = '<table class="calendar-table"><caption>' + monthNames[month] + ' ' + year +
			'</caption><tr><th>пн</th><th>вт</th><th>ср</th><th>чт</th><th>пт</th><th>сб</th><th>вс</th></tr><tr>';
		var table = [head];

		for (var i = 0; i < getDay(d); i++) {
			table.push('<td></td>');
		}

		// ячейки календаря с датами
		while (d.getMonth() == month) {
			table.push('<td class="date-cell">' + d.getDate() + '</td>');

			if (getDay(d) % 7 == 6) { // вс, последний день - перевод строки
				table.push('</tr><tr>');
			}

			d.setDate(d.getDate() + 1);
		}

		// добить таблицу пустыми ячейками, если нужно
		if (getDay(d) != 0) {
			for (var i = getDay(d); i < 7; i++) {
				table.push('<td></td>');
			}
		}

		table.push('</tr></table>');

		return table.join('\n')
	}

}