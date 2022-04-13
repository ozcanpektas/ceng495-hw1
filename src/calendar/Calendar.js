import React, { Component } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import "./CalendarStyles.css";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import axios from "axios";
import Modal from "react-modal";

const styles = {
  wrap: {
    display: "flex",
  },
  left: {
    marginRight: "10px",
  },
  main: {
    flexGrow: "1",
  },
};

const options = {
  title: "Title",
  message: "Message",
  buttons: [
    {
      label: "Yes",
      onClick: () => alert("Click Yes"),
    },
    {
      label: "No",
      onClick: () => alert("Click No"),
    },
  ],
  childrenElement: () => <div />,
  customUI: ({ onClose }) => <div>Welcome to scheduler...</div>,
  closeOnEscape: true,
  closeOnClickOutside: true,
  keyCodeForClose: [8, 32],
  willUnmount: () => {},
  afterClose: () => {},
  onClickOutside: () => {},
  onKeypressEscape: () => {},
  overlayClassName: "overlay-custom-class-name",
};

confirmAlert(options);

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      args: {},
      eventSelected: async (e, data) => {
        let dp, modal;
        this.state.toggleModal();
        switch (data) {
          case 0:
            dp = this.calendar;
            modal = await DayPilot.Modal.prompt(
              "Create a new event:",
              this.state.activities[0]
            );
            dp.clearSelection();
            if (!modal.result) {
              return;
            }
            dp.events.add({
              start: this.state.args.start,
              end: this.state.args.end,
              id: DayPilot.guid(),
              text: modal.result,
            });
            break;
          case 1:
            dp = this.calendar;
            modal = await DayPilot.Modal.prompt(
              "Create a new event:",
              this.state.activities[1]
            );
            dp.clearSelection();
            if (!modal.result) {
              return;
            }
            dp.events.add({
              start: this.state.args.start,
              end: this.state.args.end,
              id: DayPilot.guid(),
              text: modal.result,
            });
            break;
          default:
            dp = this.calendar;
            modal = await DayPilot.Modal.prompt(
              "Create a new event:",
              this.state.activities[2]
            );
            dp.clearSelection();
            if (!modal.result) {
              return;
            }
            dp.events.add({
              start: this.state.args.start,
              end: this.state.args.end,
              id: DayPilot.guid(),
              text: modal.result,
            });
        }
      },
      activities: ["event1", "event2", "event3"],
      isOpen: false,
      viewType: "Week",
      durationBarVisible: false,
      timeRangeSelectedHandling: "Enabled",
      toggleModal: () => {
        this.setState({
          isOpen: !this.state.isOpen,
        });
      },
      onTimeRangeSelected: async (args) => {
        this.setState({
          args: args,
        });
        confirmAlert({
          title: "Event Selection Type",
          message: "Will you use auto-event feature?",
          buttons: [
            {
              label: "Yes",
              onClick: async () => {
                for (let i = 0; i < 3; i++) {
                  const response = await axios.get(
                    "https://www.boredapi.com/api/activity/"
                  );
                  let activity = this.state.activities;
                  activity[i] = response.data.activity;
                  this.setState({
                    activities: activity,
                  });
                }
                this.state.toggleModal();
              },
            },
            {
              label: "No",
              onClick: async () => {
                const dp = this.calendar;
                const modal = await DayPilot.Modal.prompt(
                  "Create a new event:",
                  "Type event here..."
                );
                dp.clearSelection();
                if (!modal.result) {
                  return;
                }
                dp.events.add({
                  start: args.start,
                  end: args.end,
                  id: DayPilot.guid(),
                  text: modal.result,
                });
              },
            },
          ],
        });
      },
      eventDeleteHandling: "Update",
      onEventClick: async (args) => {
        const dp = this.calendar;
        const modal = await DayPilot.Modal.prompt(
          "Update event text:",
          args.e.text()
        );
        if (!modal.result) {
          return;
        }
        const e = args.e;
        e.data.text = modal.result;
        dp.events.update(e);
      },
    };
  }

  componentDidMount() {
    // load event data
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;
    this.setState({
      startDate: today,
      events: [],
    });
  }

  render() {
    const { ...config } = this.state;
    return (
      <div style={styles.wrap}>
        <Modal
          isOpen={this.state.isOpen}
          onRequestClose={this.state.toggleModal}
          contentLabel="My dialog"
        >
          <div>
            <p className="rr">Please click one of event below.</p>
            <ul>
              <li onClick={(e) => this.state.eventSelected(e, 0)}>
                <button>{this.state.activities[0]}</button>
              </li>
              <li onClick={(e) => this.state.eventSelected(e, 1)}>
                <button>{this.state.activities[1]}</button>
              </li>
              <li onClick={(e) => this.state.eventSelected(e, 2)}>
                <button>{this.state.activities[2]}</button>
              </li>
            </ul>
            <button onClick={this.state.toggleModal}>Exit</button>
            <style>
              {
                "\
        .rr{\
          color:red;\
          border:1px solid red;\
        }\
      "
              }
            </style>
          </div>
        </Modal>
        <DayPilotCalendar
          {...config}
          ref={(component) => {
            this.calendar = component && component.control;
          }}
        />
      </div>
    );
  }
}

export default Calendar;
