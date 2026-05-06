from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
from sklearn.linear_model import LinearRegression

app = FastAPI()

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