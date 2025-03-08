import { Link } from "react-router-dom"
export default function NotFound(){
    return(
        <>
        <h1>404 error</h1>
        <button> <Link to="/"> go back to Home</Link></button>
        </>
    )
}