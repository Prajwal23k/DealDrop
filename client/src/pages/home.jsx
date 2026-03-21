import { AuthContext } from "../context/authContext.jsx"
import { useContext,useState,useEffect } from "react";
import { API } from "../api/axios.js"
import { useNavigate } from "react-router-dom";

function Home()
{
    const navigate = useNavigate();
    const {user,logout} = useContext(AuthContext);
    const [auctions,setAuctions] = useState([]);

    useEffect(()=>
    {
        fetchAuctions();
    },[]);

    async function fetchAuctions()
    {
        try{
            const res = await API.get("/auctions");
            setAuctions(res.data);
        }catch(e)
        {
            console.error(e);
        }
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Auctions</h2>

            {user && (
                <>
                    <p>Logged in as: {user.role}</p>
                    <button onClick={logout}>Logout</button>
                </>
            )}

            <hr />

            {auctions.length === 0 ? (
                <p>No auctions available</p>
            ) : (
                auctions.map((auction) => (
                    <div key={auction._id} onClick={()=>navigate(`/auction/${auction._id}`)} style={{ border: "1px solid gray", margin: "10px", padding: "10px", cursor: "pointer" }} >
                        <h3>{auction.title}</h3>
                        <p>{auction.description}</p>
                        <p>Status: {auction.status}</p>
                        <p>Current Price: ₹{auction.currentPrice}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export {Home}