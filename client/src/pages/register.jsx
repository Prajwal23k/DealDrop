import { AuthContext } from "../context/authContext"

function Register()
{
    const {user,logout} = useContext(AuthContext);

    return(
        <div style={{ padding: "20px" }}>
            <h2>Home Page</h2>

            {user ? (
                <>
                    <p>Logged in as: {user.role}</p>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <p>You are not logged in</p>
            )}
        </div>
    )
}

export {Register}