import React from 'react';

/********************************************************************/
/**                        RSVP FORM                               **/
/********************************************************************/
const INITIAL_STATE = {
    error: null,
    choice: null,
};

class ChooseHHForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
        }
        this.onChange = this.onChange.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.status !== this.props.status) {
            this.setState({ error: null })
        }
    }
    render() {
        this.checkHouseholds();
        return (
            <>
                {this.props.open ?
                    <div>
                        {this.state.error ? <p className='text-danger'> {this.state.error} </p> : null}
                        <form onSubmit={this.handleSubmit}>
                            {this.renderRadios(this.props.user.households)}
                            <div>
                                <button className='thm-btn style-4' type='submit' disabled={this.state.error ? true : false}>Submit</button>
                                <button className='thm-btn style-4 red' onClick={this.props.closeForm}> Cancel </button>
                            </div>
                        </form>
                    </div>
                    :
                    null
                }
            </>
        );
    }


    handleSubmit = (event) => {
        if (event) event.preventDefault();

        if (!this.state.choice) {
            this.setState({
                error: "Please select a household"
            })
            return;
        }

        if (this.props.status === "TODO") {
            if (!this.props.inCart(this.props.aid, this.state.choice)) {
                console.log('adding to todo')
                this.props.addToCart(this.props.aid, this.state.choice, this.props.status);
                this.props.closeForm();
            }
        } else if (this.props.status === "DONE") {
            if (!this.props.inCart(this.props.aid, this.state.choice)) {
                console.log('adding to done')
                this.props.addToCart(this.props.aid, this.state.choice, this.props.status);
                this.props.closeForm();
            } else if (this.props.inCart(this.props.aid, this.state.choice, "TODO")) {
                console.log('moving to done')
                this.props.moveToDone(this.props.aid, this.state.choice);
                this.props.closeForm();

            }
        }
    }
    renderRadios(households) {
        return Object.keys(households).map(key => {
            const household = households[key];
            if((this.props.status === "DONE" && !this.props.inCart(this.props.aid, household.id, "DONE")) || (this.props.status==="TODO" && !this.props.inCart(this.props.aid, household.id))){
                return (
                    <div key={key} style={{ display: 'inline-block' }}>
                        <input id={'' + household.name + key} type='radio' value={household.id} name='hhchoice' onChange={this.onChange} style={{ display: 'inline-block' }} />
                        &nbsp;
                            <label htmlFor={'' + household.name + key}> {household.name} </label>
                        &nbsp;&nbsp;&nbsp;
                        </div>
                );
            }
        })
    }
    //updates the state when form elements are changed
    onChange(event) {
        this.setState({
            error: null,
            choice: event.target.value,
        });
    };

    checkHouseholds = () => {
        if (this.props.open) {
            var housesAvailable = [];
            for (var i = 0; i < this.props.user.households.length; i++) {
                var household = this.props.user.households[i];
                if (!this.props.inCart(this.props.aid, household.id, this.props.status)) {
                    housesAvailable.push(household.id)
                }
            }
            if (!this.state.error && !this.state.choice) {
                if (housesAvailable.length === 0) {
                    this.setState({ error: `You have already added this action to ${this.props.status.toLowerCase()} for all of your households` });
                } else if (housesAvailable.length === 1) {
                    if (this.props.status === "TODO") {
                        if (this.props.inCart(this.props.aid, household.id)) {
                            this.setState({ error: `You have already added this action to done for all of your households` });
                        } else {
                            this.setState({ choice: housesAvailable[0] });
                        }
                    } else if (!this.props.inCart(this.props.aid, household.id, "DONE")) {
                        this.setState({ choice: housesAvailable[0] });
                    }
                }
            }
        }
    }
}
export default (ChooseHHForm);


