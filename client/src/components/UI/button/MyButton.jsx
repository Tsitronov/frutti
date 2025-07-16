import classes from './MyButton.module.css'

const myBtnClass = classes.myBtn;

const MyButton = ({children, external_class=myBtnClass , ...props}) =>{
	return(
		<button {...props} className = {external_class} >
			{children}
		</button>
		)
}
export default MyButton