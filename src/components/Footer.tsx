import { FaBook, FaHome, FaInfo } from "react-icons/fa"
import { Link } from "react-router-dom"

const Footer = () => {
    return (
        <div className="btm-nav">
            <Link to="/">
                <button className="active">
                    <FaHome className="h-5 w-5" />
                </button>
            </Link>
            <Link to="/story">
                <button>
                    <FaBook className="h-5 w-5" />
                </button>
            </Link>
            <Link to="/info">
                <button>
                    <FaInfo className="h-5 w-5" />
                </button>
            </Link>

        </div>

    )
}

export default Footer