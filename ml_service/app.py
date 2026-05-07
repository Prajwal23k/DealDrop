from openai import OpenAI
from dotenv import load_dotenv
import os
from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
from sklearn.linear_model import LinearRegression

app = FastAPI()
load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

class AuctionInput(BaseModel):
    title: str
    prices: list
    bidCounts: list

@app.post("/recommend-price")
def recommend_price(data: AuctionInput):
    prices = data.prices
    bid_counts = data.bidCounts

    if len(prices) < 2:
        avg_price = sum(prices) / len(prices) if len(prices) > 0 else 1000
        return {
            "suggestedStartingPrice": int(avg_price * 0.6),
            "expectedFinalPrice": int(avg_price)
        }

    df = pd.DataFrame({
        "bidCount" : bid_counts,
        "price" : prices
    })

    # Features (X)
    X = df[["bidCount"]]

    # Target (y)
    y = df["price"]


    model = LinearRegression()
    model.fit(X, y)

    avg_bid_count = int(df["bidCount"].mean())

    predicted_price = model.predict([[avg_bid_count]])[0]

    return {
        "suggestedStartingPrice": int(predicted_price * 0.6),
        "expectedFinalPrice": int(predicted_price)
    }

class DescriptionInput(BaseModel):
    title: str
    category: str

@app.post("/generate-description")
def generate_description(data: DescriptionInput):

    try:

        prompt = f"""
        Generate a professional auction description for:

        Product: {data.title}
        Category: {data.category}

        Keep it short, attractive, and suitable for an auction marketplace.
        """

        response = client.chat.completions.create(
            model="openai/gpt-3.5-turbo",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        description = response.choices[0].message.content

        return {
            "description": description
        }

    except Exception as e:

        print("AI ERROR:", e)

        return {
            "description":
            f"This {data.title.lower()} belongs to the {data.category.lower()} category and is suitable for auction buyers."
        }