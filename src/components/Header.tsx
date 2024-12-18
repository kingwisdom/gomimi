import { Link } from "react-router-dom"

const Header: React.FC = () => {
    return (
        <div className="bg-[teal] text-white p-4">
            <Link to="/"> <h3 className="text-lg font-bold text-right">Welcome to AI Assistant</h3></Link>
        </div>
    )
}

export default Header