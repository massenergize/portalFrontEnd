import React, { Component } from "react";
import photo from "./me_energy_default.png";
import MECard from "../Widgets/MECard";
import MELink from "../Widgets/MELink";
import METextView from "../Widgets/METextView";
import * as moment from "moment";
import { getRandomIntegerInRange } from "../../Utils";

export default class METestimonialCard extends Component {
  constructor(props) {
    super(props);
    this.handleReadMore = this.handleReadMore.bind(this);
  }
  getPhoto() {
    const { file } = this.props;
    if (file && file.url) return file.url;
    return photo;
  }
  getBody() {
    const { body } = this.props;
    if (body.length > 90) {
      return (
        <>
          {body.slice(0, 90) + "..."}
          <MELink
            href="#"
            style={{ marginLeft: 6 }}
            onClick={(e) => {
              this.handleReadMore(e);
            }}
          >
            {" "}
            Read more
          </MELink>
        </>
      );
    }
    return body;
  }

  componentDidMount() {
    document.addEventListener(
      "error",
      (e) => {
        if (e.target.tagName.toLowerCase() !== "img") return;
        e.target.src = photo;
        e.target.alt = "The real img is missing, this is a default image";
      },
      true
    );
  }

  handleReadMore(e) {
    e.preventDefault();
    const { id, file, date, user, title, body } = this.props;
    const params = {
      id,
      content: {
        image: file,
        title: title,
        desc: body,
        user: user.preferred_name,
        date: date,
      },
    };
    this.props.readMore(params);
  }
  getFormatedTime(created_at) {
    const format = "MMM, Do YYYY";
    const date = moment(created_at).format(format);
    return date;
  }
  getAnimationClass() {
    const classes = ["me-open-in", "me-open-in-slower", "me-open-in-slowest"];
    const index = getRandomIntegerInRange(3);
    return classes[index];
  }
  render() {
    var {
      id,
      className,
      action,
      preferred_name,
      links,
      created_at,
      title,
    } = this.props;
    action = action ? action : {};
    return (
      <div>
        <MECard
          style={{ padding: 0, position: "relative", borderRadius: 15 }}
          className={`${this.getAnimationClass()} ${className} phone-vanish`}
          // onClick={this.handleReadMore}
          to={`${this.props.links.testimonials}/${id}`}
        >
          <img src={this.getPhoto()} className="me-testimonial-img" />
          <div className="me-testimonial-content-box">
            <div className="me-testimonial-about">
              <small style={{ fontSize: 17 }}>
                <b>{title}</b>
              </small>
              {/* <small style={{ marginLeft: "auto" }}>
                <b>
                  {" "}
                  <span className="fa fa-clock-o" style={{ marginRight: 5 }} />
                  {this.getFormatedTime(created_at)}
                </b>
              </small> */}
            </div>
            <div style={{ padding: 12 }}>
              {/* <METextView
                className="me-testimonial-content"
                style={{ fontSize: 18, color: "#282828" }}
              >
                {title}
              </METextView> */}
              <METextView
                className="me-testimonial-content"
                style={{ fontSize: 15, color: "#282828" }}
              >
                {this.getBody()}
              </METextView>

              <div className="testimonial-link-holder">
                <METextView type="small" style={{ color: "#282828" }}>
                  Related Action
                </METextView>
                <br />
                <MELink
                  to={`${links.actions}/${action.id}`}
                  style={{ fontSize: 14 }}
                >
                  {action.title > 70
                    ? action.title.substring(0, 70) + "..."
                    : action.title}
                </MELink>
              </div>
            </div>
          </div>
        </MECard>

        {/* ------ PHONE MODE -------- */}

        <MECard
          to={`${this.props.links.testimonials}/${id}`}
          className="pc-vanish"
          style={{
            padding: 0,
            position: "relative",
            minHeight: 70,
            marginLeft: 10,
            borderRadius: 6,
            marginBottom: 0,
          }}
        >
          <img
            src={this.getPhoto()}
            style={{
              display: "inline-block",
              width: 80,
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              backgroundRepeat: "no-repeat",
              top: 0,
              left: 0,
              borderRadius: 6,
            }}
          />

          <METextView
            containerStyle={{
              width: "70%",
              marginLeft: "30%",

              padding: "7",
            }}
            style={{ color: "#282828", fontSize: "15px" }}
          >
            {title}
            <br />
            <small>
              <b>By {preferred_name ? preferred_name : "..."}</b>
            </small>
          </METextView>
        </MECard>
      </div>
    );
  }
}

METestimonialCard.defaultProps = {
  body:
    "This is some more information about this testimonial. This is the default text...",
  prefered_name: "Anonymous",
  action: {},
  created_at: "1st January 2020",
  links: {},
};
