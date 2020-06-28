import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import CalendarMonth from './CalendarMonth.jsx';
import CalendarView from './CalendarView.jsx';

const Weekdays = styled.span`
  padding: 7px;
  text-align: center;
  font-size: 10px;
  color: #717171;
`;

const BetweenWeekdays = styled.span`
  margin: 13px;
`;

const EachWeek = styled.tr`
  font-size: 10px;
`;

// const EachDay = styled.td.attrs(props => ({
//   className: props.className,
// }))`
//   & .calendar-day__{
//     text-decoration: line-through;
//     color: #717171;
//   }
//   & .calendar-day_today{
//     font-weight: bold;
//   }
// `;

const EachDay = styled.td.attrs(props => ({
  className: 'calendar-day__',
}))`
  text-decoration: line-through;
  color: #717171;
`;

const calendarKeys = {January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12};

class SingleCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(),
      currentMonth: 0,
      allMonths: [],
      start: 0,
      end: 2,
      previous: false,
      next: true,
      // value: '',
    };
    this.currentDay = this.currentDay.bind(this);
    this.getDaysInMonth = this.getDaysInMonth.bind(this);
    this.getFirstDay = this.getFirstDay.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePreviousClick = this.handlePreviousClick.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
  }

  componentDidMount() {
    // month is 0 based, so add one to get the current month
    const today = new Date();
    this.setState({
      currentMonth: today.getMonth() + 1,
    });
  }

  getDaysInMonth(month, year) {
    let days = moment(`${year}-${month}`, "YYYY-MMMM").daysInMonth();
    return days;
  }

  getFirstDay(month, year) {   
    let first = moment(`${year}-${month}`, 'YYYY-MMMM').startOf("month").format("d");
    return first;
  }

  currentDay() {
    return moment().format("D");
  }

  handleNextClick(e) {
    this.setState((prevState, props) => ({
      start: prevState.start + 1,
      end: prevState.end + 1,
    }));
    if (!this.state.previous) {
      this.setState({
        previous: true,
      });
    }
    if (this.state.end === 11) {
      this.setState({
        next: false,
      });
    }
  }

  handlePreviousClick(e) {
    this.setState((prevState, props) => ({
      start: prevState.start - 1,
      end: prevState.end - 1,
    }));
    if (!this.state.next) {
      this.setState({
        next: true,
      });
    }
    if (this.state.start === 1) {
      this.setState({
        previous: false,
      });
    }
  }

  handleDayClick(e) {
    console.log(e.target.id);
    console.log(e.target.className);
    // if day is empty or before current day or not available, do nothing...

    // had to add the two underscores at the end of 'calendar-day__' to account for the possibilites of today and the date;
    if (e.target.className !== 'empty calendar-day' && (e.target.className !== 'calendar-day__')) {
      if (!this.props.checkIn) {
        this.props.handleCheckIn(`${e.target.id} ${e.target.innerHTML}`);
      } else if (!this.props.checkOut) {
        this.props.handleCheckOut(`${e.target.id} ${e.target.innerHTML}`);
      } else {
        this.props.handleCheckIn(`${e.target.id} ${e.target.innerHTML}`);
      }
    }
    
  }

  render() {
    const daysOfWeek = moment.weekdaysMin();
    const weekdays = daysOfWeek.map((day, i) => <Weekdays key={i} className="week-days">{day}</Weekdays>);
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    let currentDate = moment(today).format('MMMM DD YYYY');
    let calendarMonth = [];
    let monthsAndYear = [];
    console.log(currentDate);
    // console.log('MONTH: ', this.state.currentMonth);

    for (let i = 0; i < this.props.months.length; i++) {
      let eachMonth = this.props.months[i];

      if (eachMonth === 'January' && this.props.months[0] !== 'January') {
        currentYear++;
      }

      let blanks = [];
      for (let i = 0; i < this.getFirstDay(eachMonth, currentYear); i++) {
        blanks.push(
          <td key={`blank${i}`} className="empty calendar-day">{""}</td>,
        );
      }

      let allDaysInMonth = [];
      for (let d = 1; d <= this.getDaysInMonth(eachMonth, currentYear); d++) {
        let current = d == this.currentDay() ? "today" : "";
        let available = '';
        let date = `${eachMonth} ${d} ${currentYear}`;
        if (moment(currentDate).isBefore(date, 'day')) {
          available = date;
        }
        allDaysInMonth.push(
          <EachDay key={`day${d}`} className={`calendar-day_${current}_${available}`} id={`${eachMonth}`} >{d}</EachDay>,
        );
      }

      let totalSlots = [...blanks, ...allDaysInMonth];
      let rows = [];
      let cells = [];
      totalSlots.forEach((row, column) => {
        if (column % 7 !== 0) {
          cells.push(row);
        } else {
          rows.push(cells);
          cells = [];
          cells.push(row);
        }
        if (column === totalSlots.length - 1) {
          rows.push(cells);
        }
      });
      calendarMonth.push(rows.map((d, i) => (<EachWeek onClick={this.handleDayClick} key={i}>{d}</EachWeek>)));
      monthsAndYear.push(`${eachMonth} ${currentYear}`);
    }
    //once next is clicked, change to 1, 3. 
    let displayedCals = calendarMonth.slice(this.state.start, this.state.end);
    let displayedMonths = monthsAndYear.slice(this.state.start, this.state.end);
    return (
      <div>
        <div>
          <CalendarMonth month={displayedMonths} nextClick={this.handleNextClick} previousClick={this.handlePreviousClick} toggleNext={this.state.next} togglePrevious={this.state.previous} />
        </div>
        <div>
          {weekdays}
          <BetweenWeekdays> </BetweenWeekdays>
          {weekdays}
        </div>
        <CalendarView calendar={displayedCals} />
      </div>
    );
  }
}
export default SingleCalendar;