import React from 'react';
import moment from 'moment';
import styled, { withTheme } from 'styled-components';
import CalendarMonth from './CalendarMonth.jsx';
import CalendarView from './CalendarView.jsx';
import { date } from 'faker';

const Weekdays = styled.span`
  padding: 10px;
  text-align: center;
  font-size: 10px;
  color: #717171;
`;

const BetweenWeekdays = styled.span`
  margin: 20px;
`;

const EachWeek = styled.tr`
  font-size: 12px;
  margin: 2px;
`;

const EachDay = styled.td`
  font-weight: 500;
  width: 20px;
  height: 20px;
  padding: 5px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 55%;
  border: 1px solid transparent;
  :hover {
    border-radius: 55%;
    border: 1px solid black;
  }
`;

const WeekdayDiv = styled.div`
  margin: 10px 0;
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
      firstSelected: '',
      clicked: false,
    };
    this.currentDay = this.currentDay.bind(this);
    this.getDaysInMonth = this.getDaysInMonth.bind(this);
    this.getFirstDay = this.getFirstDay.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePreviousClick = this.handlePreviousClick.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleCheckInClick = this.handleCheckInClick.bind(this);
  }

  componentDidMount() {
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
    let dateSelected = `${e.target.id} ${e.target.innerHTML} ${e.target.className.slice(-4)}`;
    if (e.target.className.slice(-6) === 'today_') {
      dateSelected = `${e.target.id} ${e.target.innerHTML} ${new Date().getFullYear()}`;
    }
    if (e.target.className !== 'empty calendar-day' && (e.target.className !== 'calendar-day__') && (dateSelected.slice(0, 3) !== ' <t')) {
      if (!this.props.checkIn) {
        this.setState({
          firstSelected: dateSelected,
        });
        this.handleCheckInClick(e);
        this.props.handleCheckIn(dateSelected);
      } else if (!this.props.checkOut) {
        if (moment(dateSelected).isAfter(this.state.firstSelected, 'day')) {
          this.props.handleCheckOut(dateSelected);
        }
      } else {
        this.props.handleCheckIn(dateSelected);
        this.handleCheckInClick(e);
        this.setState({
          firstSelected: dateSelected,
        });
        this.props.clearPropertyData();
      }
    }
  }

  handleCheckInClick(e) {
    let dateSelected = `${e.target.id} ${e.target.innerHTML} ${e.target.className.slice(-4)}`;
    this.setState({
      clicked: true,
    });
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
        let current = '';
        let available = '';
        const date = `${eachMonth} ${d} ${currentYear}`;
        const prevDayStyle = {
          textDecoration: 'line-through',
          color: '#dddddd',
          fontSize: '12px',
          cursor: 'default',
          width: '20px',
          height: '20px',
          padding: '5px',
          borderRadius: '55%',
          border: '1px solid transparent',
        };
        let eachDay;
        const clickedStyle = {
          color: 'white',
          background: 'black',
        };

        if (date === currentDate) {
          current = 'today';
          if (this.state.clicked && this.state.firstSelected === date) {
            eachDay = <EachDay style={clickedStyle} key={`day${d}`} className={`calendar-day_${current}_${available}`} id={`${eachMonth}`}>{d}</EachDay>;
          } else if (!this.state.clicked) {
            eachDay = <EachDay key={`day${d}`} className={`calendar-day_${current}_${available}`} id={`${eachMonth}`}>{d}</EachDay>;
          } else {
            eachDay = <td style={prevDayStyle} key={`day${d}`} className={`calendar-day_${current}_${available}`} id={`${eachMonth}`}>{d}</td>;
          }
        } else if (moment(currentDate).isBefore(date, 'day')) {
          available = date;
          if (this.state.clicked && this.state.firstSelected === date) {
            eachDay = <EachDay style={clickedStyle} key={`day${d}`} className={`calendar-day_${current}_${available}`} id={`${eachMonth}`}>{d}</EachDay>;
          } else if (this.state.clicked && moment(this.state.firstSelected).isAfter(date, 'day')) {
            eachDay = <td style={prevDayStyle} key={`day${d}`} className={`calendar-day_${current}_${available}`} id={`${eachMonth}`}>{d}</td>;
          } else {
            eachDay = <EachDay key={`day${d}`} className={`calendar-day_${current}_${available}`} id={`${eachMonth}`} >{d}</EachDay>;
          }
        } else {
          eachDay = <td style={prevDayStyle} key={`day${d}`} className={`calendar-day_${current}_${available}`} id={`${eachMonth}`}>{d}</td>;
        }

        allDaysInMonth.push(eachDay);
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
    let displayedCals = calendarMonth.slice(this.state.start, this.state.end);
    let displayedMonths = monthsAndYear.slice(this.state.start, this.state.end);
    return (
      <div>
        <div>
          <CalendarMonth month={displayedMonths} nextClick={this.handleNextClick} previousClick={this.handlePreviousClick} toggleNext={this.state.next} togglePrevious={this.state.previous} />
        </div>
        <WeekdayDiv>
          {weekdays}
          <BetweenWeekdays> </BetweenWeekdays>
          {weekdays}
        </WeekdayDiv>
        <CalendarView calendar={displayedCals} />
      </div>
    );
  }
}
export default SingleCalendar;