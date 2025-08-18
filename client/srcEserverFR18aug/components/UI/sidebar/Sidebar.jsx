import { NavLink } from 'react-router-dom';

import classes from './Sidebar.module.css'


const Sidebar = (props) => {
    let all = () => {
        let arr = props.fu.fu();
        alert(arr)
    }

	return(
        <div className = {classes.sidebar}>
            {
               props.amici && <div> {props.amici.map(e => <p> {e.name} </p>)} </div>
            }

            <p> {props.nameSide} </p> 
            <p onClick = {all}> gg </p>
            <p> {props.count > 0 && 'Thislike ='+props.count }</p>

            <NavLink to="/users"> users </NavLink>
            <NavLink to="/posts"> posts </NavLink>

            {

            }

        </div>
		)
}
export default Sidebar