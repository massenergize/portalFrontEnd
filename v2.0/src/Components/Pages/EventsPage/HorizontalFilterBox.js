import React, { Component } from "react";
import { connect } from "react-redux";
// import MECheckBoxGroup from "../Widgets/MECheckBoxGroup";
import { getPropsArrayFromJsonArray } from "../../Utils";
import MELightDropDown, { NONE } from "../Widgets/MELightDropDown";
import METextField from "../Widgets/METextField";
class HorizontalFilterBox extends Component {
  constructor() {
    super();
    this.state = {
      activeTags: [],
      dropActive: false,
    };
    this.onItemSelectedFromDropDown = this.onItemSelectedFromDropDown.bind(
      this
    );
  }
  makeTagsSystematic = (tagCols) => {
    //arrange side filters in this order: Categories, Impact, difficulty
    if (!tagCols) return tagCols;
    var arr = [];
    arr[0] = tagCols.filter((item) => item.name === "Category")[0];
    arr[1] = tagCols.filter((item) => item.name === "Impact")[0];
    arr[2] = tagCols.filter((item) => item.name === "Difficulty")[0];
    var the_rest = tagCols.filter((item) => {
      return (
        item.name !== "Category" &&
        item.name !== "Impact" &&
        item.name !== "Difficulty"
      );
    });
    var available = arr.filter((item) => item !== undefined);
    return [...available, ...the_rest];
  };

  // All collections are created by admins
  //all collections have an array of tags
  getCollectionSetAccordingToPage() {
    const { type, tagCols } = this.props;
    if (!type) return [];
    if (type === "testimonial" || type === "service" || type === "event")
      return this.props.collection; //this.props.collection only brings the category collection
    if (!tagCols) return [];
    return tagCols;
  }
  onItemSelectedFromDropDown(name, value, type) {
    const param = { collectionName: type, value };
    this.props.boxClick(param);
    var { activeTags } = this.state;
    activeTags = (activeTags || []).filter(
      (item) => item.collectionName !== param.collectionName
    );
    if (param.value !== NONE) activeTags.push(param);
    this.setState({ activeTags });
    // if (isAlreadyIn.length === 0) {
    //   this.setState({ activeTags: [...activeTags, [name, value]] }); // save the name of the tag, and the value of the tag together in an arr for easy access later
    // }
  }

  renderActiveTags() {
    const { activeTags } = this.state;
    if (!activeTags || activeTags.length === 0)
      return <small>No filters have been applied yet</small>;
    return activeTags.map((tagObj, index) => {
      return (
        <small
          style={{ fontWeight: "600", color: "#7cb331" }}
          // className="round-me h-cat-select"
          key={index.toString()}
          onClick={() => this.deselectTags(tagObj)}
        >
          <span style={{ color: "black" }}>{tagObj.collectionName}</span> :{" "}
          <span>{tagObj.value}</span>
          {index + 1 !== activeTags.length ? " , " : ""}
        </small>
      );
    });
  }
  currentSelectedVal = (set) => {
    const { activeTags } = this.state;
    if (!activeTags) return;
    return activeTags.filter((item) => item.collectionName === set.name)[0];
  };

  renderDifferentCollections = () => {
    const col = this.getCollectionSetAccordingToPage();
    // const col = this.makeTagsSystematic(collection);
    if (col) {
      return col.map((set, index) => {
        const selected = this.currentSelectedVal(set);
        const data = getPropsArrayFromJsonArray(set.tags, "name");
        return (
          <div key={index.toString()} style={{ display: "inline-block" }}>
            <MELightDropDown
              style={{ background: "transparent", marginBottom: 4 }}
              label={
                <span className="h-f-label">
                  {selected ? ` ${selected.value}` : set.name}{" "}
                  {/* {this.renderIcon(selected)} */}
                </span>
              }
              labelIcon={this.renderIcon(selected)}
              data={data}
              onItemSelected={this.onItemSelectedFromDropDown}
              categoryType={set.name}
            />
          </div>
        );
      });
    }
  };

  clearFilters = (e) => {
    e.preventDefault();
    this.setState({ activeTags: [] });
    this.props.boxClick(null, true);
  };
  renderClearFilter() {
    const { activeTags } = this.state;
    return (
      activeTags &&
      activeTags.length > 0 && (
        <center style={{ display: "inline-block" }}>
          <a
            className="filter-close me-open-in"
            href="#void"
            onClick={this.clearFilters}
            style={{ position: "absolute", left: 28, top: -5 }}
          >
            Clear Filters{" "}
            <i className="fa fa-times-circle" style={{ marginLeft: 2 }}></i>
          </a>
        </center>
      )
    );
  }
  renderIcon(selected) {
    // const { dropActive } = this.state;
    if (selected && selected.value)
      return (
        <span
          onClick={() => {
            this.onItemSelectedFromDropDown(
              null,
              NONE,
              selected.collectionName
            );
            console.log("here we go");
          }}
        >
          <i
            className="fa fa-times-circle filter-close"
            style={{ marginLeft: -10, textDecoration: "none" }}
          ></i>
        </span>
      );
    return <i className=" fa fa-angle-down" style={{ marginLeft: -10 }}></i>;
  }
  render() {
    // const { activeTags } = this.state;
    return (
      <div className="hori-filter-container">
        {this.renderClearFilter()}
        {this.renderDifferentCollections()}
        <METextField
          containerStyle={{ display: "inline-block" }}
          style={{ display: "inline-block", borderWidth: 0 }}
        />

        {/* <div
          style={{
            width: "100%",
            padding: 10,
            background: "white",
            minHeight: 40,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
          }}
        >
          {this.renderActiveTags()}
        </div> */}
      </div>
    );
  }
}
const mapStoreToProps = (store) => {
  return {
    collection: store.page.collection,
  };
};

export default connect(mapStoreToProps)(HorizontalFilterBox);
