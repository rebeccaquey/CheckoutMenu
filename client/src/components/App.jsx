import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import moment from 'moment';
import { createGlobalStyle } from "styled-components";
import Calculations from './Calculations.jsx';
import Loading from './Loading.jsx';
import PropertyData from './PropertyData.jsx';
import DatesGuestsView from './DatesGuestsView.jsx';

const GlobalStyles = createGlobalStyle`
  body {
    font-family: Montserrat, sans-serif;
  }
`;

const TotalWrapper = styled.div`
  position: relative;
  border-radius: 12px;
  border: none;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 6px 16px 0px;
  width: 320px;
  height: 410px;
  padding: 20px;
  font-size: 12px;
  margin: auto;
`;

const Button = styled.button`
  color: white;
  justify-content: center;
  text-align: center;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  letter-spacing: 1px;
  margin: 15px 5px;
  width: 310px;
  height: 45px;
  cursor: pointer;
  background: linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%);
  :hover {
  background-image: radial-gradient(circle at center center, rgb(255, 56, 92) 0%, rgb(230, 30, 77) 27.5%, rgb(227, 28, 95) 40%, rgb(215, 4, 102) 57.5%, rgb(189, 30, 89) 75%, rgb(189, 30, 89) 100%) !important;
  transition: opacity 1.25s ease 0s !important;
}
`;

const Footer = styled.div`
  text-align: center;
  font-size: 11px;
  padding: 5px;
  letter-spacing: .2px;
  color: #222222;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      propertyData: {},
      calendar: false,
      nights: 0,
      calculationsData: [{}, {}, {}],
      checkIn: '',
      checkOut: '',
      totalCost: 0,
      resGuestCount: 1,
      adults: 1,
      children: 0,
      infants: 0,
    };
    this.handleNights = this.handleNights.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleClearDates = this.handleClearDates.bind(this);
    this.getTotalCost = this.getTotalCost.bind(this);
    this.getGuestCount = this.getGuestCount.bind(this);
    this.getAdultCount = this.getAdultCount.bind(this);
    this.getChildrenCount = this.getChildrenCount.bind(this);
    this.getInfantCount = this.getInfantCount.bind(this);
  }

  componentDidMount() {
    const roomId = Math.floor(Math.random() * 99) + 1;
    axios.get(`/checkout/${roomId}`)
      .then(({data}) => {
        this.setState({
          propertyData: data,
        });
        this.setState({
          loading: false,
        });
      })
      .catch((err) => {
        console.log('react get request error: ', err);
      });
  }

  getTotalCost(total) {
    this.setState({
      totalCost: total,
    });
  }

  getGuestCount(guests) {
    this.setState({
      resGuestCount: guests,
    });
  }

  getAdultCount(adults) {
    this.setState({
      adults: adults,
    });
  }

  getChildrenCount(children) {
    this.setState({
      children: children,
    });
  }

  getInfantCount(infants) {
    this.setState({ infants });
  }

  handleClearDates() {
    this.setState({
      calendar: false,
    });
  }

  handleNights(nights, checkIn, checkOut) {
    this.setState({
      nights: nights,
      calendar: true,
      checkIn: checkIn,
      checkOut: checkOut,
      calculationsData: [
        {cleaningFee: (Math.floor(Math.random() * 16) + 5) * 5},
        {serviceFee: Math.floor(this.state.propertyData.nightly_rate * nights * .12)},
        {occupancyFee: Math.floor(this.state.propertyData.nightly_rate * nights * .11)},
      ],
    });
  }

  handleButtonClick() {
    const today = moment().format('YYYY-MM-DD');
    let year = '2020';
    let checkIn = moment(`${this.state.checkIn} ${year}`, 'MMMM DD YYYY').format('YYYY-MM-DD');
    let checkOut = moment(`${this.state.checkOut} ${year}`, 'MMMM DD YYYY').format('YYYY-MM-DD');
    if (checkOut < today) {
      year = '2021';
      checkOut = moment(`${this.state.checkOut} ${year}`, 'MMMM DD YYYY').format('YYYY-MM-DD');
      if (checkIn < today) {
        checkIn = moment(`${this.state.checkIn} ${year}`, 'MMMM DD YYYY').format('YYYY-MM-DD');
      }
    }
    const reservationData = {
      property_id: this.state.propertyData.id,
      check_in: checkIn,
      check_out: checkOut,
      nights: this.state.nights,
      nightly_rate: this.state.propertyData.nightly_rate,
      total_cost: this.state.totalCost,
      guest_count: this.state.resGuestCount,
      adults: this.state.adults,
      children: this.state.children,
      infants: this.state.infants,
    };
    axios.post(`/checkout/${reservationData.property_id}`, reservationData)
      .then((res) => {
        console.log('axios post response: ', res);
      })
      .catch((err) => {
        console.log('axios post error: ', err);
      });
  }

  render() {
    let loadingPage;
    let button = '...';
    let msg = '';
    if (this.state.loading) {
      loadingPage = <Loading />;
    } else {
      loadingPage = <PropertyData data={this.state.propertyData} />;
      button = 'Reserve';
      msg = 'You won\'t be charged yet';
    }

    let dates;
    if (!this.state.calendar) {
      dates = '';
      button = 'Check availability';
      msg = '';
    } else {
      const basePrice = this.state.propertyData.nightly_rate * this.state.nights;
      dates = <Calculations rate={this.state.propertyData.nightly_rate} calculationsData={this.state.calculationsData} basePrice={basePrice} nights={this.state.nights} getTotalCost={this.getTotalCost} />;
    }

    return (
      <TotalWrapper>
        <GlobalStyles />
        {loadingPage}
        <DatesGuestsView
          nights={this.state.nights}
          guestsAllowed={this.state.propertyData.total_guests_allowed}
          handleNights={this.handleNights}
          clearPropertyData={this.handleClearDates}
          getGuestCount={this.getGuestCount}
          getAdultCount={this.getAdultCount}
          getChildrenCount={this.getChildrenCount}
          getInfantCount={this.getInfantCount}
          guests={this.state.resGuestCount}
          adults={this.state.adults}
          children={this.state.children}
          infants={this.state.infants}
        />
        {dates}
        <Button onClick={this.handleButtonClick}>{button}</Button>
        <Footer>{msg}</Footer>
      </TotalWrapper>

    );
  }
}

export default App;