import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api/axios.js";

function CreateAuction() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        startingPrice: "",
        startTime: "",
        endTime: ""
    });

    function handleChange(e) {
        setForm(
            {
                ...form,
                [e.target.name]: e.target.value
            }
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await API.post("/createAuction", form);
            alert("Auction Created Successfully");
            navigate("/");
        }
        catch (e) {
            console.error(e);
            alert(e.response?.data?.message || "Failed to create auction");
        }
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Create Auction</h2>

            <form onSubmit={handleSubmit}>
                <input name="title" placeholder="Title" onChange={handleChange} />
                <br /><br />

                <textarea name="description" placeholder="Description" onChange={handleChange} />
                <br /><br />

                <input
                    type="number"
                    name="startingPrice"
                    placeholder="Starting Price"
                    onChange={handleChange}
                />
                <br /><br />

                <label>Start Time:</label>
                <input
                    type="datetime-local"
                    name="startTime"
                    onChange={handleChange}
                />
                <br /><br />

                <label>End Time:</label>
                <input
                    type="datetime-local"
                    name="endTime"
                    onChange={handleChange}
                />
                <br /><br />

                <button type="submit">Create Auction</button>
            </form>
        </div>
    );
}

export {CreateAuction};