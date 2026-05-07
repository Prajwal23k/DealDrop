import axios from 'axios'

async function generateAIDescription(title,category)
{
    const res = await axios.post("http://localhost:8000/generate-description",
        {
            title,
            category
        }
    );

    console.log("");

    return res.data;
}

export {generateAIDescription};