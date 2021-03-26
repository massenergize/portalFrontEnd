import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ErrorPage from "./../Errors/ErrorPage";
import LoadingCircle from "../../Shared/LoadingCircle";
import { apiCall } from "../../../api/functions";
import {
  reduxAddToDone,
  reduxAddToTodo,
  reduxMoveToDone,
} from "../../../redux/actions/userActions";
import {
  reduxChangeData,
  reduxTeamAddAction,
} from "../../../redux/actions/pageActions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
// import SideBar from "../../Menu/SideBar";
import Action from "./PhotoSensitiveAction";
import PageTitle from "../../Shared/PageTitle";
import { filterTagCollections, getPropsArrayFromJsonArray } from "../../Utils";
import MEModal from "../Widgets/MEModal";
import ActionModal from "./ActionModal";
import HorizontalFilterBox from "../EventsPage/HorizontalFilterBox";
import ActionBoxCounter from "./ActionBoxCounter";
import { NONE } from "../Widgets/MELightDropDown";

/**
 * The Actions Page renders all the actions and a sidebar with action filters
 * @props none - fetch data from api instead of getting data passed to you from props
 *
 * @todo change the columns for small sizes change button colors bars underneath difficulty and ease instead of "easy, medium, hard"
 */

class ActionsPage extends React.Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.moveToDoneByActionId = this.moveToDoneByActionId.bind(this);
    this.state = {
      checked_values: null,
      loaded: false,
      openAddForm: null,
      testimonialLink: null,
      openModalForm: null,
      modal_content: {
        //tbd
        image: null,
        title: null,
        desc: null,
        ano: null,
        user: null,
      },
      actionModal: false, //tbd
      mirror_actions: [],
      showTodoMsg: false,
      actions: [],
      status: null,
    };
    // this.doAction = this.doAction.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.addMeToSelected = this.addMeToSelected.bind(this);
  }

  addMeToSelected(param, reset = false) {
    if (reset) return this.setState({ checked_values: null });
    var arr = this.state.checked_values ? this.state.checked_values : [];
    // remove previously selected tag of selected category and put the new one
    arr = arr.filter((item) => item.collectionName !== param.collectionName);
    if (!param || param.value !== NONE) arr.push(param);
    this.setState({ checked_values: arr });
  }

  renderModal() {
    if (this.state.openModalForm) {
      return (
        <MEModal
          showCloseBtn={false}
          closeModal={this.closeModal}
          size="sm"
          contentStyle={{ minWidth: "100%" }}
          style={{ padding: 0 }}
        >
          <ActionModal
            content={this.state.modal_content}
            user={this.props.user}
            status={this.state.status}
            addToCart={(aid, hid, status) => this.addToCart(aid, hid, status)}
            inCart={(aid, hid, cart) => this.inCart(aid, hid, cart)}
            closeModal={this.closeModal}
            moveToDone={this.moveToDoneByActionId}
          />
        </MEModal>
      );
    }
  }

  openModal(params, status) {
    this.setState({
      openModalForm: params.id,
      modal_content: {
        ...params,
      },
      status: status,
    });
  }

  closeModal() {
    this.setState({ openModalForm: null, status: null });
  }

  getContentToDisplay() {
    const checkedValues = this.state.checked_values;
    const { actions } = this.props;
    // filter isnt active yet, just give user all actions
    if (!checkedValues || checkedValues.length === 0) return actions;
    //apply AND filter
    const filters = getPropsArrayFromJsonArray(checkedValues, "value");
    const rem = (actions || []).filter((action) => {
      const actionTags = getPropsArrayFromJsonArray(action.tags, "name");
      const combined = new Set([...filters, ...actionTags]);
      // if the set of unique values of filters and action tags has the same number of elements
      // as the array of tag names of an action, it means an action qualifies for all the selected filters
      return combined.size === actionTags.length && action;
    });
    return rem;
  }

  filterTagCollections(actions) {
    if (!actions) return [];
    const collections = {};
    actions.forEach((action) => {
      action.tags &&
        action.tags.forEach((tag) => {
          const name = tag.tag_collection_name;
          const found = collections[name];
          if (found) {
            if (!found.alreadyIn.includes(tag.id)) {
              collections[name].tags.push(tag);
              collections[name].alreadyIn.push(tag.id);
            }
          } else {
            collections[name] = { name: name, tags: [tag], alreadyIn: [tag.id] };
          }
        });
    });
    const arr = [];
    Object.keys(collections).forEach((key) => {
      arr.push(collections[key]);
    });
    return arr;
  }
  render() {
    if (!this.props.actions) {
      return <LoadingCircle />;
    }

    if (!this.props.homePageData)
      return (
        <ErrorPage
          errorMessage="Data unavailable"
          errorDescription="Unable to load Actions data"
        />
      );

    var actions = this.getContentToDisplay();
    actions = actions
      ? actions.sort((a, b) => {
          return a.rank - b.rank;
        })
      : actions;
    return (
      <>
        {this.renderModal()}
        <div
          className="boxed_wrapper"
          style={{
            height: window.screen.height - 200,
          }}
        >
          <BreadCrumbBar links={[{ name: "All Actions" }]} />
          {/* main shop section */}
          <div className="shop sec-padd">
            <div className="container override-container-width">
              <div className="row">
                {/* renders the sidebar */}
                <div className="phone-vanish col-lg-3 col-md-5 col-sm-12 col-xs-12 sidebar_styleTwo">
                  <div style={{ marginTop: 100 }}>
                    {this.props.user ? (
                      <div className="phone-vanish">
                        <ActionBoxCounter
                          type="DONE"
                          done={this.props.done}
                          link={
                            this.props.links ? this.props.links.profile : "#"
                          }
                        />
                        <ActionBoxCounter
                          type="TODO"
                          style={{ marginTop: 20 }}
                          todo={this.props.todo}
                          link={
                            this.props.links ? this.props.links.profile : "#"
                          }
                        />
                      </div>
                    ) : (
                      <div>
                        <p>
                          <Link to={`${this.props.links.signin}`}>
                            {" "}
                            Sign In{" "}
                          </Link>{" "}
                          to add actions to your todo list or to mark them as
                          complete
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {/* renders the actions */}
                <div className="col-lg-9 col-md-7 col-sm-12 col-xs-12">
                  <HorizontalFilterBox
                    type="action"
                    foundNumber={this.state.mirror_actions.length}
                    searchTextValue={this.state.searchBoxText}
                    tagCols={this.props.tagCols}
                    boxClick={this.addMeToSelected}
                  />
                  <PageTitle style={{ fontSize: 24 }}>
                    Let us know what you have already done, and pledge to do
                    more for impact
                  </PageTitle>

                  <div
                    className="row"
                    id="actions-container mob-actions-page-padding-remove"
                    style={{ marginTop: 10 }}
                  >
                    {this.renderActions(actions)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // on change in any category or tag checkbox update the actionsPage
  handleChange() {
    this.forceUpdate();
  }

  // renders all the actions
  renderActions(actions) {
    if (!actions) {
      return (
        <p style={{ width: "100%", textAlign: "center" }}>
          There aren't any actions available in this community yet, come back
          later.
        </p>
      );
    }
    if (actions.length === 0) {
      return (
        <p style={{ width: "100%", textAlign: "center" }}>
          There aren't any actions in the selected categories.
        </p>
      );
    }
    //returns a list of action components
    return Object.keys(actions).map((key) => {
      var action = actions[key];
      return (
        <Action
          key={key}
          action={action}
          tagCols={this.props.tagCols}
          match={this.props.match} //passed from the Route, need to forward to the action for url matching
          user={this.props.user}
          addToCart={(aid, hid, status) => this.addToCart(aid, hid, status)}
          inCart={(aid, hid, cart) => this.inCart(aid, hid, cart)}
          moveToDone={(aid, hid) => this.moveToDoneByActionId(aid, hid)}
          modalIsOpen={this.state.openModalForm === action.id}
          showTestimonialLink={this.state.testimonialLink === action.id}
          // closeHHForm={() => this.setState({ openAddForm: null })}
          // openHHForm={(aid) => this.setState({ openAddForm: aid })}
          showTodoMsg={this.state.showTodoMsg}
          toggleShowTodoMsg={() => {
            this.setState({ showTodoMsg: false });
          }}
          openModal={this.openModal}
          closeModal={() => this.setState({ openModalForm: null })}
        />
      );
    });
  }

  /**
   * These are the cart functions
   */
  inCart = (aid, hid, cart) => {
    if (!this.props.todo) return false;
    const checkTodo = this.props.todo.filter((actionRel) => {
      return (
        Number(actionRel.action.id) === Number(aid) &&
        Number(actionRel.real_estate_unit.id) === Number(hid)
      );
    });
    if (cart === "TODO") {
      return checkTodo.length > 0;
    }

    if (!this.props.done) return false;
    const checkDone = this.props.done.filter((actionRel) => {
      return (
        Number(actionRel.action.id) === Number(aid) &&
        Number(actionRel.real_estate_unit.id) === Number(hid)
      );
    });
    if (cart === "DONE") return checkDone.length > 0;

    return checkTodo.length > 0 || checkDone.length > 0;
  };
  moveToDone = (actionRel) => {
    const body = {
      user_id: this.props.user.id,
      action_id: actionRel.action.id,
      household_id: actionRel.real_estate_unit.id,
    };
    apiCall("users.actions.completed.add", body)
      .then((json) => {
        if (json.success) {
          this.props.reduxMoveToDone(json.data);
          // this.addToImpact(json.data.action);
          this.setState({ testimonialLink: actionRel.action.id });
        } else {
          console.log(json.error);
        }
        //just update the state here
      })
      .catch((err) => {
        console.log(err);
      });
  };
  moveToDoneByActionId(aid, hid) {
    const actionRel = this.props.todo.filter((actionRel) => {
      return (
        Number(actionRel.action.id) === Number(aid) &&
        Number(actionRel.real_estate_unit.id) === Number(hid)
      );
    })[0];
    if (actionRel) this.moveToDone(actionRel);
  }
  addToCart = (aid, hid, status) => {
    const body = {
      user_id: this.props.user.id,
      action_id: aid,
      household_id: hid,
    };
    const path =
      status === "DONE"
        ? "users.actions.completed.add"
        : "users.actions.todo.add";
    this.setState({ testimonialLink: null });
    apiCall(path, body)
      .then((json) => {
        if (json.success) {
          //set the state here
          if (status === "TODO") {
            this.props.reduxAddToTodo(json.data);
            this.setState({ showTodoMsg: aid });
          } else if (status === "DONE") {
            this.props.reduxAddToDone(json.data);
            // this.addToImpact(json.data.action);
            this.setState({ testimonialLink: aid, showTodoMsg: false });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addToImpact(action) {
    this.changeDataByName("ActionsCompletedData", 1);
    action.tags.forEach((tag) => {
      if (tag.tag_collection && tag.tag_collection.name === "Category") {
        this.changeData(tag.id, 1);
      }
    });
    Object.keys(this.props.user.teams).forEach((key) => {
      this.props.reduxTeamAddAction(this.props.user.teams[key]);
    });
  }

  changeDataByName(name, number) {
    const communityData = this.props.communityData || [];
    var data = communityData.filter((data) => {
      return data.name === name;
    })[0];

    const body = {
      data_id: data.id,
      value: data.value + number > 0 ? data.value + number : 0,
    };
    apiCall("data.update", body).then((json) => {
      if (json.success) {
        data = {
          ...data,
          value: data.value + number > 0 ? data.value + number : 0,
        };
        this.props.reduxChangeData(data);
      }
    });
  }

  changeData(tagid, number) {
    var data = this.props.communityData.filter((data) => {
      if (data.tag) {
        return data.tag === tagid;
      }
      return false;
    })[0];
    if (!data) {
      return;
    }
    const body = {
      data_id: data.id,
      value: data.value + number > 0 ? data.value + number : 0,
    };
    apiCall("data.update", body).then((json) => {
      if (json.success) {
        data = {
          ...data,
          value: data.value + number > 0 ? data.value + number : 0,
        };
        this.props.reduxChangeData(data);
      }
    });
  }
}
const mapStoreToProps = (store) => {
  return {
    homePageData: store.page.homePage,
    auth: store.firebase.auth,
    user: store.user.info,
    todo: store.user.todo,
    done: store.user.done,
    actions: store.page.actions,
    tagCols: filterTagCollections(store.page.actions),
    pageData: store.page.actionsPage,
    communityData: store.page.communityData,
    links: store.links,
  };
};

const mapDispatchToProps = {
  reduxAddToDone,
  reduxAddToTodo,
  reduxMoveToDone,
  reduxChangeData,
  reduxTeamAddAction,
};
export default connect(mapStoreToProps, mapDispatchToProps)(ActionsPage);
