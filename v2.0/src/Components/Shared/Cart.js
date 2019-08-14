import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Cart component
 * renders a list of actions
 * @props title
 *      action list: title, image, id
 * 
 */
class Cart extends React.Component {
    render(){
        return (
            // <!--Cart Outer-->
            <div className="cart-outer mb-5">
                <h3 className="center m-0">{this.props.title}</h3>
                <div className="table-outer">
                    {this.props.actionRels ?
                        <table className="cart-table" style = {{width:'100%'}}>
                            <thead className="cart-header">
                                <tr>
                                    <th className="prod-column">Image</th>
                                    <th className="prod-column">Action</th>
                                    <th className="prod-column"></th>
                                    <th className="prod-column">Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderActions(this.props.actionRels)}
                            </tbody>
                        </table> : null
                    }
                </div>
            </div>
        );
    }
    renderActions(actionRelations) {
        if (!actionRelations || actionRelations.length <= 0) {
            return (
                <tr key="1"><td colSpan="100%"><p className="m-0 p-2 w-100 text-center">Nothing here, yet!</p></td></tr>
            );
        }
        //returns a list of action components
        return Object.keys(actionRelations).map(key => {
            var actionRel = actionRelations[key];
            var action = actionRel.action;
            return (
                <tr key={key}>
                    <td colSpan="1" className="prod-column">
                        <div className="column-box">
                            <figure className="prod-thumb"><Link to={"/actions/" + action.id}><img src={action.image? action.image.url : null} alt="" /></Link></figure>
                        </div>
                    </td>
                    <td colSpan="2" className="prod-column">
                        <div className="column-box">
                            <h4 className="prod-title padd-top-20">{action.title}</h4>
                        </div>
                    </td>
                    <td colSpan="1" className="prod-column">
                        {actionRel.status.toLowerCase() === "todo" ?
                            <div>
                                <button onClick={() => this.props.moveToDone(actionRel)} className="done-btn"> <i className="fa fa-check"></i> </button>
                                <button className="remove-btn"> <i className="fa fa-trash"></i> </button>
                            </div>
                            :
                            null
                        }
                    </td>
                </tr>
            );
        });
    }

} export default Cart;