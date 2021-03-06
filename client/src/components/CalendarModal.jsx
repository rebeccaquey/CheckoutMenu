import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import SingleCalendar from './SingleCalendar.jsx';

const Modal = styled.div`
  border-radius: 12px;
  background: white;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center; 
  box-shadow: rgba(0, 0, 0, 0.28) 0px 8px 28px;
  padding: 10px 15px;
  cursor: default;
  flex-wrap: wrap;
  width: 550px;
  height: 425px;
  right: 0px;
  z-index: 1000;
`;

const Container = styled.div`
  display: block;
  width: 510px;
  padding: 5px;
`;

const SelectContainer = styled.span`
  float: left;
  margin-right: 5px;
`;

const CheckContainer = styled.span`
  float: right;
  margin-left: 5px;
  border: .5px solid #717171;
  border-radius: 8px;
  font-size: 8px;
  width: 250px;
  height: 50px;
`;

const CheckInDate = styled.div`
  border-radius: 5px;
  padding: 8px;
  display: inline-block;
  text-align: left;
  float: left;
  width: 108px;
  height: 34px;
`;

const CheckOutDate = styled.div`
  border-radius: 5px;
  padding: 8px;
  display: inline-block;
  text-align: left;
  float: right;
  width: 108px;
  height: 34px;
`;

const SelectDiv = styled.div`
  margin-bottom: 3px;
  font-weight: 500;
  font-size: 18px;
`;

const NightDiv = styled.div`
  margin-top: 3px;
  font-size: 12px;
  color: #717171
`;

const Keyboard = styled.button`
  display: flex;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  text-align: center;
  padding: 5px;
  float: left;
  border: none;
  background: none;
  :hover {
    background-color: #f7f7f7;
    cursor: pointer;
  }
`;

const Clear = styled.button`
  border-radius: 4px;
  padding: 5px 10px;
  border: none;
  margin: 5px;
  font-size: 14px;
  background: none;
  text-decoration: underline;
  :hover {
    background-color: #f7f7f7;
    cursor: pointer;
  }
`;

const Close = styled.button`
  border-radius: 4px;
  font-size: 14px;
  border: none;
  padding: 5px 10px;
  background: #222222;
  color: white;
  :hover {
    background-color: #000000;
    cursor: pointer;
  }
`;

const CheckInCheckOut = styled.div`
  font-size: 9px;
  font-weight: 600;
  padding: 1px;
`;

const DateAddDate = styled.div`
  font-size: 12px;
  padding: 1px;
  font-weight: 300;
`;

const Keeb = styled.img`
  width: 25px;
  height: auto;
  padding: 3px;
`;

const KeebSpan = styled.span`
  float: left;
`;

const ClearClose = styled.span`
  float: right;
`;

class CalendarModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      months: [],
      checkInDate: '',
      checkOutDate: '',
      nights: 0,
    };
    this.getNextMonths = this.getNextMonths.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleCheckInDate = this.handleCheckInDate.bind(this);
    this.handleCheckOutDate = this.handleCheckOutDate.bind(this);
    this.getNumberOfNights = this.getNumberOfNights.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  componentDidMount() {
    this.getNextMonths();
  }

  handleClose(param) {
    this.props.onClick();
    if (!this.state.checkOutDate && param !== undefined) {
      this.handleClear();
    };
  }

  handleCheckInDate(date) {
    const currentDate = moment(date).format('MMMM DD');
    this.setState({
      checkInDate: date,
    });
    this.props.checkInDate(currentDate);
    if (this.state.checkOutDate) {
      this.setState({
        checkOutDate: '',
      });
    }
  }

  handleCheckOutDate(date) {
    const currentDate = moment(date).format('MMMM DD');
    this.setState({
      checkOutDate: date,
    });
    this.props.checkOutDate(currentDate);
    this.getNumberOfNights(date);
    this.handleClose();
  }

  getNumberOfNights(checkOutDate) {
    let endDate = moment(checkOutDate);
    let startDate = moment(this.state.checkInDate);
    let nights = endDate.diff(startDate, 'days');
    this.setState({
      nights: nights,
    });
    this.props.handleNights(nights, this.state.checkInDate, checkOutDate);
  }

  handleClear() {
    this.setState({
      checkInDate: '',
      checkOutDate: '',
    });
    this.props.checkInDate('');
    this.props.checkOutDate('');
    this.props.clearPropertyData();
  }

  getNextMonths() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let upcomingMonths = [];
    for (let i = 0; i < allMonths.length; i++) {
      if (currentMonth === i) {
        upcomingMonths = allMonths.slice(i);
        break;
      }
    }
    if (upcomingMonths.length !== allMonths.length) {
      for (let i = 0; i < allMonths.length; i++) {
        upcomingMonths.push(allMonths[i]);
        if (upcomingMonths.length === allMonths.length) {
          this.setState({months: upcomingMonths});
          break;
        }
      }
    }
    return upcomingMonths;
  }

  render() {
    if (!this.props.show) {
      return null;
    }
    let currentCheckIn = 'Add date';
    if (this.state.checkInDate) {
      currentCheckIn = this.state.checkInDate.slice(0, -5);
    }
    let currentCheckOut = 'Add date';
    let selectDates = 'Select Dates';
    let currentNights = 'Add your travel dates for exact pricing';
    if (this.state.checkOutDate) {
      currentCheckOut = this.state.checkOutDate.slice(0, -5);
      selectDates = `${this.state.nights} night(s)`;
      currentNights = `${this.state.checkInDate} - ${this.state.checkOutDate}`;
    }
    const dateBorder = {
      border: '1px solid black',
    };
    let checkInBox;
    let checkOutBox;
    if (!this.state.checkInDate) {
      checkInBox = (
        <CheckInDate style={dateBorder}>
          <CheckInCheckOut>CHECK-IN</CheckInCheckOut>
          <DateAddDate>{currentCheckIn}</DateAddDate>
        </CheckInDate>
      );
      checkOutBox = (
        <CheckOutDate>
          <CheckInCheckOut>CHECKOUT</CheckInCheckOut>
          <DateAddDate>{currentCheckOut}</DateAddDate>
        </CheckOutDate>
      );
    } else {
      checkInBox = (
        <CheckInDate>
          <CheckInCheckOut>CHECK-IN</CheckInCheckOut>
          <DateAddDate>{currentCheckIn}</DateAddDate>
        </CheckInDate>
      );
      checkOutBox = (
        <CheckOutDate style={dateBorder}>
          <CheckInCheckOut>CHECKOUT</CheckInCheckOut>
          <DateAddDate>{currentCheckOut}</DateAddDate>
        </CheckOutDate>
      );
    }
    return (
      <div>
        <Modal>
          <Container>
            <SelectContainer>
              <SelectDiv>{selectDates}</SelectDiv>
              <NightDiv>{currentNights}</NightDiv>
            </SelectContainer>
            <CheckContainer>
              <div>
              {checkInBox}
              {checkOutBox}
              </div>
            </CheckContainer>
          </Container>
          <Container>
            <SingleCalendar
              months={this.state.months}
              nights={this.props.nights}
              checkIn={this.state.checkInDate}
              checkOut={this.state.checkOutDate}
              handleCheckIn={this.handleCheckInDate}
              handleCheckOut={this.handleCheckOutDate}
              clearPropertyData={this.props.clearPropertyData}
            />
          </Container>
          <Container>
            <KeebSpan>
              <Keyboard><Keeb src="https://img.icons8.com/small/32/000000/keyboard.png" /></Keyboard>
            </KeebSpan>
            <ClearClose>
              <Close onClick={this.handleClose}>Close</Close>
            </ClearClose>
            <ClearClose>
              <Clear onClick={this.handleClear}>Clear Dates</Clear>
            </ClearClose>
          </Container>
        </Modal>
      </div>
    );
  }
}

export default CalendarModal;
